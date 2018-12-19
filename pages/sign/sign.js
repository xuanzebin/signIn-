const app=getApp()
const AV = require('../.././libs/av-weapp-min.js')

// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello World!'
// }).then(function (object) {
//   console.log(1)
// })
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
          let {name,time,creater,remarks}=value.attributes
          array.push({ name, time, creater, remarks})
        })
        console.log(array)
        // this.setData({formList:array})
        app.data.formList=array
        this.setData({ formList: app.data.formList })
      })
      .catch(console.error);
  },
  onShow:function(e){
    console.log('show')   
    if (this.data.formList !== app.data.formList){
      this.setData({formList:app.data.formList})
    }
    console.log(this.data.formList)
  }, 
  createSign:function(e){
    wx.navigateTo({
      url: '../create-signform/create-signform',
    })
  }
})