const {
  sign,
  getToken,
  checkCk,
  getCookies,
  getUserInfo,
  validateCarmeWithType,
  checkCarmeCount,
  tryCatchPromise,
  wait
} = require("./common.js");

const request = require("request");

const GAME_TYEP = 17;
const kami = process.env.ELE_CARME;

async function query_task(_0x26773f) {
  const _0x34f3dc = {
    cookie: _0x26773f,
    "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
  };
  const _0x460579 = {
    missionCollectionId: "532",
    locationInfos: "[\"{\\\"lng\\\":120.21287675946951,\\\"lat\\\":30.182377863675356,\\\"city\\\":\\\"330100\\\"}\"]"
  };

  const _0x317943 = new Date().getTime();

  const _0x2ae10d = 12574478;

  var _0x4462bf = "data=" + encodeURIComponent(JSON.stringify(_0x460579));

  const _0x2644e3 = getToken(_0x26773f),
        _0x48c5a8 = _0x2644e3.split("_")[0];

  const _0x1552ef = await sign(_0x48c5a8 + "&" + _0x317943 + "&" + _0x2ae10d + "&" + JSON.stringify(_0x460579), kami);

  const _0x1da7ab = {
    url: "https://mtop.ele.me/h5/mtop.ele.biz.growth.task.core.querytask/1.0/?jsv=2.6.1&appKey=12574478&t=" + _0x317943 + "&sign=" + _0x1552ef + "&api=mtop.ele.biz.growth.task.core.querytask&v=1.0&type=originaljson&dataType=json&timeout=5000&pageDomain=ele.me&ttid=1601274958480%40eleme_android_10.14.3",
    method: "GET",
    headers: _0x34f3dc,
    body: _0x4462bf
  };
  return tryCatchPromise(_0xd60a06 => {
    request(_0x1da7ab, async (_0x300c1a, _0x21ba06, _0x40a948) => {
      if (!_0x300c1a && _0x21ba06.statusCode == 200) {
        try {
          const _0x1cd03f = JSON.parse(_0x40a948);

          const _0x4a534f = _0x1cd03f.data.mlist;

          _0xd60a06(_0x4a534f);
        } catch (_0x2d4e63) {
          console.log(_0x40a948);
        }
      } else {
        _0xd60a06(null);
      }
    });
  });
}

async function receive_yx_prize(_0x38f0c9, _0x905f0f, _0x7f9d6c, _0x277ffd, _0x22f890, _0x47d2ce, _0x8d06b4) {
  const _0x233d58 = {
    cookie: _0x38f0c9,
    "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
  };
  const _0x468b9a = {
    missionCollectionId: _0x905f0f,
    missionId: _0x7f9d6c,
    count: _0x8d06b4,
    extInfo: "{\"token\":\"" + _0x47d2ce + "\",\"type\":\"Task\",\"count\":" + _0x8d06b4 + "}",
    missionXId: _0x277ffd,
    instanceId: _0x22f890,
    umiToken: "1",
    ua: "1",
    locationInfos: "[\"{\\\"lng\\\":120.21287675946951,\\\"lat\\\":30.182377863675356,\\\"city\\\":\\\"330100\\\"}\"]"
  };

  const _0x530179 = new Date().getTime();

  const _0x21479a = 12574478;

  var _0x4860d8 = "data=" + encodeURIComponent(JSON.stringify(_0x468b9a));

  const _0x537b42 = getToken(_0x38f0c9),
        _0x2593a6 = _0x537b42.split("_")[0];

  const _0x44ac5f = await sign(_0x2593a6 + "&" + _0x530179 + "&" + _0x21479a + "&" + JSON.stringify(_0x468b9a), kami);

  const _0x42ef83 = {
    url: "https://shopping.ele.me/h5/mtop.ele.biz.growth.task.core.receiveprize/1.0/?jsv=2.6.1&appKey=12574478&t=" + _0x530179 + "&sign=" + _0x44ac5f + "&api=mtop.ele.biz.growth.task.core.receiveprize&v=1.0&type=originaljson&dataType=json",
    method: "GET",
    headers: _0x233d58,
    body: _0x4860d8
  };
  return tryCatchPromise(_0x413329 => {
    request(_0x42ef83, async (_0x2f1be0, _0xeab82f, _0x20a098) => {
      if (!_0x2f1be0 && _0xeab82f.statusCode === 200) {
        try {
          const _0x30458d = JSON.parse(_0x20a098);

          const _0x562918 = _0x30458d.data.rlist;
          console.log("完成饿了个饿任务，获得", _0x562918[0].value, "体力");

          _0x413329(_0x562918);
        } catch (_0xdba24) {
          _0x413329(null);
        }
      } else {
        _0x413329(null);
      }
    });
  });
}

