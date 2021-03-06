//index.js
//获取应用实例
const app = getApp()
const AV = require('../.././libs/av-weapp-min.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    this.setData({
      userInfo: null,
      hasUserInfo: false
    })
    app.globalData.userInfo=null
  },
  onLoad: function () {

    AV.User.loginWithWeapp().then(user => {
    }).catch(console.error)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  intoIndex(e){
    wx.switchTab({
      url: "../sign/sign"
    })
  },
  onShareAppMessage: function () {
    return {

      title: '社团签到',

      desc: '快拉上你的社团小伙伴一起来签到和分享吧！~',

      path: '/pages/index/index'

    }
  }
})


