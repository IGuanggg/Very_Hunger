#
# 变量：elmck: 必填，账号cookie
# cron: 12 4 * * *
#

# const $ = new Env('卡皮巴拉');


import json
import logging
import os
import random
import re
import time
import requests
from urllib.parse import quote

from requests import RequestException

host = 'https://acs.m.goofish.com'

ck = ''


import json
import random
import string


def generate_random_string(length=50):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def get_ck_usid(ck1):
    key_value_pairs = ck1.split(";")
    for pair in key_value_pairs:
        key, value = pair.split("=")
        if key == "USERID":
            return value
        else:
            return '账号'


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
            "http://192.168.1.124:1888/api/getXSign",
            # "http://127.0.0.1:18848/api/getXSign",
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


def req(api, data, uid, sid, wua='False', v="1.0"):
    try:
        if type(data) == dict:
            data = json.dumps(data)
        wua = str(wua)
        sign = xsign(api, data, uid, sid, wua, v)
        url = f"{host}/gw/{api}/{v}/"
        headers = {
            "x-sgext": quote(sign.get('x-sgext')),
            "x-sign": quote(sign.get('x-sign')),
            'x-sid': sid,
            'x-uid': uid,
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


class TYT:
    def __init__(self, cki):
        self.taskId = None
        self.stop = False
        self.gameId = None
        self.token = None
        self.name = None
        self.taskList = None
        self.cki = tq(cki)
        self.uid = self.cki.get("unb")
        self.sid = self.cki.get("cookie2")
        self.name1 = get_ck_usid(cki)

    def login(self):
        api1 = 'mtop.alsc.user.detail.query'
        data1 = json.dumps({})
        try:
            res1 = req(api1, data1, self.uid, self.sid, "1.0")
            if res1.json()['ret'][0] == 'SUCCESS::调用成功':
                self.name = res1.json()["data"]["encryptMobile"]
                api = 'mtop.koubei.interaction.center.common.queryintegralproperty.v2'
                data = json.dumps({"templateIds": "[\"1404\"]"})
                try:
                    res = req(api, data, self.uid, self.sid, "1.0")
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

    def gettoken(self):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = json.dumps(
            {"bizScene": "CAPYBARA", "bizMethod": "login", "bizParam": "{\"gameId\":\"13254\",\"inviterId\":null}",
             "longitude": "104.09800574183464", "latitude": "30.22990694269538"})
        res = req(api, data, self.uid, self.sid, "1.0")
        if res.json()['ret'][0] == 'SUCCESS::调用成功':
            y = json.loads(res.json()["data"]["data"])
            self.token = y["data"]["token"]
            self.gameId = y["data"]["openId"]
            return True
        elif res.json()['ret'][0] == 'FAIL_SYS_SESSION_EXPIRED::Session过期':
            print(f"[{self.name1}] ❎cookie已过期，请重新获取")
            return False
        else:
            print(f'[{self.name1}] ❌获取token失败,原因:{res.text}')
            return False

    # 开始游戏
    def startgame(self):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = json.dumps({"bizScene": "CAPYBARA", "bizMethod": "startGame",
                           "bizParam": "{\"levelId\":\"1\",\"isRestart\":true,\"gameId\":\"" + self.gameId + "\",\"token\":\"" + self.token + "\"}",
                           "longitude": "105.75325090438128", "latitude": "30.597472842782736"})
        res = req(api, data, self.uid, self.sid, "1.0")
        print("助力: " + res.text)

    ## 菜品类型
    def scdisheslx(self):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = json.dumps({"bizScene": "CAPYBARA", "bizMethod": "startGame",
                           "bizParam": "{\"levelId\":\"1\",\"isRestart\":false,\"gameId\":\"" + self.gameId + "\"}"})
        try:
            res = req(api, data, self.uid, self.sid, "1.0")
            if res.json()['ret'][0] == 'SUCCESS::调用成功':
                a = json.loads(res.json()["data"]["data"])
                if a['data']['levelInfo']['orders']['CusS1001']['foodId'] == '_':
                    foodid = 'Food1001'
                else:
                    foodid = a['data']['levelInfo']['orders']['CusS1001']['foodId']
                foodNum = a['data']['levelInfo']['orders']['CusS1001']['currCount']
                if foodid in a['data']['levelInfo']['currFoods']:
                    if self.scdishes() is not None:
                        if 'currFoods' in a['data']['levelInfo'] and foodid in a['data']['levelInfo']['currFoods']:
                            foodlx = a['data']['levelInfo']['currFoods'][foodid]
                            return foodid, foodNum, foodlx
                        else:
                            print(f"菜品类型错误")
                            return None, None, None
                    else:
                        print(f"菜品类4444型错误")
                        return None, None, None
                else:
                    return 'Food1001', foodNum, 1
            else:
                print(f"[{self.name}] ❎获取菜品类型失败--{res.text}")
                return None, None, None
        except RequestException as e:
            print(f"[{self.name}] ❎请求失败: {str(e)}")
            return None, None, None
        except Exception as e:
            logging.exception(f"[{self.name}] ❎请求失败: {str(e)}")
            return None, None, None

    # 上菜
    def scdishes(self):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = json.dumps({"bizScene": "CAPYBARA", "bizMethod": "handFoodOut",
                           "bizParam": "{\"levelId\":\"1\",\"handCount\":10,\"gameId\":\"" + self.gameId + "\"}"})
        try:
            res = req(api, data, self.uid, self.sid, "1.0")
            if res.json()['ret'][0] == 'SUCCESS::调用成功':
                a = json.loads(res.json()["data"]["data"])
                sysum = a['data']['energy']['num']
                scjg = a['data']['outFoods']
                print(f"[{self.name}] ✅上菜成功--{scjg},剩余菜品数量:{sysum}")
                if sysum > 0:
                    return True
                else:
                    print(f"[{self.name}] ❎上菜失败--菜品数量不足")
                    self.stop = True
                    return False
            else:
                print(f"[{self.name}] ❎上菜失败--{res.json()['ret'][0]}")
                return None
        except Exception as e:
            print(f"[{self.name}] ❎2请求失败: {e}")
            return None

    # 提交菜品
    def tjdishes(self):
        foodid, foodNum, foodlx = self.scdisheslx()
        if foodlx is None:
            print(f"[{self.name}] ❎ 获取菜品信息失败")
            return
        else:
            if foodlx == 0:
                self.scdishes()
            if int(foodNum) < 10:
                api = 'mtop.alsc.playgame.mini.game.dispatch'
                data = json.dumps({
                    "bizScene": "CAPYBARA",
                    "bizMethod": "submitFood",
                    "bizParam": "{\"levelId\":\"1\",\"orderSeatId\":\"CusS1001\",\"foodId\":\"" + foodid + "\",\"foodNum\":\"" + str(
                        foodlx) + "\",\"gameId\":\"" + str(self.gameId) + "\"}"
                })
                try:
                    res = req(api, data, self.uid, self.sid, "1.0")
                    if res.json()['ret'][0] == 'SUCCESS::调用成功':
                        a = json.loads(res.json()["data"]["data"])
                        if a['bizErrorCode'] == 'ORDER_FOOD_ERROR':
                            print(f"[{self.name}] ❎提交菜品失败--{a['bizErrorMsg']}")
                            self.scdishes()
                        else:
                            print(f"[{self.name}] ✅提交菜品成功")
                    else:
                        print(f"[{self.name}] ❎提交菜品失败--{res.json()['ret'][0]}")
                except Exception as e:
                    print(f"[{self.name}] ❎1请求失败")
            if int(foodNum) >= 10:
                self.scscdishes()

    # 上传菜品
    def scscdishes(self):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = json.dumps({"bizScene": "CAPYBARA", "bizMethod": "receiveOrderAward",
                           "bizParam": "{\"levelId\":\"1\",\"orderSeatId\":\"CusS1001\",\"gameId\":\"" + self.gameId + "\"}"})
        try:
            res = req(api, data, self.uid, self.sid, "1.0")
            if res.json()['ret'][0] == 'SUCCESS::调用成功':
                # print(res.json())
                print(f"[{self.name}] ✅上传菜品成功")
            else:
                print(f"[{self.name}] ❎上传菜品失败--{res.json()['ret'][0]}")
        except Exception as e:
            print(f"[{self.name}] ❎1请求失败: {e}")

    def task(self):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = json.dumps({"bizScene": "CAPYBARA", "bizMethod": "getTasks",
                           "bizParam": "{\"gameId\":\"" + self.gameId + "\",\"token\":\"" + self.token + "\"}",
                           "longitude": "104.09800574183464", "latitude": "30.22990694269538"})
        
        res = req(api, data, self.uid, self.sid, "1.0")
        print(f"获取任务列表",res.text)

        if res.json()['ret'][0] == 'SUCCESS::调用成功':
            self.taskList = json.loads(res.json()["data"]["data"])
            return True

    def checkTask(self):
        self.task()
        if 'T001' in self.taskList['data']['tasks']:
            if self.taskList['data']['tasks']['T001']['isFinishe'] == True:
                print(f"[{self.name}] ✅任务T001已完成")
            elif self.taskList['data']['tasks']['T001']['progress'] == 30:
                print(f"[{self.name}] 尝试领取 T001 奖励")
                id = self.taskList['data']['tasks']['T001']['taskId']
                if not self.postTask(id):
                    return 'T001'
            else:
                print(f"[{self.name}] T001 任务未完成！先做任务")
                return 'T001'
        else:
            print(f"[{self.name}] T001 任务未开始！先做任务")
            return 'T001'

        if 'T002' in self.taskList['data']['tasks']:
            if self.taskList['data']['tasks']['T002']['isFinishe'] == True:
                print(f"[{self.name}] ✅任务T002已完成")
            elif self.taskList['data']['tasks']['T002']['progress'] == 200:
                print(f"[{self.name}] 尝试领取 T002 奖励")
                id = self.taskList['data']['tasks']['T002']['taskId']
                if not self.postTask(id):
                    return 'T002'
            else:
                print(f"[{self.name}] T002 任务未完成！先做任务")
                return 'T002'
        else:
            print(f"[{self.name}] T002 任务未开始！先做任务")
            return 'T002'

        if 'T003' in self.taskList['data']['tasks']:
            if self.taskList['data']['tasks']['T003']['isFinishe'] == True:
                print(f"[{self.name}] ✅任务T003已完成！")
            elif self.taskList['data']['tasks']['T003']['progress'] == 2:
                print(f"[{self.name}] 尝试领取 T003 奖励")
                id = self.taskList['data']['tasks']['T003']['taskId']
                if not self.postTask(id):
                    return 'T003'
            else:
                print(f"[{self.name}] T003 任务未完成！先做任务")
                return 'T003'
        else:
            print(f"[{self.name}] T003 任务未开始！先做任务")
            return 'T003'
            
        return True
    def postTask(self,taskId):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        data = json.dumps({"bizScene": "CAPYBARA", "bizMethod": "finisheTask",
                           "bizParam": "{\"taskId\":\"" + taskId + "\",\"gameId\":\"" + self.gameId + "\",\"token\":\"" + self.token + "\"}",
                           "longitude": "104.09800574183464", "latitude": "30.22990694269538"})
        
        res = req(api, data, self.uid, self.sid, "1.0")
        print(f"完成任务{taskId}",res.text)
        if res.json()['ret'][0] == 'SUCCESS::调用成功':
            # print(res.json())
            nested_data = json.loads(res.json()['data']['data'])
            reward_items = nested_data['data']['rewardItems']
            if reward_items:
                reward_num = reward_items[0]['num']
                print(f"[{self.name}] ✅完成任务获得乐园币--[{reward_num}]")
                return True
            return False
        return False


    def daoju(self,count):
        api = 'mtop.alsc.playgame.mini.game.dispatch'
        bizParam = json.dumps({
            "levelId":"1",
            "itemId":f"It100{random.randint(1, 3)}",
            "removeFoods":{
                "Food1003":random.randint(1, 10),
                "Food1002":random.randint(1, 10),
                "Food1004":random.randint(1, 3)
            },
            "gameId":self.gameId,
            "token":self.token,
        })
        data = json.dumps({
            "bizScene":"CAPYBARA",
            "bizMethod":"useGameProp",
            "bizParam":bizParam,
            "longitude": "104.09800574183464", 
            "latitude": "30.22990694269538"
        })
        try:
            res = req(api, data, self.uid, self.sid, "1.0")
            # print(res.json())
            if json.loads(res.json()['data']['data'])['bizErrorCode'] == 'OK':
                print(f"[{self.name}] ✅第{count}次使用道具成功！")
                count = count + 1
                return count
            else:
                print(f'[{self.name}] ❎第{count}次使用道具失败！！！',res.text)
                return count
        except Exception as e:
            print(f"[{self.name}] ❎1请求失败，结束使用道具: {e}")
            return 6

    def main(self):
        if self.login():
            self.gettoken()
            checkRes = self.checkTask()
            if checkRes != True:
                if checkRes == 'T001' or checkRes == 'T002':
                    print(f"----继续游戏----")
                    while True and self.stop == False:
                        self.tjdishes()

                    checkRes = self.checkTask()
                    if checkRes == 'T003':
                        usedCount = 1
                        while usedCount < 3:
                            usedCount = self.daoju(usedCount)
                        checkRes = self.checkTask()
            else:
                print(f"----任务已全部完成----")



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
        TYT(ck).main()
        print("2s后进行下一个账号")
        time.sleep(2)
