const app=getApp()
const AV = require('../.././libs/av-weapp-min.js')

Page({
  data:{

  },
  signformSubmit:function(e){
    let newForm=e.detail.value
    var FormList = AV.Object.extend('formList')
    // 新建对象
    var formList = new FormList()
    // 设置名称
    formList.set('name', newForm.name)
    formList.set('creater', newForm.creater)
    formList.set('time', newForm.time);
    formList.set('remarks', newForm.remarks)
    formList.set('signIn','{}')
    formList.set('leave','{}')
    // 设置优先级
    formList.save().then(function (formList) {
      console.log('objectId is ' + formList.id);
      newForm.signIn={}
      newForm.leave={}
      newForm.id=formList.id
      app.data.formList.unshift(newForm)
      wx.navigateBack({
        delta: 1
      })
    }, function (error) {
      console.error(error);
    });
  }
})
