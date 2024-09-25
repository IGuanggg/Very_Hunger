/**
 * 饿了么0元夺宝无脑领取版
 * author:是豪豪呀
 * 可环境变量指定SIGN地址:elmSignUrl
 * export elmSignUrl=''
 * cron: 0 14 0,8,20 * * *
 * 依赖  axios
 */

const $ = new Env('MK饿了么夺宝');
const axios = require('axios');
const ipAddress = require('fs').readFileSync('xsign_host.txt', 'utf8')
const elmSignUrl = process.env.elmSignUrl ? process.env.elmSignUrl : ipAddress;
let cookiesArr = []

if (process.env.elmck) {
    if (process.env.elmck.indexOf('&') > -1) {
        cookiesArr = process.env.elmck.split('&')
    } else {
        cookiesArr.push(process.env.elmck)
    }
}


!(async () => {


    //console.log()
    if (!cookiesArr[0]) {
        $.msg("未获取到elmck变量")
        return;
    }
    $.log(`【提示】开始运行饿了么0元夺宝`);
    $.log(`共获取到[${cookiesArr.length}]个账号,开始任务...`);
    for (let i = 0; i < cookiesArr.length; i++) {
        try {
            var userCookieMap = cookiesToMap(cookiesArr[i]);
            if (!userCookieMap || !userCookieMap.get("USERID")) {
                $.log(`第${i + 1}账号Cookie出现异常,跳过任务`);
                continue;
            }
            $.log("******开始【账号" + (i + 1) + "】" + userCookieMap.get("USERID") + "*********");
            let taskList = await getDBHomepage(cookiesArr[i]);
            if (taskList && taskList.length > 0) {
                console.log(`🎉夺宝信息获取成功,开始无脑领取任务${taskList.length}个夺宝奖励`)
                for (const taskTemp of taskList) {
                    console.log(`👉开始无脑领取${taskTemp.name}`)
                    if (!taskTemp.hasParticipated) {
                        await getDBAward(cookiesArr[i], taskTemp.taskSetId, taskTemp.popTaskId);
                        $.log(`等待5秒`);
                        await $.wait(5000);
                    } else {
                        console.log(`🔴${taskTemp.name}已参与领取,跳过`)
                    }
                }
            }
        } catch (e) {
            console.log("运行异常,继续下一个:" + e.toString())
        }

    }
})();


async function getApiElmSign(api, data, uid, sid) {
    let dataAxios = {
        "data": data, "api": api, "pageId": '', "uid": uid, 'sid': sid, "deviceId": '', "utdid": '',
    }
    //  console.log(JSON.stringify(dataAxios))

    const response = await axios.post(
        elmSignUrl,
        dataAxios,
        {
            headers:
                {"content-type": "application/json"}
        });


    if (response && response.data) {
        //   console.log(response.data)
        return response.data
    }
    console.log('ele-sign接口异常')
    return null;
}


async function elmRequestByApi(cookie, api, data) {

    var cookieMap = cookiesToMap(cookie);
    let uid = cookieMap.get("unb")
    let sid = cookieMap.get("cookie2")
    let uin = cookieMap.get("USERID")

    if (!uid || !sid) {
        console.log(`${uin}饿了么Cookie unb或sid为空`);
        return;
    }
    let elmSignInfo = await getApiElmSign(api, data, uid, sid);

    if (!elmSignInfo || !elmSignInfo['x-sign']) {
        console.log(`${uin}饿了么sign请求失败${api}`);
        return;
    }

    let url = `https://acs.m.goofish.com/gw/${api}/1.0/`
    let headers = {
        "x-sgext": encodeURIComponent(elmSignInfo['x-sgext']),
        "x-sign": encodeURIComponent(elmSignInfo['x-sign']),
        'x-sid': sid,
        'x-uid': uid,
        'x-pv': '6.3',
        'x-features': '1051',
        'x-mini-wua': encodeURIComponent(elmSignInfo['x-mini-wua']),
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'x-t': elmSignInfo['x-t'],
        'x-extdata': 'openappkey%3DDEFAULT_AUTH',
        'x-ttid': '1551089129819@eleme_android_10.14.3',
        'x-utdid': '',
        'x-appkey': '24895413',
        'x-devid': '',
    }

    let params = elmSignInfo['wua'] ? {
        "wua": elmSignInfo['wua'], "data": data
    } : {"data": data};

    const response = await axios.post(url, params, {headers});
    if (response && response.data && response.data.data) {
        return response.data
    }
    return null;

}

function cookiesToMap(cookies) {
    let map = new Map();
    if (cookies) {
        let cookieList = cookies.split(';');
        for (let cookie of cookieList) {
            if (cookie.indexOf("=") > -1) {
                let [key, value] = cookie.split('=');
                map.set(key.trim(), value.trim());
            }
        }
    }
    return map;
}


