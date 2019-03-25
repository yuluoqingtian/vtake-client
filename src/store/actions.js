/*
间接通过mutations更新state的多个方法的对象
 */

import {
  RECEIVE_ADDRESS,
  RECEIVE_FOODTYPES,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  RECEIVE_GOODS
} from './mutations-type'

import {
  reqAddress,
  reqFoodTypes,
  reqShops,
  reqShopGoods,
  reqShopInfo,
  reqShopRatings
} from '../api'

export default {
  //  异步获取地址
  async getAddress ({commit, state}) {
    //  发送异步ajax请求
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqAddress(geohash)
    // 根据结果提交一个mutation
    // 这里是字符串0不是数字0
    if (result.code === '0') {
      const address = result.data
      commit(RECEIVE_ADDRESS, {address})
    }
  },

  async getFoodTypes ({commit}) {
    //  发送异步ajax请求
    const result = await reqFoodTypes()
    // 根据结果提交一个mutation
    if (result.code === '0') {
      const foodTypes = result.data
      commit(RECEIVE_FOODTYPES, {foodTypes})
    }
  },

  async getShops ({commit, state}) {
    //  发送异步ajax请求
    const result = await reqShops(state.latitude, state.longitude)
    // 根据结果提交一个mutation

    // console.log(state.latitude,state.longitude)
    //
    // console.log(result)
    if (result.code === '0') {
      const shops = result.data
      commit(RECEIVE_SHOPS, {shops})
    }
  },

  //  同步记录用户信息
  recordUser ({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo})
  },

  // 异步获取商家信息
  async getShopInfo({commit}) {
    const result = await reqShopInfo()
    if(result.code===0) {
      const info = result.info
      console.log(info)
      commit(RECEIVE_INFO, {info})
    }
  },

  async getShopRatings({commit}) {
    const result = await reqShopRatings()
    if(result.code===0) {
      const ratings = result.ratings
      commit(RECEIVE_RATINGS, {ratings})
    }
  },

  // 异步获取商家商品列表
  async getShopGoods({commit}) {
    const result = await reqShopGoods()
    if(result.code===0) {
      const goods = result.goods
      commit(RECEIVE_GOODS, {goods})
    }
  },


}
