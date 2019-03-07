/*
直接更新state的多个方法的对象
 */

import {
  RECEIVE_ADDRESS,
  RECEIVE_FOODTYPES,
  RECEIVE_SHOPS
} from './mutations-type'

export default {
  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address
  },
  [RECEIVE_FOODTYPES] (state, {foodTypes}) {
    state.foodTypes = foodTypes
  },
  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops
  }
}