async function getDBHomepage(cookie) {

    let api = "mtop.koubei.interactioncenter.snatch.homepage.query";
    let data = '{"actId":"20230811111144939171438583","bizScene":"duobao_external","bizSource":"APP","blockList":"[\\"participants\\",\\"wonDetail\\",\\"noWonPrize\\"]","channel":"ELMC","cpnCode":"TIMING_RIGHT","cpnCollectionId":"20230811111144993902427153","latitude":"34.803482852876186","longitude":"113.54791592806578","showStatusSet":"[\\"ONLINE\\",\\"PREPARE\\"]","statusSet":"[\\"ONLINE\\",\\"PREPARE\\"]"}';
    let reposePage = await elmRequestByApi(cookie, api, data);
    /// console.log(JSON.stringify(reposePage))
    if (!reposePage) {
        console.log("❌夺宝信息获取失败")
        return;
    }
    if (JSON.stringify(reposePage.ret).indexOf("SUCCESS") < 0) {
        console.log(`❌夺宝信息获取失败,${JSON.stringify(resultStr.ret)}`)
        return;
    }
    let treasureHuntList = reposePage?.data?.data?.groupSnatchList?.EXCELLENT;
    //console.log(JSON.stringify(treasureHuntList))
    if (treasureHuntList && treasureHuntList.length > 0) {
        let onlinetreasureHuntList = treasureHuntList.filter(item => item.status && item.status.indexOf("ONLINE") > -1).map(item => {
                return {
                    taskSetId: item.properties.taskSetId,
                    popTaskId: item.properties.popTaskId,
                    hasParticipated: item.properties.hasParticipated,
                    name: item.baseInfo.title
                };
            }
        );

        return onlinetreasureHuntList
    }
    return null;
}


async function getDBAward(cookie, missionCollectionId, missionId) {

    let api = "mtop.ele.biz.growth.task.core.receiveprize";
    let data = '{"accountPlan":"HAVANA_COMMON","bizScene":"duobao_external","count":"1","hsf":"1","locationInfos":"[\\"{\\\\\\"lng\\\\\\":113.54791592806578,\\\\\\"lat\\\\\\":34.803482852876186}\\"]","missionCollectionId":"' + missionCollectionId + '","missionId":"' + missionId + '"}';
    let reposePage = await elmRequestByApi(cookie, api, data);
    /// console.log(JSON.stringify(reposePage))
    if (!reposePage) {
        console.log("❌夺宝奖励领取失败")
        return;
    }
    if (JSON.stringify(reposePage.ret).indexOf("SUCCESS") < 0) {
        console.log(`❌夺宝奖励领取失败:${JSON.stringify(reposePage.ret)}`)
        return;
    }
    //console.log(JSON.stringify(reposePage))
    console.log("✅夺宝奖励领取成功")
    return null;
}

function Env(t, e) {
    class s {
        constructor(t) {
            this.env = t
        }

        send(t, e = "GET") {
            t = "string" == typeof t ? {url: t} : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }

        get(t) {
            return this.send.call(this.env, t)
        }

        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }

    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }

        isNode() {
            return "undefined" != typeof module && !!module.exports
        }

        isQuanX() {
            return "undefined" != typeof $task
        }

        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }

        isLoon() {
            return "undefined" != typeof $loon
        }

        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }

        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }

        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {
            }
            return s
        }

        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }

        getScript(t) {
            return new Promise(e => {
                this.get({url: t}, (t, s, i) => e(i))
            })
        }

        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {script_text: t, mock_type: "cron", timeout: r},
                    headers: {"X-Key": o, Accept: "*/*"}
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }

        loaddata() {
            if (!this.isNode()) return {};
            {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
                if (!s && !i) return {};
                {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }

        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }

        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
            return r
        }

        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }

        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }

        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }

        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }

        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }

        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }

        get(t, e = (() => {
        })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                try {
                    if (t.headers["set-cookie"]) {
                        const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                        s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                    }
                } catch (t) {
                    this.logErr(t)
                }
            }).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => {
                const {message: s, response: i} = t;
                e(s, i, i && i.body)
            }))
        }

        post(t, e = (() => {
        })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
                const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                e(null, {status: s, statusCode: i, headers: r, body: o}, o)
            }, t => e(t)); else if (this.isNode()) {
                this.initGotEnv(t);
                const {url: s, ...i} = t;
                this.got.post(s, i).then(t => {
                    const {statusCode: s, statusCode: i, headers: r, body: o} = t;
                    e(null, {status: s, statusCode: i, headers: r, body: o}, o)
                }, t => {
                    const {message: s, response: i} = t;
                    e(s, i, i && i.body)
                })
            }
        }

        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }

        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t} : this.isSurge() ? {url: t} : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
                        return {openUrl: e, mediaUrl: s}
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
                        return {"open-url": e, "media-url": s}
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {url: e}
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }

        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }

        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }

        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }

        done(t = {}) {
            const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
