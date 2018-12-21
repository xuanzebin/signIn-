// pages/formMessage/formMessage.js
const app=getApp()
const AV = require('../.././libs/av-weapp-min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formIndex:null,
    userList:[],
    signInList:[],
    leaveList:[]
  },
  onLoad:function(e){
    this.setData({formIndex:e.index})
  },
  onReady: function (e) {
  },
  onShow(e){
    new AV.Query('_user')
      .descending('createdAt')
      .find()
      .then(todos => {
        let userList = this.data.userList
        todos.forEach((value, index) => {
          let userMessage = {}
          userMessage.nickName = value.attributes.nickName
          userMessage.avatarUrl = value.attributes.avatarUrl
          userList.push(userMessage)
        })
        this.setData({ userList })

        let signInList = []
        let leaveList = []
        for (let key in app.data.formList[this.data.formIndex].signIn) {
          userList.forEach((value, index) => {
            if (value.nickName === key) {
              signInList.push(value)
            }
          })
        }
        for (let key in app.data.formList[this.data.formIndex].leave) {
          userList.forEach((value, index) => {
            if (value.nickName === key) {
              leaveList.push(value)
            }
          })
        }
        this.setData({
          signInList,
          leaveList
        })
      })
      .catch(console.error)
  }
})