async function queryTaskItem(_0x56553d, _0x99a344) {
  const _0x5f4624 = {
    cookie: _0x56553d,
    "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
  };

  const _0x4bf6b4 = new Date().getTime();

  const _0x39fbd0 = 12574478;

  var _0x44adfe = "data=" + encodeURIComponent(JSON.stringify(_0x99a344));

  const _0xfc68e8 = getToken(_0x56553d),
        _0x34f618 = _0xfc68e8.split("_")[0];

  const _0x1b671e = await sign(_0x34f618 + "&" + _0x4bf6b4 + "&" + _0x39fbd0 + "&" + JSON.stringify(_0x99a344), kami);

  const _0x4fccf2 = {
    url: "https://mtop.ele.me/h5/mtop.ele.biz.growth.task.core.querytask/1.0/?jsv=2.6.1&appKey=12574478&t=" + _0x4bf6b4 + "&sign=" + _0x1b671e + "&api=mtop.ele.biz.growth.task.core.querytask&v=1.0&type=originaljson&dataType=json&timeout=5000&pageDomain=ele.me&ttid=1601274958480%40eleme_android_10.14.3",
    method: "GET",
    headers: _0x5f4624,
    body: _0x44adfe
  };
  return tryCatchPromise(_0x1ac0d3 => {
    request(_0x4fccf2, async (_0x2b5ebb, _0x11ee3d, _0x547a58) => {
      if (!_0x2b5ebb && _0x11ee3d.statusCode == 200) {
        try {
          const _0x3577ed = JSON.parse(_0x547a58);

          const _0x11e2bf = _0x3577ed.data.mlist;

          _0x1ac0d3(_0x11e2bf);
        } catch (_0x211503) {
          console.log(_0x547a58);
        }
      } else {
        _0x1ac0d3(null);
      }
    });
  });
}

async function doReceivePrize(_0x4e4c2e, _0x3e743a, _0x3c8a89, _0xc8ed51 = 1) {
  const _0x17923d = _0x4e4c2e.actionConfig.actionValue.pageSpm;
  const _0x5246c8 = _0x4e4c2e.name;
  const _0x29d755 = _0x4e4c2e.missionDefId;
  const _0x7cd0a5 = _0x4e4c2e.missionCollectionId;

  if (_0x5246c8.indexOf("逛游戏专属淘宝优惠") !== -1) {
    await pageView(_0x3e743a, _0x4e4c2e.missionDefId, _0x4e4c2e.missionCollectionId, _0x17923d);
    const _0x479d50 = {
      missionCollectionId: _0x7cd0a5,
      missionId: _0x29d755,
      locationInfos: "[\"{\\\"lng\\\":120.21287675946951,\\\"lat\\\":30.182377863675356,\\\"city\\\":\\\"330100\\\"}\"]"
    };

    let _0x59b0ab = await queryTaskItem(_0x3e743a, _0x479d50);

    let _0x1ddceb = _0x59b0ab[0];

    if (_0x1ddceb.status === "FINISH") {
      await receive_yx_prize(_0x3e743a, _0x1ddceb.missionCollectionId, _0x1ddceb.missionDefId, _0x1ddceb.missionXId, _0x1ddceb.id, _0x3c8a89, _0xc8ed51);
    } else {
      for (let _0x15b936 = 0; _0x15b936 < _0x1ddceb.missionStageDTOS.length; _0x15b936++) {
        let _0x385690 = _0x1ddceb.missionStageDTOS[_0x15b936];

        if (_0x385690.rewardStatus === "TODO") {
          await receive_yx_prize(_0x3e743a, _0x1ddceb.missionCollectionId, _0x1ddceb.missionDefId, _0x1ddceb.missionXId, _0x1ddceb.id, _0x3c8a89, _0x15b936 + 1);
          await wait(1);
          await pageView(_0x3e743a, _0x4e4c2e.missionDefId, _0x4e4c2e.missionCollectionId, _0x17923d);
          _0x59b0ab = await queryTaskItem(_0x3e743a, _0x479d50);
          _0x1ddceb = _0x59b0ab[0];
        }
      }
    }
  } else {
    if (_0x5246c8.indexOf("开启活动提醒") !== -1) {
      await receive_yx_prize(_0x3e743a, _0x4e4c2e.missionCollectionId, _0x4e4c2e.missionDefId, _0x4e4c2e.missionXId, _0x4e4c2e.id, _0x3c8a89, _0x4e4c2e.nextStageCount);
    } else {
      await pageView(_0x3e743a, _0x4e4c2e.missionDefId, _0x4e4c2e.missionCollectionId, _0x17923d);
      await receivePrize(_0x3e743a, _0x4e4c2e.missionDefId, _0x4e4c2e.missionCollectionId, _0x4e4c2e.missionXId, _0x3c8a89);
    }
  }
}

