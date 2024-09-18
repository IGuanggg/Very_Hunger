# 需要接口

import hashlib
import os
import time
import json
import requests
from urllib.parse import quote, urlencode

host = 'https://acs.m.goofish.com'

ck = ''

def hbh5tk(tk_cookie, enc_cookie, cookie_str):
    """
    合并带_m_h5_tk
    """
    txt = cookie_str.replace(" ", "")
    if txt[-1] != ';':
        txt += ';'
    cookie_parts = txt.split(';')[:-1]
    updated = False
    for i, part in enumerate(cookie_parts):
        key_value = part.split('=')
        if key_value[0].strip() in ["_m_h5_tk", " _m_h5_tk"]:
            cookie_parts[i] = tk_cookie
            updated = True
        elif key_value[0].strip() in ["_m_h5_tk_enc", " _m_h5_tk_enc"]:
            cookie_parts[i] = enc_cookie
            updated = True

    if updated:
        return ';'.join(cookie_parts) + ';'
    else:
        return txt + tk_cookie + ';' + enc_cookie + ';'


def tq(cookie_string):
    """
    获取_m_h5_tk
    """
    if not cookie_string:
        return '-1'
    cookie_pairs = cookie_string.split(';')
    for pair in cookie_pairs:
        key_value = pair.split('=')
        if key_value[0].strip() in ["_m_h5_tk", " _m_h5_tk"]:
            return key_value[1]
    return '-1'


def tq1(txt):
    """
    拆分cookie
    """
    try:
        txt = txt.replace(" ", "")
        if txt[-1] != ';':
            txt += ';'
        pairs = txt.split(";")[:-1]
        ck_json = {}
        for pair in pairs:
            key, value = pair.split("=", 1)
            ck_json[key] = value
        return ck_json
    except Exception as e:
        print(f'❎Cookie解析错误: {e}')
        return {}


def md5(text):
    """
    md5加密
    """
    hash_md5 = hashlib.md5()
    hash_md5.update(text.encode())
    return hash_md5.hexdigest()


