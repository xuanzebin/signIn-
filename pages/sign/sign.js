const app=getApp()
const AV = require('../.././libs/av-weapp-min.js')

Page({
  data:{
    todos: [],
    formList:app.data.formList
  },
  onReady:function(e){
    new AV.Query('formList')
      .descending('createdAt')
      .find()
      .then(todos => {
        let array=[]
        todos.forEach((value,index)=>{
          let {name,time,creater,remarks,signIn,leave}=value.attributes
          let id=value.id
          array.unshift({name,time,creater,remarks,signIn,leave,id})
        })
        app.data.formList=array
        this.setData({ formList: app.data.formList })
      })
      .catch(console.error);
  },
  onShow:function(e){
    if (this.data.formList !== app.data.formList){
      this.setData({formList:app.data.formList})
    }
  }, 
  createSign:function(e){
    wx.navigateTo({
      url: '../create-signform/create-signform',
    })
  },
  signInConfirm:function(e){
    let formIndex=e.currentTarget.dataset.index
    if (app.data.formList[formIndex].signIn === true) return
    app.data.formList[formIndex].signIn = true
    this.setData({ formList: app.data.formList })
    let updateSignIn = AV.Object.createWithoutData('formList', this.data.formList[formIndex].id)
    updateSignIn.set('signIn', true)
    updateSignIn.save()
  },
  leaveConfirm:function(e){
    let formIndex = e.currentTarget.dataset.index
    if (app.data.formList[formIndex].leave === true) return
    app.data.formList[formIndex].leave = true
    this.setData({ formList: app.data.formList })
    let updateSignIn = AV.Object.createWithoutData('formList', this.data.formList[formIndex].id)
    // 修改属性
    updateSignIn.set('leave', true)
    // 保存到云端
    updateSignIn.save()
  }
})