<template>
  <div class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">V-Take</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phoneNumber">
              <button :disabled="!isRightPhone" class="get_verification"
                      :class="{right_phone:isRightPhone&&this.computeTime===0
                      }" @click.prevent="getCode">
                {{showTextOrTime}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="messageCode">
            </section>
            <section class="login_hint">
              温馨提示：未注册V-Take外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">
                  <div class="switch_circle" :class="{right:showPwd}"></div>
                  <span class="switch_text">{{showPwd?'abc':''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="/api/imgs" alt="captcha" @click="getNewCaptcha" ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="back">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alert-text="alertText" v-show="showAlert" @closeTip="closeTip"></AlertTip>
  </div>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip'

  //  引入登陆相关ajax函数
  import {reqSendCode, reqSmsLogin, reqPwdLogin} from '../../api/index'

  export default {
    name: 'Login',
    data () {
      return {
        loginWay: true,//  true代表短信登陆
        phoneNumber: '',
        computeTime: 0,  //计时的时间
        showPwd: false, //是否显示密码，默认不显示
        pwd: '',
        messageCode: '',  //  短信验证码
        name: '', //用户名
        captcha: '',  //图形验证码,
        alertText: '', // 提示文本
        showAlert: false //  是否显示提示框
      }
    },
    computed: {
      isRightPhone () {
        return /^1\d{10}$/.test(this.phoneNumber)
      },
      showTextOrTime () {
        if (this.computeTime === 0) {
          return '获取验证码'
        } else {
          return '已发送' + this.computeTime
        }
      }
    },
    methods: {
      back: function () {
        this.$router.back()
      },
      //  异步获取验证码
      async getCode () {
        //启动倒计时
        if (this.computeTime === 0) {
          this.computeTime = 60
          this.interValId = setInterval(() => {
            this.computeTime--
            if (this.computeTime <= 0) {
              clearInterval(this.interValId)
            }
          }, 1000)
        }

        //发送ajax请求(向指定验证码发送短信)
        const result = await reqSendCode(this.phoneNumber)
        if (result.code === '1') {
          //  发送验证码失败，1、显示提示，2、停止倒计时
          this.makeAlert(result.msg)
          if (this.computeTime) {
            this.computeTime = 0
            clearInterval(this.interValId)
            this.interValId = undefined
          }
        }

      },

      makeAlert (alertText) {
        this.showAlert = true
        this.alertText = alertText
      },

      //  异步登陆
      async login () {
        //  前台表单验证
        //  判断登录方式
        let result
        if (this.loginWay) {  //  短信登陆
          const {isRightPhone, phoneNumber, messageCode} = this
          if (!isRightPhone) {
            this.makeAlert('手机号不正确')
            return
          } else if (!/^\d{6}$/.test(messageCode)) {
            //  验证码必须是6位数字
            this.makeAlert('验证码必须是6位数字')
            return
          }
          //  发送ajax请求短信登陆
          result = await reqSmsLogin(phoneNumber, messageCode)

        } else { // 密码登陆
          const {name, pwd, captcha} = this
          if (!name) {
            //  用户名不能为空
            this.makeAlert('用户名不能为空')
            return
          } else if (!pwd) {
            //  密码不能为空
            this.makeAlert('密码不能为空')
            return
          } else if (!captcha) {
            //  验证码不能为空
            this.makeAlert('验证码不能为空')
            return
          }
          //  发送ajax请求密码登陆
          result = await reqPwdLogin(name, pwd, captcha)
        }

        if (this.computeTime) {
          this.computeTime = 0
          clearInterval(this.interValId)
          this.interValId = undefined
        }

        //  根据结果数据处理
        if (result.code === '0') {
          //  登陆成功
          const user = result.data
          //  将user保存到state中
          this.$store.dispatch('recordUser', user)
          // 跳转路由去个人中心
          this.$router.replace('/profile')
        } else {
          //  登陆失败
          this.getNewCaptcha()
          const msg = result.msg
          this.makeAlert(msg)

        }

      },

      //  关闭弹窗
      closeTip () {
        this.showAlert = false
        this.alertText = ''
      },

      //  刷新验证码
      getNewCaptcha () {
        //  这里加时间参数是为了让每次的src都不一样，才能刷新
        this.$refs.captcha.src = '/api/imgs?time=' + Date.now()
      }
    },
    components: {
      AlertTip
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          > a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        > form
          > div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color: black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s, border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                > .switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 12px
              line-height 20px
              > a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 60px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        > .iconfont
          font-size 20px
          color #999
</style>
