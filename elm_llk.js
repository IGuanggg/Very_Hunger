/** 饿了么连连看 */


const https = require('https');
https.globalAgent.options.rejectUnauthorized = false;
const $ = new Env('饿了么连连看');
const {
    getCookies,
    sign,
    wait,
    getToken,
    checkCk,
    getUserInfo
} = require("./common.js");
const request = require("request");

async function getGameToken(cookie) {
    let requestData = {
        "bizScene": "LIANLIANKAN",
        "bizMethod": "login",
        "bizParam": JSON.stringify({
            "inviterId": null,
            "gameId": null,
            "token": "token"
        }),
        "longitude": 114.174328,
        "latitude": 22.316555
    };
    const response = await gameRequest(cookie, requestData);
    let resData = JSON.parse(response.data);
    return { token: resData.data.token, openId: resData.data.openId };
}

async function getGameCode(cookie, token) {
    const requestData = {
        "bizScene": "LIANLIANKAN",
        "bizMethod": "startGameV2",
        "bizParam": JSON.stringify({
            "gameId": null,
            "token": token
        }),
        "longitude": 114.174328,
        "latitude": 22.316555
    };
    const response = await gameRequest(cookie, requestData);
    let resData = JSON.parse(response.data);
    if (resData.bizErrorMsg !== "success") {
        console.log(resData.bizErrorMsg == 'The game level complete today' ? '今日已通关，明天再来！' : resData.bizErrorMsg);
        return null;
    }
    return {
        gameCode: resData.data.gameCode,
        levelId: resData.data.levelId,
        serverTime: resData.serverTime,
    };
}

async function passGame(cookie, gameCode, token, openId, gameTimes = 0) {
    try {
        let signStr = await sign(`Game[${openId}]-${token}|${gameCode}${gameTimes}`);
        const requestData = {
            "bizScene": "LIANLIANKAN",
            "bizMethod": "settlement",
            "bizParam": JSON.stringify({
                "gameCode": gameCode,
                "passLevelTime": gameTimes,
                "gameId": null,
                "sign": signStr,
                "token": token
            }),
            "longitude": 114.174328,
            "latitude": 22.316555
        };

        const response = await gameRequest(cookie, requestData);
        let resData = JSON.parse(response.data);

        if (resData.bizErrorMsg !== "success") {
            console.log(resData.bizErrorMsg);
            return null;
        }
        return resData.data;
    } catch (error) {
        console.error("结算游戏过程中发生错误:", error);
        return null;
    }
}

async function playGame(cookie, token, openId, gameTimes = 0) {
    try {
        let timestamp = new Date().getTime();
        const codeData = await getGameCode(cookie, token);
        if (!!codeData) {
            console.log('当前关卡', codeData.levelId);
            if (codeData.levelId == 2) {
                gameTimes = 36;
            } else {
                gameTimes = 8;
            }
            console.log('随机玩游戏' + gameTimes + ' s');
            await wait(gameTimes);
            timestamp = new Date().getTime();
            gameTimes = timestamp - codeData.serverTime;
            const passGameData = await passGame(cookie, codeData.gameCode, token, openId, gameTimes);
            if (!!passGameData) {
                console.log('连连看第' + passGameData.lastLevelId + '关闯关成功');
                if (!!passGameData.lastLevelId && passGameData.lastLevelId !== 3) {
                    console.log('防黑，延迟 1-3 s');
                    await wait(getRandomInt(1, 3));

                    await playGame(cookie, token, openId, gameTimes);
                } else {
                    console.log('任务结束');
                }
            } else {
                console.log('游戏时间出错！');
            }
        } else {
            console.log('没有游戏次数了！');
        }
    } catch (error) {
        console.error("游戏过程中发生错误:", error);
    }
}

async function gameRequest(cookie, requestData = {}) {
    const headers = {
        "authority": "shopping.ele.me",
        "accept": "application/json",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://r.ele.me",
        "pragma": "no-cache",
        "referer": "https://r.ele.me/linkgame/index.html?navType=3&spm-pre=a2ogi.13162730.zebra-ele-login-module-9089118186&spm=a13.b_activity_kb_m71293.0.0",
        "cookie": cookie,
        "x-ele-ua": "RenderWay/H5 AppName/wap Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36",
        "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
    };

    const timestamp = new Date().getTime();
    const appKey = 12574478;
    const token = getToken(cookie).split("_")[0];

    const signStr = await sign(`${token}&${timestamp}&${appKey}&${JSON.stringify(requestData)}`);
    const options = {
        url: "https://shopping.ele.me/h5/mtop.alsc.playgame.mini.game.dispatch/1.0/?jsv=2.6.1&appKey=12574478&t=" + timestamp + "&sign=" + signStr + "&api=mtop.alsc.playgame.mini.game.dispatch&v=1.0&type=originaljson&dataType=json&timeout=5000&subDomain=shopping&mainDomain=ele.me&H5Request=true&pageDomain=ele.me&ttid=h5%40chrome_android_87.0.4280.141&SV=5.0",
        method: "POST",
        headers: headers,
        body: "data=" + encodeURIComponent(JSON.stringify(requestData))
    };

    return new Promise(resolve => {
        request(options, async (error, response, body) => {
            if (!error && response.statusCode === 200) {
                try {
                    const result = JSON.parse(body);
                    const data = result.data;
                    resolve(data);
                } catch (err) {
                    console.log("解析 JSON 失败:", body);
                    resolve(null);
                }
            } else {
                console.log("请求失败:", error, response && response.statusCode);
                resolve(null);
            }
        });
    });
}

async function main() {
    let cookies = [];
    if (process.env.elmck) {
        cookies = getCookies();
    } else {
        cookies = cookies.concat(['']);
        if (cookies.length < 1) {
            console.log("检测到环境变量、本地ck都为空");
            return;
        }
    }

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        try {
            let validCookie = await checkCk(cookie, i);
            if (!validCookie) {
                continue;
            }
            let userInfo = await getUserInfo(validCookie);
            if (!userInfo.userName) {
                console.log("第", i + 1, "账号失效！请重新登录！！！😭");
                continue;
            }
            console.log("\n****** #", i + 1, userInfo.userName, " *********");
            console.log("账号的 id 为", userInfo.localId);

            const { token, openId } = await getGameToken(validCookie);
            await playGame(validCookie, token, openId);

            console.log("防止黑号延时1-3秒");
            await wait(getRandomInt(1, 3));
        } catch (error) {
            console.error("发生错误，继续执行下一个账号:", error);
        }
    }

    process.exit(0);
}

main();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

       
        


// prettier-ignore
function Env (t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send (t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get (t) { return this.send.call(this.env, t) } post (t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode () { return "undefined" != typeof module && !!module.exports } isQuanX () { return "undefined" != typeof $task } isSurge () { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon () { return "undefined" != typeof $loon } toObj (t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr (t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson (t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson (t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript (t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript (t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata () { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata () { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get (t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set (t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata (t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata (t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval (t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval (t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv (t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get (t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post (t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time (t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg (e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log (...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr (t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait (t) { return new Promise(e => setTimeout(e, t)) } done (t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

