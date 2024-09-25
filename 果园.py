import json
import os
import random
import time
import requests
from urllib.parse import quote
import datetime


nczlck = os.environ.get('elmck')

ck = ''


def tq(txt):
    try:
        txt = txt.replace(" ", "")
        pairs = txt.split(";")[:-1]
        ck_json = {}
        for i in pairs:
            ck_json[i.split("=")[0]] = i.split("=")[1]
        return ck_json
    except Exception as e:
        print(f'❎Cookie解析错误: {e}')
        return {}


def xsign(api, data, uid, sid, wua, v):
    body = {
        "data": data,
        "api": api,
        "pageId": '',
        "uid": uid,
        'sid': sid,
        "deviceId": '',
        "utdid": '',
        "wua": wua,
        'ttid': '1551089129819@eleme_android_10.14.3',
        "v": v
    }

    try:
        r = requests.post(
            "http://192.168.1.177:32772/api/getXSign",
            json=body
        )
        r.raise_for_status()
        return r.json()
    except requests.exceptions.HTTPError as e:
        print(f'❎请求签名服务器失败: {e}')
        return None
    except requests.exceptions.RequestException as e:
        print(f'❎请求签名服务器错误: {e}')
        return None


class LYB:
    def __init__(self, cki):
        self.name = None
        self.cki = tq(cki)
        self.uid = self.cki.get("unb")
        self.sid = self.cki.get("cookie2")
        self.token = self.cki.get("token")
        self.deviceId = self.cki.get("deviceId")
        self.host = 'https://acs.m.goofish.com'
        self.name1 = get_ck_usid(cki)

    def req(self, api, data, wua='False', v="1.0"):
        try:
            if type(data) == dict:
                data = json.dumps(data)
            wua = str(wua)
            sign = xsign(api, data, self.uid, self.sid, wua, v)
            url = f"{self.host}/gw/{api}/{v}/"
            headers = {
                "x-sgext": quote(sign.get('x-sgext')),
                "x-sign": quote(sign.get('x-sign')),
                'x-sid': self.sid,
                'x-uid': self.uid,
                'x-pv': '6.3',
                'x-features': '1051',
                'x-mini-wua': quote(sign.get('x-mini-wua')),
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'x-t': sign.get('x-t'),
                'x-extdata': 'openappkey%3DDEFAULT_AUTH',
                'x-ttid': '1551089129819@eleme_android_10.14.3',
                'x-utdid': '',
                'x-appkey': '24895413',
                'x-devid': '',
            }

            params = {"data": data}
            if 'wua' in sign:
                params["wua"] = sign.get('wua')

            max_retries = 5
            retries = 0
            while retries < max_retries:
                try:
                    res = requests.post(url, headers=headers, data=params, timeout=5)
                    return res
                except requests.exceptions.Timeout:
                    print("❎接口请求超时")
                except requests.exceptions.RequestException as e:
                    print(f"❎请求异常: {e}")
                retries += 1
                print(f"❎重试次数: {retries}")
                if retries >= max_retries:
                    print("❎重试次数上限")
                    return None
        except Exception as e:
            print(f'❎请求接口失败: {e}')
            return None

    def login(self):
        api1 = 'mtop.alsc.user.detail.query'
        try:
            res1 = self.req(api1, json.dumps({}), 'False', "1.0")
            if res1.json()['ret'][0] == 'SUCCESS::调用成功':
                self.name = res1.json()["data"]["encryptMobile"]
                api = 'mtop.koubei.interaction.center.common.queryintegralproperty.v1'
                data = json.dumps({"templateIds": "[\"1404\"]"})
                try:
                    res = self.req(api, data, 'False', "1.0")
                    if res.json()['ret'][0] == 'SUCCESS::调用成功':
                        print(f'[{self.name}] ✅登录成功,乐园币----[{res.json()["data"]["data"]["1404"]["count"]}]')
                        return True
                    else:
                        if res.json()['ret'][0] == 'FAIL_SYS_SESSION_EXPIRED::Session过期':
                            print(f"[{self.name1}] ❎cookie已过期，请重新获取")
                            return False
                        else:
                            print(f'[{self.name1}] ❌登录失败,原因:{res.text}')
                            return False
                except Exception as e:
                    print(f"[{self.name1}] ❎登录失败: {e}")
                    return False
            else:
                if res1.json()['ret'][0] == 'FAIL_SYS_SESSION_EXPIRED::Session过期':
                    print(f"[{self.name1}] ❎cookie已过期，请重新获取")
                    return False
                else:
                    print(f'[{self.name1}] ❌登录失败,原因:{res1.text}')
                    return False
        except Exception as e:
            print(f"[{self.name1}] ❎登录失败: {e}")
            return False


    def warte(self):
        global amount, y, roleId
        api = 'mtop.alsc.playgame.orchard.index.batch.query'
        data1 = json.dumps({
            "blockRequestList": "[{\"blockCode\":\"603040_6723057310\",\"status\":\"PUBLISH\",\"tagCallWay\":\"SYNC\",\"useRequestBlockTags\":false}]",
            "source": "KB_ORCHARD", "bizCode": "main",
            "locationInfos": "[{\"latitude\":\"30.597472842782736\",\"longitude\":\"105.75325090438128\",\"lat\":\"30.597472842782736\",\"lng\":\"105.75325090438128\"}]",
            "extData": "{\"ORCHARD_ELE_MARK\":\"KB_ORCHARD\",\"orchardVersion\":\"20240624\"}"})
        res3 = self.req(api, data1, 'False', "1.0")
        if res3.json()["ret"][0] == "SUCCESS::调用成功":
            for y in res3.json()['data']['data']['603040_6723057310']['blockData']['assets']['tagData']:
                for o in y['totalProps']:
                    if o['name'] == "水":
                        y = o['value']
                        amount = int(int(o['value']) / 10)
            for tag_data in res3.json()["data"]['data']["603040_6723057310"]["blockData"]["role"]["tagData"]:
                for result_data in tag_data["result"]:
                    for role_info in result_data["roleInfoDtoList"]:
                        if "roleBaseInfoDto" in role_info:
                            role_base_info = role_info["roleBaseInfoDto"]
                            if "roleId" in role_base_info:
                                roleId = role_base_info["roleId"]
                                print(role_base_info["roleId"])
            for tag_data in res3.json()["data"]["data"]["603040_6723057310"]["blockData"]["roleId"]["tagData"]:
                for result in tag_data["result"]:
                    for role_info in result["roleInfoDtoList"]:
                        Sunlightvalue = role_info["roleLevelExpInfoDto"]["remainingProgress"]
                        print(f"✅水滴:{y}g\n✅可浇水：{amount}次\n✅阳光值: {Sunlightvalue}")
        else:
            if res3.json()["ret"][0] == "FAIL_SYS_SESSION_EXPIRED::Session过期":
                print(f"[{self.name1}] ❎cookie已过期，请重新获取")
                return 0, '0'
            else:
                print(f"[{self.name}] ❎获取列表失败:", res3.json())
                return 0, '0'
        return amount, roleId

    def water(self):
        total_progress = 0
        total_watering = 0
        amount1, roleId1 = self.warte()
        if roleId1 == '0':
            return None
        for i1 in range(amount1):
            api = 'mtop.alsc.playgame.orchard.roleoperate.useprop'
            data2 = json.dumps({
                "propertyTemplateId": "462",
                "roleId": roleId1,
                "latitude": "30.597472842782736",
                "longitude": "105.75325090438128",
                "roleType": "KB_ORCHARD",
                "actId": "20200629151859103125248022",
                "collectionId": "20210812150109893985929183",
                "bizScene": "KB_ORCHARD",
                "extParams": "{\"orchardVersion\":\"20240624\",\"popWindowVersion\":\"V2\"}"
            })

            res2 = self.req(api, data2, 'False', "1.0")
            if res2.json()["ret"][0] == "SUCCESS::调用成功":
                total_watering += 1
                if 'progress' in res2.json()['data']['data']['extInfo']:
                    progress = float(res2.json()['data']['data']['extInfo']['progress'])
                    total_progress += progress
                    print(f"[{self.name}] ✅第{total_watering}次浇水成功,获得进度--[{progress}]")
                else:
                    progress = 1
                    jg = res2.json()['data']['data']['roleInfoDTO']['roleLevelExpInfoDto']['upgradeNeedValue']
                    zt = res2.json()['data']['data']['roleInfoDTO']['roleLevelExpInfoDto']['nextLevelName']
                    total_progress += progress
                    print(f"[{self.name}] ✅第{total_watering}次浇水成功,再浇水[{jg}]次可[{zt}]")
            elif res2.json()["ret"][0] == "FAIL_BIZ_ROLE_USING_PROP_EXP_ENOUGH::道具使用达到上限,明天再来吧":
                print(f"[{self.name}] ❎第{total_watering + 1}次浇水失败: 浇水上限")
                break
            else:
                print(f"[{self.name}] ❎第{total_watering + 1}次浇水失败: {res2.text}")
            time.sleep(random.randint(1, 3))
        print(f"浇水{total_watering}次获得进度: {total_progress}")

    def main(self):
        try:
            if self.login():
                self.water()
        except Exception as e:
            print(f"[{self.name1}] 请求错误{e}")


def get_ck_usid(ck1):
    try:
        key_value_pairs = ck1.split(";")
        for pair in key_value_pairs:
            key, value = pair.split("=")
            if key.lower() == "userid":
                return value
    except Exception:
        return 'y'


if __name__ == '__main__':
    if 'elmck' in os.environ:
        cookie = os.environ.get('elmck')
    else:
        print("环境变量中不存在[elmck],启用本地变量模式")
        cookie = ck
    if cookie == "":
        print("本地变量为空，请设置其中一个变量后再运行")
        exit(-1)
    cookies = cookie.split("&")
    print(f"饿了么共获取到 {len(cookies)} 个账号")
    for i, ck in enumerate(cookies):
        print(f"======开始第{i + 1}个账号======")
        LYB(ck).main()
        print("2s后进行下一个账号")
        time.sleep(2)
    