async function doTask(_0x224b7b, _0x7d0fc8) {
  let _0x31186a = await query_task(_0x224b7b);

  if (_0x31186a) {
    for (let _0x5ddfea = 0; _0x5ddfea < _0x31186a.length; _0x5ddfea++) {
      const _0x5f12e5 = _0x31186a[_0x5ddfea];

      if (_0x5f12e5.actionConfig.actionType === "OPEN_APP_PUSH" && _0x5f12e5.status === "RUNNING") {
        const _0x1aed66 = {
          bizScene: "FOOD_ELIMINATE",
          bizMethod: "setSubscribe",
          bizParam: "{\"state\":true,\"gameId\":null,\"token\":\"" + _0x7d0fc8 + "\"}"
        };

        const _0x333850 = await gameRequest(_0x224b7b, _0x1aed66);

        if (_0x333850) {
          const _0x17a351 = {
            bizScene: "FOOD_ELIMINATE",
            bizMethod: "finisheTask",
            bizParam: "{\"taskId\":\"T001\",\"gameId\":null,\"token\":\"" + _0x7d0fc8 + "\"}"
          };

          const _0x36fae4 = await gameRequest(_0x224b7b, _0x17a351);

          if (_0x36fae4) {
            await doReceivePrize(_0x5f12e5, _0x224b7b, _0x7d0fc8);
          }
        }
      } else {
        if (_0x5f12e5.status === "FINISH") {
          for (let _0x558ea8 = 0; _0x558ea8 < _0x5f12e5.missionStageDTOS.length; _0x558ea8++) {
            let _0x397f61 = _0x5f12e5.missionStageDTOS[_0x558ea8];

            if (_0x397f61.rewardStatus === "TODO") {
              await doReceivePrize(_0x5f12e5, _0x224b7b, _0x7d0fc8, _0x558ea8 + 1);
            }
          }
        } else {
          if (!(_0x5f12e5.actionConfig.actionType === "PAGEVIEW" && _0x5f12e5.status === "RUNNING")) {
            continue;
          }

          await doReceivePrize(_0x5f12e5, _0x224b7b, _0x7d0fc8);
        }
      }
    }
  }
}