def check_cookie(cookie):
    url = "https://waimai-guide.ele.me/h5/mtop.alsc.personal.queryminecenter/1.0/?jsv=2.6.2&appKey=12574478"
    headers = {
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            cookie_jar = response.cookies
            token = cookie_jar.get('_m_h5_tk', '')
            token_cookie = "_m_h5_tk=" + token
            enc_token = cookie_jar.get('_m_h5_tk_enc', '')
            enc_token_cookie = "_m_h5_tk_enc=" + enc_token
            cookie = hbh5tk(token_cookie, enc_token_cookie, cookie)
            return cookie
        else:
            return None
    except Exception as e:
        print("解析ck错误")
        return None


class LYB:
    def __init__(self, cki):
        self.ck = cki
        self.name = None
        self.cki = self.tq(cki)
        self.uid = self.cki.get("unb")
        self.sid = self.cki.get("cookie2")
        self.name1 = self.uid

    def tq(self, txt):
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

    def xsign(self, api, data, wua, v):
        body = {
            "data": data,
            "api": api,
            "pageId": '',
            "uid": self.uid,
            'sid': self.sid,
            "deviceId": '',
            "utdid": '',
            "wua": wua,
            'ttid': '1551089129819@eleme_android_10.14.3',
            "v": v
        }

        try:
            r = requests.post(
                "http://192.168.1.124:1777/api/getXSign",
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

    def req1(self, api, data, wua='False', v="1.0"):
        try:
            if type(data) == dict:
                data = json.dumps(data)
            wua = str(wua)
            sign = self.xsign(api, data, wua, v)
            url = f"{host}/gw/{api}/{v}/"
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

    def req(self, api, data, v="1.0"):
        try:
            cookie = check_cookie(self.ck)
            headers = {
                "authority": "shopping.ele.me",
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                "cookie": cookie,
                "user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Mobile Safari/537.36"
            }
            timestamp = int(time.time() * 1000)
            data_str = json.dumps(data)
            token = tq(cookie)
            token_part = token.split("_")[0]

            sign_str = f"{token_part}&{timestamp}&12574478&{data_str}"
            sign = md5(sign_str)
            url = f"https://guide-acs.m.taobao.com/h5/{api}/{v}/?jsv=2.6.1&appKey=12574478&t={timestamp}&sign={sign}&api={api}&v={v}&type=originaljson&dataType=json"
            data1 = urlencode({'data': data_str})
            r = requests.post(url, headers=headers, data=data1)
            if r:
                return r
            else:
                return None
        except Exception as e:
            return None

    def login(self):
        api1 = 'mtop.alsc.user.detail.query'
        data1 = {}
        try:
            res1 = self.req(api1, data1, "1.0")
            if res1.json()['ret'][0] == 'SUCCESS::调用成功':
                self.name = res1.json()["data"]["encryptMobile"]
                api = 'mtop.koubei.interaction.center.common.queryintegralproperty.v2'
                data = {"templateIds": "[\"1404\"]"}
                try:
                    res = self.req(api, data, "1.0")
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

    def sign(self):
        api = 'mtop.ele.biz.growth.task.event.pageview'
        data = {"collectionId": "1380", "missionId": "23778002", "actionCode": "PAGEVIEW",
                           "pageFrom": "a13.b_activity_kb_m71293", "viewTime": "15", "bizScene": "game_center_signin",
                           "accountPlan": "KB_ORCHARD", "sync": "true", "asac": "2A24112EX1QYGWU29IXM1H"}
        try:
            res = self.req(api, data, "1.0")
            if res.json()["ret"][0] == 'SUCCESS::接口调用成功':
                print(f'[{self.name}] ✅签到成功')
            else:
                if res.json()["ret"][0] == '405::行为受限':
                    print(f"[{self.name}] ❎翻倍奖励签到失败，尝试普通签到")
                    api1 = 'mtop.koubei.interactioncenter.sign.component.recordsignin'
                    data1 = {"bizScene": "game_center_signin", "copyId": "20240530133724118306801071",
                                        "extInfo": "{\"prizeId\":\"11\"}", "longitude": "99.05759390443563",
                                        "latitude": "99.69377588108182",
                                        "locationInfos": "[\"{\\\"lng\\\":\\\"99.05759390443563\\\",\\\"lat\\\":\\\"99.69377588108182\\\"}\"]"}
                    try:
                        res1 = self.req(api1, data1, "1.0")
                        if res.json()["ret"][0] == 'SUCCESS::接口调用成功':
                            amount = res1.json()['data']['data']['totalReward'][0]['prizeValue']
                            print(f'[{self.name}] ✅签到成功,获得--[{amount}]乐园币')
                        else:
                            print(f'[{self.name}] ❌签到失败,原因:{res1.json()["ret"][0]}')
                    except Exception as e:
                        print(f"[{self.name}] ❎签到失败: {e}")
                else:
                    print(f'[{self.name}] ❌签到失败,原因:{res.json()["ret"][0]}')
        except Exception as e:
            print(f"[{self.name}] ❎签到失败: {e}")

    def task(self):
        api = 'mtop.ele.biz.growth.task.core.querytask'
        data = json.dumps({
            "missionCollectionId": "839",
            "locationInfos": "[\"{\\\"lng\\\":\\\"99.75325090438128\\\",\\\"lat\\\":\\\"99.597472842782736\\\"}\"]",
            "bizScene": "game_center",
            "accountPlan": "HAVANA_COMMON"
        })
        try:
            res = self.req1(api, data, 'False', "1.0")
            if res.json()["ret"][0] == 'SUCCESS::接口调用成功':
                for y in res.json()['data']['mlist']:
                    if y['name'] != "邀请好友助力":
                        for o in y['missionStageDTOS']:
                            if o['rewardStatus'] == "TODO" or o['status'] == "RUNNING":
                                api = 'mtop.ele.biz.growth.task.event.pageview'
                                data = {
                                    "sync": "true",
                                    "collectionId": "839",
                                    "missionId": y['missionDefId'],
                                    "bizScene": "game_center",
                                    "asac": "2A24112EX1QYGWU29IXM1H",
                                    "actionCode": "PAGEVIEW",
                                    "accountPlan": "HAVANA_COMMON"
                                }
                                try:
                                    res = self.req(api, data, "1.0")
                                    if res.json()["ret"][0] == 'SUCCESS::接口调用成功':
                                        print(f"[{self.name}] ✅任务完成")
                                        if y['missionDefId'] == '14612001':
                                            count = '5'
                                        else:
                                            count = '1'
                                        api = 'mtop.ele.biz.growth.task.core.receiveprize'
                                        data = {
                                            "missionCollectionId": "839",
                                            "missionId": y['missionDefId'],
                                            "locationInfos": "[\"{\\\"lng\\\":\\\"99.20328782498837\\\",\\\"lat\\\":\\\"99.88705499842763\\\"}\"]",
                                            "bizScene": "game_center",
                                            "accountPlan": "HAVANA_COMMON",
                                            "count": count
                                        }
                                        try:
                                            res = self.req(api, data, "1.0")
                                            if res.json()["ret"][0] == 'SUCCESS::接口调用成功':
                                                amount = res.json()["data"]["rlist"][0]["value"]
                                                print(f"[{self.name}] ✅领取奖励成功,获得--[{amount}]乐园币")
                                            else:
                                                print(f"[{self.name}] ❌领取奖励失败,原因:[{res.json()['ret'][0]}]")
                                        except Exception as e:
                                            print(f"[{self.name}] ❌领取奖励失败: {e}")
                                    else:
                                        print(f"[{self.name}] ❌任务失败,原因:{res.json()['ret'][0]}")
                                except Exception as e:
                                    print(f"[{self.name}] ❌任务失败: {e}")
            else:
                print(f"[{self.name}] ❌获取列表失败,原因:{res.json()['ret'][0]}")
        except Exception as e:
            print(f"[{self.name}] ❌获取列表失败: {e}")

    def main(self):
        try:
            if self.login():
                self.sign()
                self.task()
        except Exception as e:
            print(f"❌任务失败: {e}")


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
