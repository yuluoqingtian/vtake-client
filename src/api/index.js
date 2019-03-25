/*
包含n个接口请求函数的模块
返回值是promise对象
 */

//这里引入的是我自己封装的ajax请求函数，不是系统自带的
import ajax from '../api/ajax'

const BASE_URL = '/api'

const MOCK_BASE_URL = '/mock'

// 1、根据经纬度获取位置详情
export const reqAddress = (geohash) => ajax(BASE_URL+'/position/?geohash='+geohash)
// 2、获取食品分类列表
export const reqFoodTypes = () => ajax(BASE_URL+'/index_category')
// 3、根据经纬度获取商铺列表
export const reqShops=(latitude,longitude)=>ajax(BASE_URL+'/shops/?latitude='+latitude+'&'+'longitude='+longitude)
// 4、根据关键字搜索商铺列表
export const reqSearchShop = (keyword) => ajax(BASE_URL+'/search_shops/?keyword='+keyword)
// 5、获取一次性验证码
// 6、用户名密码登陆
export const reqPwdLogin = (userName,password,captcha) => ajax(BASE_URL+'/login_pwd',{userName,password,captcha},'POST')
// 7、发送短信验证码
export const reqSendCode = (phoneNumber) => ajax(BASE_URL+'//sendcode/?phoneNumber='+phoneNumber)
// 8、手机号验证码登陆
export const reqSmsLogin = (phoneNumber,messageCode) => ajax(BASE_URL+'/login_sms',{phoneNumber,messageCode},'POST')
// 9、根据会话获取用户信息

// 10、用户登出

//  11、获取店铺食品
export const reqShopGoods = ()=>ajax(MOCK_BASE_URL+'url=goods')

//  12、获取店铺食品
export const reqShopRatings =()=>ajax(MOCK_BASE_URL+'url=ratings')

//  13、获取店铺食品
export const reqShopInfo=() =>ajax(MOCK_BASE_URL+'uri=info')




