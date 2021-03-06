/* ajax请求函数模块
* 返回值，promise对象(异步返回的数据是：response.data)
* */
import axios from 'axios'
import qs from 'qs'

axios.defaults.withCredentials=true;

export default function ajax (url, data = {}, type = 'GET') {
  return new Promise(function (resolve, reject) {
    //  执行异步ajax请求，成功调用resolve(),失败调用reject()
    let promise
    if (type === 'GET') {
      //准备url query参数数据
      let dataStr = ''  //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr!==''){
        dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'))
        url = url+'?'+dataStr
      }
      //  发起get请求
      promise = axios.get(url)
    }else {
      //  发起post请求
      console.log("发起了post请求")
      promise = axios.post(url,qs.stringify(data))
    }

    promise.then(function (response) {
      resolve(response.data)
    }).catch(function (error) {
        reject(error)
      })

  })
}
