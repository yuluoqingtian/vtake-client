/*
间接通过mutations更新state的多个方法的对象
 */

import {
  RECEIVE_ADDRESS,
  RECEIVE_FOODTYPES,
  RECEIVE_SHOPS
} from './mutations-type'

import {
  reqAddress,
  reqFoodTypes,
  reqShops
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
    if (result.code === "0") {
      const foodTypes = result.data
      commit(RECEIVE_FOODTYPES, {foodTypes})
    }
  },

  async getShops ({commit, state}) {
    //  发送异步ajax请求
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqShops(state.latitude, state.longitude)
    // 根据结果提交一个mutation
    if (result.code === "0") {
      const shops = result.data
      commit(RECEIVE_SHOPS, {shops})
    }
  },
}
