#
# 变量：elmck: 必填，账号cookie
# cron: 30 4 * * *
#

# const $ = new Env('跳一跳');


import hashlib
import os
import re
import time
import requests
from urllib.parse import urlencode, quote

host = 'https://acs.m.goofish.com'

ck = ''

import json
import random
import string


def generate_random_string(length=50):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def reorder_ck(s: str) -> str:
    order = ["cookie2", "sgcookie", "unb", "USERID", "SID", "token", "utdid", "deviceId", "umt"]
    cookies = s.split(';')
    cookie_dict = {}
    for cookie in cookies:
        key_value = cookie.split('=', 1)
        if len(key_value) == 2:
            key, value = key_value
            cookie_dict[key.strip()] = value.strip()
    reordered_cookies = []
    for key in order:
        if key in cookie_dict:
            reordered_cookies.append(f"{key}={cookie_dict[key]}")
    return ';'.join(reordered_cookies) + ';'

def get_ck_usid(ck1):
    key_value_pairs = ck1.split(";")
    for pair in key_value_pairs:
        key, value = pair.split("=")
        if key == "USERID":
            return value
        else:
            return '账号'

def hbh5tk(tk_cookie, enc_cookie, cookie_str):
    """
    合并带_m_h5_tk
    """
    txt = cookie_str.replace(" ", "")
    txt = txt.replace("chushi;", "")
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