async function receivePrize(_0x56f40f, _0x4b2668, _0x205a45, _0x12278c, _0xbdf413) {
  const _0x105b36 = {
    missionCollectionId: _0x205a45,
    missionId: _0x4b2668,
    count: "1",
    extInfo: "{\"token\":\"" + _0xbdf413 + "\",\"type\":\"Task\",\"count\":1}",
    missionXId: _0x12278c,
    umiToken: "1",
    ua: "1",
    locationInfos: "[\"{\\\"lng\\\":120.21287675946951,\\\"lat\\\":30.182377863675356,\\\"city\\\":\\\"330100\\\"}\"]"
  };

  let _0x5c70f1 = await commonRequest(_0x56f40f, "mtop.ele.biz.growth.task.core.receiveprize", _0x105b36, "h5%40chrome_android_87.0.4280.141");

  if (_0x5c70f1) {
    let _0xfcd472 = _0x5c70f1.rlist[0].value;
    console.log("完成饿了个饿任务，获得", _0xfcd472, "体力");
  }
}

async function pageView(_0x29d8fb, _0x5d916c, _0x4a341a, _0x51d400) {
  const _0x4665ae = {
    collectionId: _0x4a341a,
    missionId: _0x5d916c,
    actionCode: "PAGEVIEW",
    pageFrom: _0x51d400,
    viewTime: "15",
    bizScene: "FOOD_ELIMINATE",
    accountPlan: "HAVANA_COMMON",
    sync: "false"
  };
  return await commonRequest(_0x29d8fb, "mtop.ele.biz.growth.task.event.pageview", _0x4665ae);
}

async function commonRequest(_0x1be76f, _0x3f2c29, _0x34687d, _0x5098ec = "1608030065155%40eleme_android_11.1.38") {
  const _0x40ce51 = {
    cookie: _0x1be76f,
    "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
  };

  const _0x4b3c78 = new Date().getTime();

  const _0x3a0486 = 12574478;

  var _0x4ce05c = "data=" + encodeURIComponent(JSON.stringify(_0x34687d));

  const _0x570aaa = getToken(_0x1be76f),
        _0x491d19 = _0x570aaa.split("_")[0];

  const _0x574efc = await sign(_0x491d19 + "&" + _0x4b3c78 + "&" + _0x3a0486 + "&" + JSON.stringify(_0x34687d), kami);

  const _0x42ad07 = {
    url: "https://guide-acs.m.taobao.com/h5/" + _0x3f2c29 + "/1.0/?jsv=2.7.0&appKey=12574478&t=" + _0x4b3c78 + "&sign=" + _0x574efc + "&api=" + _0x3f2c29 + "&v=1.0&type=originaljson&dataType=json&ttid=" + _0x5098ec + "&needLogin=true&LoginRequest=true",
    method: "GET",
    headers: _0x40ce51,
    body: _0x4ce05c
  };
  return tryCatchPromise(_0x359ada => {
    request(_0x42ad07, async (_0x47082b, _0x5db76f, _0x4c426f) => {
      if (!_0x47082b && _0x5db76f.statusCode == 200) {
        try {
          const _0x137aef = JSON.parse(_0x4c426f);

          let _0x1863cd = _0x137aef.data;

          if (isEmpty(_0x1863cd) && _0x137aef.ret[0].indexOf("接口调用成功") === -1) {
            console.log(_0x137aef.ret[0]);

            _0x359ada(null);
          } else {
            _0x359ada(_0x1863cd);
          }
        } catch (_0x324db8) {
          console.log(_0x4c426f);

          _0x359ada(null);
        }
      } else {
        _0x359ada(null);
      }
    });
  });
}

async function food_token(_0x5b6adb) {
  const _0x5b34d4 = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "login",
    bizParam: "{\"inviterId\":null,\"gameId\":null,\"token\":\"token\"}"
  };

  const _0x27dc46 = await gameRequest(_0x5b6adb, _0x5b34d4);

  return _0x27dc46.data.token;
}

async function getMimiGameTask(_0x5bae43, _0x166668, _0x3e6bde) {
  const _0x24ffac = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "updateTask",
    bizParam: "{\"taskId\":\"" + _0x3e6bde + "\",\"gameId\":null,\"token\":\"" + _0x166668 + "\"}"
  };

  let _0x3f12b5 = await gameRequest(_0x5bae43, _0x24ffac);

  if (!_0x3f12b5.bizSuccess) {
    console.log(_0x3f12b5.bizErrorMsg);
  } else {
    let _0x331b0d = _0x3f12b5.data.task.isFinishe;

    while (!_0x331b0d) {
      await wait(1);
      await doMiniTask(_0x5bae43, _0x166668, _0x3e6bde);
      _0x3f12b5 = await gameRequest(_0x5bae43, _0x24ffac);

      if (_0x3f12b5.bizSuccess) {
        _0x331b0d = _0x3f12b5.data.task.isFinishe;
      } else {
        _0x331b0d = true;
      }
    }
  }
}

