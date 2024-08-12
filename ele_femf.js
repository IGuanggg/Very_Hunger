
/**
 * 变量：elmck: 必填，账号cookie，
 * cron 0 5 5 * * *
 * 2023.8.9 更新：首次发布；
 */

const $ = new Env('枫叶_饿了么福尔魔方');

const {
    validateCarmeWithType: _0x5cfa40,
    getCookies: _0x313a08,
    //getUserInfoWithX: _0x4a4a5b,
    wait: _0x5ad5ca,
    commonRequest: _0x5f3540f,
    getCoordinates,
    sign,
    getToken,
    checkCk,
    tryCatchPromise
  } = require("./common.js"),
  request = require("request"),
  _0x57253e = process.env.ELE_CARME,
  _0x1c5d9a = 16;
async function h5Req(_0x4345d5d, _0x525231fc) {
  const _0x9519bd = {
      authority: "shopping.ele.me",
      accept: "application/json",
      "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      origin: "https://r.ele.me",
      pragma: "no-cache",
      referer: "https://r.ele.me/linkgame/index.html?navType=3&spm-pre=a2ogi.13162730.zebra-ele-login-module-9089118186&spm=a13.b_activity_kb_m71293.0.0",
      cookie: _0x435d5d,
      //"x-ele-ua": "RenderWay/H5 AppName/wap Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36",
      //"user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
    },
    _0x395caf = new Date().getTime(),
    _0xc3123 = 12574478;
  var _0x262d46 = "data=" + encodeURIComponent(JSON.stringify(_0x5231fc));
  const _0x3d0021 = getToken(_0x435d5d),
    _0x15dbe5 = _0x3d0021.split("_")[0],
    _0x4c2b9e = await sign(_0x15dbe5 + "&" + _0x395caf + "&" + _0xc3123 + "&" + JSON.stringify(_0x5231fc), process.env.ELE_CARME),
    _0xb036ce = {
      url: "https://shopping.ele.me/h5/mtop.koubei.interactioncenter.platform.right.lottery/1.0/?jsv=2.6.1&appKey=12574478&t=" + _0x395caf + "&sign=" + _0x4c2b9e + "&api=mtop.koubei.interactioncenter.platform.right.lottery&v=1.0&type=originaljson&dataType=json&timeout=5000&subDomain=shopping&mainDomain=ele.me&H5Request=true&pageDomain=ele.me&ttid=h5%40chrome_android_87.0.4280.141&SV=5.0",
      method: "POST",
      headers: _0x9519bd,
      body: _0x262d46
    };
  return tryCatchPromise(_0x2a583b => {
    request(_0xb036ce, (_0x50c447, _0x3d3170, _0x300d49) => {
      _0x2a583b(JSON.parse(_0x300d49));
    });
  });
}
async function initEnv(_0x22eacf, _0x47cef2, _0x48ccf4) {
  const _0xa1af4f = _0x57253e,
    _0x1b31ad = {
      method: "POST",
      url: process.env.HOST + "/check/getumtid",
      headers: {
        "user-agent": "Apifox/1.0.0 (imsb)",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        carmi: _0xa1af4f,
        latitude: _0x47cef2,
        longitude: _0x48ccf4
      })
    };
  return tryCatchPromise(_0xdd0ccd => {
    request(_0x1b31ad, async (_0x15535abe, _0x250c566, _0x56561a4) => {
      if (!_0x135abe && _0x20c566.statusCode === 200) {
        _0x5661a4 = JSON.parse(_0x5661a4);
        _0x5661a4.code === 20000 ? _0xdd0ccd(_0x5661a4.data) : (console.log(_0x5661a4.message), _0xdd0ccd());
      } else {
        console.log(_0x135abe || _0x5661a4);
        _0xdd0ccd();
      }
    });
  });
}
async function _0x109797(_0x59c2bc, _0x44a872) {
  const _0x182bf2 = new Date().getTime(),
    // //{
    //   latitude: _0x43c809,
    //   longitude: _0x3192bc
    // } = await getCoordinates(),
    // {
    //   UA: _0x1f9588,
    //   umidtoken: _0x2ce074
    // } = await initEnv("", _0x43c809, _0x3192bc),
    _0x401a77 = {
      bizScene: "MAGIC_CUBE",
      //latitude: _0x43c809,
      //longitude: _0x3192bc,
      bizCode: "MAGIC_CUBE",
      actId: "20230802212526123181213864",
      collectionId: "20230802212526148986536967",
      componentId: "20230803112141370370827352",
      extParams: "{\\\"actId\\\":\\\"20230802212526123181213864\\\",\\\"bizScene\\\":\\\"MAGIC_CUBE\\\",\\\"desc\\\":\\\"魔方消消乐\\\"}",
      requestId: "20230802212526123181213864" + _0x182bf2 + "",
      //ua: _0x1f9588,
      //umidToken: _0x2ce074,
      asac: "2A22C0239QW1FOL3UUQY7U"
    };
  try {
    const _0x445d66 = await h5Req(_0x59c2bc, _0x401a77);
    if (_0x445d66.data.data.errorMsg) {
      console.log(_0x445d66.data.data.errorMsg);
      return false;
    } else {
      const _0x282c4a = _0x445d66.data.data.sendRightList[0].discountInfo.amount;
      console.log("福尔魔方闯关成功。获得：" + _0x282c4a, "乐园币");
      return _0x282c4a !== 1;
    }
  } catch (_0x31b031) {
    return false;
  }
}
async function _0x12d072() {
  await _0x4cfa40(_0x57253e, 1);
  const _0x1b7a0a = _0x313a08("elmck");
  for (let _0x5c83c6 = 0; _0x5c83c6 < _0x1b7a0a.length; _0x5c83c6++) {
    let _0x24b3c4 = _0x1b7a0a[_0x5c83c6],
      //_0x2dd844 = await _0x4a4a5b(_0x24b3c4, _0x1c5d9a),
      _0x460a66 = await checkCk(_0x24b3c4, _0x5c83c6, process.env.ELE_CARME);

    

   
    
    await _0x1059797(_0x460a66);
    console.log("防止挤爆了，延时 1 秒");
    await _0x5a5d5ca(1);
  }
  process.exit(0);
}
_0x12d072();
function Env(t, e) {
  "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      "POST" === e && (s = this.post);
      return new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s);
        });
      });
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new class {
    constructor(t, e) {
      this.name = t;
      this.http = new s(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, e);
      this.log("", `??${this.name}, 开始!`);
    }
    isNode() {
      return "undefined" != typeof module && !!module.exports;
    }
    isQuanX() {
      return "undefined" != typeof $task;
    }
    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
    }
    isLoon() {
      return "undefined" != typeof $loon;
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null) {
      try {
        return JSON.stringify(t);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) {
        try {
          s = JSON.parse(this.getdata(t));
        } catch {}
      }
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return !1;
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i));
      });
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20;
        r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"),
          n = {
            url: `http://${h}/v1/scripting/evaluate`,
            body: {
              script_text: t,
              mock_type: "cron",
              timeout: r
            },
            headers: {
              "X-Key": o,
              Accept: "*/*"
            }
          };
        this.post(n, (t, e, i) => s(i));
      }).catch(t => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) {
        return {};
      }
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) {
 
    }
    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) {
          return t;
        }
        if ("string" == typeof t) {
          return this.isLoon() ? t : this.isQuanX() ? {
            "open-url": t
          } : this.isSurge() ? {
            url: t
          } : void 0;
        }
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return {
              openUrl: e,
              mediaUrl: s
            };
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl,
              s = t["media-url"] || t.mediaUrl;
            return {
              "open-url": e,
              "media-url": s
            };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {
              url: e
            };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
        let t = ["", "==============??系统通知??=============="];
        t.push(e);
        s && t.push(s);
        i && t.push(i);
        console.log(t.join("\n"));
        this.logs = this.logs.concat(t);
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]);
      console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `??${this.name}, 错误!`, t.stack) : this.log("", `??${this.name}, 错误!`, t);
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t));
    }
    done(t = {}) {
      const e = new Date().getTime(),
        s = (e - this.startTime) / 1000;
      this.log("", `??${this.name}, 结束! ?? ${s} 秒`);
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }
  }(t, e);
}