class TYT:
    def __init__(self, cki):
        self.name = None
        self.ck = cki
        self.cki = tq1(cki)
        self.uid = self.cki.get("unb")
        self.sid = self.cki.get("cookie2")
        self.name1 = get_ck_usid(cki)
        if self.name1 is None:
            raise ValueError("❎获取USERID失败，跳过该账号")


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

    def game_grid_jump(self, jump_count):
        grid_data = []
        prev_end_config_info = None
        for i in range(jump_count):
            start_grid_id = i
            end_grid_id = i + 1
            jump_time = random.randint(500, 1000)
            start_coordinates = (random.uniform(0, 5), random.uniform(0, 5))
            end_coordinates = (random.uniform(0, 5), random.uniform(0, 5))

            if i > 0:
                start_config_info = prev_end_config_info
            else:
                start_config_info = generate_random_string()

            end_config_info = generate_random_string()
            jump_interval = random.randint(1000, 5000)

            grid_data.append({
                "startGridId": start_grid_id,
                "endGridId": end_grid_id,
                "jumpTime": jump_time,
                "startCoordinatesX": str(start_coordinates[0]),
                "startCoordinatesY": str(start_coordinates[1]),
                "endCoordinatesX": str(end_coordinates[0]),
                "endCoordinatesY": str(end_coordinates[1]),
                "startConfigInfo": start_config_info,
                "endConfigInfo": end_config_info,
                "jumpInterval": jump_interval
            })

            prev_end_config_info = end_config_info
        return grid_data

    def task(self):
        api = 'mtop.ele.biz.growth.task.core.querytask'
        data = json.dumps({"bizScene": "JUMP_GAME", "accountPlan": "HAVANA_COMMON", "missionCollectionId": "1265",
                           "locationInfos": "[\"{\\\"lng\\\":\\\"105.754581\\\",\\\"lat\\\":\\\"30.60041\\\"}\"]",
                           "missionIds": "[22562022,22562021]"})
        try:
            res = self.req1(api, data, "1.0")
            if res.json()['ret'][0] == 'SUCCESS::接口调用成功':
                if res.json()["data"]["mlist"][0]["stage"]['count'] < 5:
                    count = 5 - int(res.json()["data"]["mlist"][0]["stage"]['count'])
                    for _ in range(int(count)):
                        api = 'mtop.ele.biz.growth.task.event.pageview'
                        data = {"collectionId": "1265", "missionId": "22562021", "actionCode": "PAGEVIEW",
                                "pageFrom": "a2ogi.bx1161372", "viewTime": "15", "bizScene": "JUMP_GAME",
                                "accountPlan": "KB_ORCHARD", "sync": "false",
                                "asac": "2A23B18B2HYMDVFDDOXP2F"}
                        try:
                            res1 = self.req(api, data, "1.0")
                            print(res1.json().get("ret")[0])
                        except Exception as e:
                            print(f"[{self.name}] ❎请求失败{e}")
                            return None
        except Exception as e:
            print(f"[{self.name}] ❎请求失败1")

        api = 'mtop.ele.biz.growth.task.core.querytask'
        data = json.dumps({"bizScene": "JUMP_GAME", "accountPlan": "HAVANA_COMMON", "missionCollectionId": "1265",
                           "locationInfos": "[\"{\\\"lng\\\":\\\"105.754581\\\",\\\"lat\\\":\\\"30.60041\\\"}\"]",
                           "missionIds": "[22562022,22562021]"})
        try:
            res = self.req1(api, data, "1.0")
            if res.json()['ret'][0] == 'SUCCESS::接口调用成功':
                for y in res.json()['data']['mlist']:
                    for o in y['missionStageDTOS']:
                        if o['rewardStatus'] == "TODO" and o['status'] == "FINISH":
                            if o['rewards'][0]['name'] == "游戏次数":
                                api1 = 'mtop.ele.biz.growth.task.core.receiveprize'
                                data1 = {"bizScene": "JUMP_GAME", "missionCollectionId": "1265", "missionId": "22562021",
                                         "locationInfos": "[\"{\\\"lng\\\":\\\"105.754353\\\",\\\"lat\\\":\\\"30.600449\\\"}\"]",
                                         "count": o['stageCount'], "asac": "2A23B18B2HYMDVFDDOXP2F"}
                                try:
                                    res1 = self.req(api1, data1, "1.0")
                                    if res1 is None:
                                        continue
                                    data = res1.json()["data"]
                                    if data.get('errorMsg') is not None:
                                        print(f"[{self.name}] ❎领取奖励失败: {data['errorMsg']}")
                                    else:
                                        rlist = data.get('rlist')
                                        if rlist is not None:
                                            print(f"[{self.name}] ✅领取游戏次数成功--{rlist[0]['value']}次")
                                        else:
                                            print(f"[{self.name}] ❎{res1.json()['ret'][0]}")
                                except Exception:
                                    print(f'请求错误')
                                    return None
        except Exception as e:
            print(f"[{self.name}] ❎请求失败{e}")

    def startgame(self):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = {"bizScene": "JUMP_GAME", "bizMethod": "start", "bizParam": "{}"}
        try:
            res = self.req(api, data, "1.0")
            if res is None:
                return None
            if res.json()["ret"][0] == "SUCCESS::调用成功":
                pattern = r'"gameId":"(\w+)"'
                match = re.search(pattern, str(res.json()))
                if match:
                    gameId = match.group(1)
                    return gameId
                else:
                    print("❎解析数据失败")
                    return None
            else:
                if res.json()["ret"][0] == "FAIL_SYS_SESSION_EXPIRED::Session过期":
                    print(f"[{self.name1}] ❎cookie已过期，请重新获取")
                    return None
                else:
                    print(f'[{self.name1}] ❎{res.json()["ret"][0]}')
                    return None
        except Exception:
            print(f'❎请求错误')
            return None

    def endgame(self):
        gameId = self.startgame()
        if gameId is None:
            return
        for i, gridId in enumerate([5, 20, 60], start=1):
            grid_jump_list = self.game_grid_jump(gridId)
            biz_param = {
                "gameId": gameId,
                "gridJumpList": grid_jump_list,
                "gridId": gridId
            }

            biz_request = {
                "bizScene": "JUMP_GAME",
                "bizMethod": "receiveReward",
                "bizParam": json.dumps(biz_param, separators=(',', ':'))
            }

            try:
                api = 'mtop.alsc.playgame.mini.game.dispatch'
                res = self.req(api, biz_request, "1.0")
                if res is None:
                    return None
                res_json = res.json()
                if res_json["ret"][0] == "SUCCESS::调用成功":
                    data_str = res_json['data']['data']
                    real_grant_value = re.search(r'"realGrantValue":(\d+)', data_str)
                    amount = int(real_grant_value.group(1)) if real_grant_value else None
                    if amount is not None:
                        print(f"[{self.name}] ✅第{i}关完成，获得--{amount}乐园币")
                    else:
                        print(f"[{self.name}] ", res_json)
                        print(f"[{self.name}] ❎第{i}关完成，并没有获得奖励")
                else:
                    if res_json["ret"][0] == "FAIL_SYS_SESSION_EXPIRED::Session过期":
                        print(f"[{self.name1}] ❎cookie已过期，请重新获取")
                        return None
                    else:
                        print(res_json["ret"][0])
                        return None
            except json.JSONDecodeError as e:
                print(f'[{self.name}] ❎JSON 解析错误: {e}')
                return None
            except requests.RequestException as e:
                print(f'[{self.name}] ❎请求错误: {e}')
                return None
            time.sleep(random.randint(1, 3))

    def main(self):
        if self.login():
            print(f"----尝试领取游戏次数----")
            self.task()
            print(f"----尝试完成闯关----")
            self.endgame()


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
        ck = reorder_ck(ck)
        print(f"======开始第{i + 1}个账号======")
        TYT(ck).main()
        print("2s后进行下一个账号")
        time.sleep(2)