async function doMiniTask(_0x3bcfde, _0x3eb26d, _0x275828) {
  const _0xee3c16 = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "finisheTask",
    bizParam: "{\"taskId\":\"" + _0x275828 + "\",\"gameId\":null,\"token\":\"" + _0x3eb26d + "\"}"
  };

  const _0x4f2596 = await gameRequest(_0x3bcfde, _0xee3c16);

  if (_0x4f2596) {
    const _0x1bd36b = _0x4f2596.data.rewardItems[0].num;

    if (_0x1bd36b) {
      console.log("完成饿了么内的任务，获得", _0x1bd36b, "体力");
    }
  }
}

async function gameRequest(_0x252256, _0x230271) {
  const _0xba5d2a = {
    authority: "shopping.ele.me",
    accept: "application/json",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    origin: "https://r.ele.me",
    pragma: "no-cache",
    referer: "https://r.ele.me/linkgame/index.html?navType=3&spm-pre=a2ogi.13162730.zebra-ele-login-module-9089118186&spm=a13.b_activity_kb_m71293.0.0",
    cookie: _0x252256,
    "x-ele-ua": "RenderWay/H5 AppName/wap Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36",
    "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
  };

  const _0x34e415 = new Date().getTime();

  const _0x576385 = 12574478;

  var _0x59021f = "data=" + encodeURIComponent(JSON.stringify(_0x230271));

  const _0x51a08c = getToken(_0x252256),
        _0x2bbbd4 = _0x51a08c.split("_")[0];

  const _0xeab8e5 = await sign(_0x2bbbd4 + "&" + _0x34e415 + "&" + _0x576385 + "&" + JSON.stringify(_0x230271), kami);

  const _0x5a50b8 = {
    url: "https://shopping.ele.me/h5/mtop.alsc.playgame.mini.game.dispatch/1.0/?jsv=2.6.1&appKey=12574478&t=" + _0x34e415 + "&sign=" + _0xeab8e5 + "&api=mtop.alsc.playgame.mini.game.dispatch&v=1.0&type=originaljson&dataType=json&timeout=5000&subDomain=shopping&mainDomain=ele.me&H5Request=true&pageDomain=ele.me&ttid=h5%40chrome_android_87.0.4280.141&SV=5.0",
    method: "POST",
    headers: _0xba5d2a,
    body: _0x59021f
  };
  return tryCatchPromise(_0x245678 => {
    request(_0x5a50b8, async (_0x111f4b, _0x1328b7, _0x42c99c) => {
      if (!_0x111f4b && _0x1328b7.statusCode == 200) {
        try {
          const _0x47f444 = JSON.parse(_0x42c99c);

          const _0x44f5a1 = JSON.parse(_0x47f444.data.data);

          _0x245678(_0x44f5a1);
        } catch (_0xea861) {
          console.log(_0x42c99c);

          _0x245678(null);
        }
      } else {
        _0x245678(null);
      }
    });
  });
}

async function food_game(_0x49bed8, _0x35d4b9) {
  const _0x3ad6a0 = await food_level(_0x49bed8, _0x35d4b9);

  let _0x1312dc = Object.values(_0x3ad6a0).length;
  let _0x349249 = true;

  let _0x30a935 = await foodGameCode(_0x49bed8, _0x35d4b9, _0x1312dc + 1);

  while (_0x30a935) {
    _0x1312dc = await foodPassGame(_0x49bed8, _0x30a935, _0x35d4b9);
    console.log("饿了个饿，第", _0x1312dc, "关，闯关完成");
    await wait(1);
    _0x30a935 = await foodGameCode(_0x49bed8, _0x35d4b9, _0x1312dc);

    if (_0x349249) {
      console.log("------ 开始领取体力 ------");
      await getMimiGameTask(_0x49bed8, _0x35d4b9, "T002");
      await wait(1);
      await food_tl(_0x49bed8, _0x35d4b9);
      await wait(1);
      await food_tl(_0x49bed8, _0x35d4b9);
      _0x349249 = false;
    }
  }
}

