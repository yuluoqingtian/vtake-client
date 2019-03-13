<template>
  <div class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
       <span class="header_search" slot="left">
         <i class="iconfont icon-sousuo"></i>
       </span>

      <span class="header_login" slot="right">
        <span class="header_login_text">登录|注册</span>
      </span>

    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav">
      <div class="swiper-container" v-if="foodTypesArr.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(foodTypes,index) in foodTypesArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(foodType,index) in foodTypes" :key="index">
              <div class="food_container">
                <img :src="foodType.imageUrl">
              </div>
              <span>{{foodType.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" alt="back" v-else>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang "></i>
        <span class="shop_header_title">附近商家</span>
      </div>
    </div>
    <shop-list/>
  </div>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  import HeaderTop from '../../components/HeaderTop/HeaderTop'
  import ShopList from '../../components/ShopList/ShopList'
  import {mapState} from 'vuex'

  export default {
    name: 'MSite',
    async mounted () {

      //获取食品分类列表
      this.$store.dispatch('getFoodTypes')
      this.$store.dispatch('getShops')


    },
    components: {HeaderTop, ShopList},

    computed: {
      ...mapState(['address','foodTypes']),

      foodTypesArr () {

        let bigArr = [] //  大数组
        let smallArr = [] //  小数组
        const foodTypes = this.foodTypes

        let fullLength = foodTypes.length

        foodTypes.forEach(foodType => {
          smallArr.push(foodType)
          fullLength--

          if (smallArr.length === 8 || fullLength === 0) {
            console.log(fullLength)
            bigArr.push(smallArr)
            smallArr = []
          }
        })
        return bigArr

      }
    },
    watch: {
      foodTypes(value){
        this.$nextTick(()=>{
          //  创建一个Swiper实例对象，来实现轮播
          var mySwiper =  new Swiper('.swiper-container', {
            //配置对象
            speed: 600,
            loop: true, // 循环模式选项
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              //type: 'progressbar'
            },
            autoplay: {
              delay: 3000,
              stopOnLastSlide: false,
              disableOnInteraction: true,
            }
          })
          mySwiper.pagination.$el.addClass('.swiper-pagination')
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite //首页
    width 100%
    //轮播
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%

        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            height 85%
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            margin-top 20px
            .link_to_food
              width 25%

              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          > span.swiper-pagination-bullet
            background #02a774
            margin-bottom -5px
    /*附近商家*/
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .iconfont
          color #999
          font-size 14px
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px

</style>