async function food_tl(_0x490a19, _0x1c15f9) {
  const _0x1bf116 = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "getPackage",
    bizParam: "{\"gameId\":null,\"token\":\"" + _0x1c15f9 + "\"}"
  };

  const _0x4325af = await gameRequest(_0x490a19, _0x1bf116);

  return _0x4325af.data.energy;
}

async function food_level(_0x7f9461, _0xa1d6c7) {
  const _0x421f1b = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "queryLevels",
    bizParam: "{\"gameId\":null,\"token\":\"" + _0xa1d6c7 + "\"}"
  };

  const _0x57c5ac = await gameRequest(_0x7f9461, _0x421f1b);

  if (!_0x57c5ac.data) {
    console.log(_0x57c5ac.bizErrorMsg);
    return null;
  }

  return _0x57c5ac.data.levels;
}

async function foodGameCode(_0x46eff0, _0x5acf8d, _0x43c3af) {
  const _0x499cac = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "startGame",
    bizParam: "{\"levelId\":\"" + _0x43c3af + "\",\"gameId\":null,\"token\":\"" + _0x5acf8d + "\"}"
  };

  const _0x48d815 = await gameRequest(_0x46eff0, _0x499cac);

  if (_0x48d815.bizErrorMsg !== "success") {
    console.log("饿了个饿，体力已耗尽，结束");
    return null;
  }

  return _0x48d815.data.gameCode;
}

async function foodPassGame(_0x4b405f, _0x26a432, _0x1bc29f) {
  const _0x1dd80 = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "settlement",
    bizParam: "{\"gameCode\":\"" + _0x26a432 + "\",\"star\":3,\"gameId\":null,\"token\":\"" + _0x1bc29f + "\"}"
  };

  const _0x1d0f90 = await gameRequest(_0x4b405f, _0x1dd80);

  if (_0x1d0f90.bizErrorMsg !== "success") {
    console.log(_0x1d0f90.bizErrorMsg);
    return null;
  }

  return _0x1d0f90.data.lastLevelId;
}

async function sharePrize(_0x26e1b3, _0x3e51ce) {
  const _0x440799 = {
    bizScene: "FOOD_ELIMINATE",
    bizMethod: "updateTask",
    bizParam: "{\"taskId\":\"T004\",\"gameId\":null,\"token\":\"" + _0x3e51ce + "\"}"
  };

  let _0x5d10ea = await gameRequest(_0x26e1b3, _0x440799);

  if (_0x5d10ea.data) {
    console.log("分享饿了个饿，获得 5 乐园币");
  }
}

async function start() {
  await validateCarmeWithType(kami, 1);

  const _0x1ac804 = getCookies();

  for (let _0x1c5a1c = 0; _0x1c5a1c < _0x1ac804.length; _0x1c5a1c++) {
    const _0x859922 = _0x1ac804[_0x1c5a1c];

    if (!_0x859922) {
      console.log(" ❌无效用户信息, 请重新获取ck");
    } else {
      try {
        let _0x9adeae = await checkCk(_0x859922, _0x1c5a1c);

        if (!_0x9adeae) {
          continue;
        }

        let _0x598d91 = await getUserInfo(_0x9adeae);

        if (!_0x598d91.encryptMobile) {
          console.log("第", _0x1c5a1c + 1, "账号失效！请重新登录！！！😭");
          continue;
        }

        const _0x52e24a = _0x598d91.localId;
        await checkCarmeCount(kami, _0x52e24a, GAME_TYEP);
        console.log("******开始【饿了么账号", _0x1c5a1c + 1, "】", _0x598d91.encryptMobile, "*********");

        const _0x3dd28e = await food_token(_0x9adeae);

        console.log("------ 开始领取体力 ------");
        await doTask(_0x9adeae, _0x3dd28e);
        console.log("------ 开始闯关 ------");
        await food_game(_0x9adeae, _0x3dd28e);
        await sharePrize(_0x9adeae, _0x3dd28e);
        console.log("防止黑号延时5-10秒");
        await wait(getRandom(5, 10));
      } catch (_0x572690) {
        console.log(_0x572690);
      }
    }
  }

  process.exit(0);
}

start();

function getRandom(_0x324631, _0x4d3fb7) {
  return Math.floor(Math.random() * (_0x4d3fb7 - _0x324631 + 1) + _0x324631);
}

function isEmpty(_0x1ae84a) {
  return Object.values(_0x1ae84a).length === 0;
}

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
      this.log("", `🔔${this.name}, 开始!`);
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
          return {};
        }

        {
          const i = s ? t : e;

          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
              e = this.path.resolve(process.cwd(), this.dataFile),
              s = this.fs.existsSync(t),
              i = !s && this.fs.existsSync(e),
              r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r);
      }
    }

    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;

      for (const t of i) if (r = Object(r)[t], void 0 === r) {
        return s;
      }

      return r;
    }

    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t);
    }

    getdata(t) {
      let e = this.getval(t);

      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
              r = s ? this.getval(s) : "";

        if (r) {
          try {
            const t = JSON.parse(r);
            e = t ? this.lodash_get(t, i, "") : e;
          } catch (t) {
            e = "";
          }
        }
      }

      return e;
    }

    setdata(t, e) {
      let s = !1;

      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
              o = this.getval(i),
              h = i ? "null" === o ? null : o || "{}" : "{}";

        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t);
          s = this.setval(JSON.stringify(e), i);
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t);
          s = this.setval(JSON.stringify(o), i);
        }
      } else {
        s = this.setval(t, e);
      }

      return s;
    }

    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null;
    }

    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null;
    }

    initGotEnv(t) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
    }

    get(t, e = () => {}) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]);
      this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
        "X-Surge-Skip-Scripting": !1
      })), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status);
        e(t, s, i);
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
        hints: !1
      })), $task.fetch(t).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null);
            e.cookieJar = this.ckjar;
          }
        } catch (t) {
          this.logErr(t);
        }
      }).then(t => {
        const {
          statusCode: s,
          statusCode: i,
          headers: r,
          body: o
        } = t;
        e(null, {
          status: s,
          statusCode: i,
          headers: r,
          body: o
        }, o);
      }, t => {
        const {
          message: s,
          response: i
        } = t;
        e(s, i, i && i.body);
      }));
    }

    post(t, e = () => {}) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) {
        this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
          "X-Surge-Skip-Scripting": !1
        }));
        $httpClient.post(t, (t, s, i) => {
          !t && s && (s.body = i, s.statusCode = s.status);
          e(t, s, i);
        });
      } else {
        if (this.isQuanX()) {
          t.method = "POST";
          this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
            hints: !1
          }));
          $task.fetch(t).then(t => {
            const {
              statusCode: s,
              statusCode: i,
              headers: r,
              body: o
            } = t;
            e(null, {
              status: s,
              statusCode: i,
              headers: r,
              body: o
            }, o);
          }, t => e(t));
        } else {
          if (this.isNode()) {
            this.initGotEnv(t);
            const {
              url: s,
              ...i
            } = t;
            this.got.post(s, i).then(t => {
              const {
                statusCode: s,
                statusCode: i,
                headers: r,
                body: o
              } = t;
              e(null, {
                status: s,
                statusCode: i,
                headers: r,
                body: o
              }, o);
            }, t => {
              const {
                message: s,
                response: i
              } = t;
              e(s, i, i && i.body);
            });
          }
        }
      }
    }

    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
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

      return t;
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
        let t = ["", "==============📣系统通知📣=============="];
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
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t);
    }

    wait(t) {
      return new Promise(e => setTimeout(e, t));
    }

    done(t = {}) {
      const e = new Date().getTime(),
            s = (e - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`);
      this.log();
      (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t);
    }

  }(t, e);
}
