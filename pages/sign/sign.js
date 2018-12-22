const app=getApp()
const AV = require('../.././libs/av-weapp-min.js')

Page({
  data:{
    todos: [],
    formList:app.data.formList,
    userNickName: null,
    userPicUrl: null,
    userId:null
  },
  onReady(e){
    this.setData({
      userNickName: app.globalData.userInfo.nickName,
      userPicUrl: app.globalData.userInfo.avatarUrl
    })

    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          console.log(user.toJSON())
          this.setData({
            userId: user.toJSON().objectId
          })
        }).catch(console.error);
      }
    })
  },
  onShow(e){
    if (this.data.formList !== app.data.formList){
      this.setData({formList:app.data.formList})
    }
    new AV.Query('formList')
      .descending('createdAt')
      .find()
      .then(todos => {
        let array = []
        todos.forEach((value, index) => {
          let { name, time, creater, remarks, signIn, leave,owner } = value.attributes
          signIn=JSON.parse(signIn)
          leave=JSON.parse(leave)
          let id = value.id
          array.push({ name, time, creater, remarks, signIn, leave, id,owner })
        })
        app.data.formList = array
        console.log(array)
        this.setData({ formList: app.data.formList })
      })
      .catch(console.error);
  }, 
  createSign(e){
    wx.navigateTo({
      url: '../create-signform/create-signform',
    })
  },
  signInConfirm(e){
    let formIndex=e.currentTarget.dataset.index
    let userNickName=this.data.userNickName
    if (app.data.formList[formIndex].signIn[userNickName] === true) return
    app.data.formList[formIndex].signIn[userNickName] = true
    this.setData({ formList: app.data.formList })
    let updateSignIn = AV.Object.createWithoutData('formList', this.data.formList[formIndex].id)
    updateSignIn.set('signIn', JSON.stringify( app.data.formList[formIndex].signIn) )
    // app.data.formList[formIndex].signIn
    updateSignIn.save()
  },
  leaveConfirm(e){
    let formIndex = e.currentTarget.dataset.index
    let userNickName = this.data.userNickName
    if (app.data.formList[formIndex].leave[userNickName] === true) return
    app.data.formList[formIndex].leave[userNickName] = true
    this.setData({ formList: app.data.formList })
    let updateSignIn = AV.Object.createWithoutData('formList', this.data.formList[formIndex].id)
    // 修改属性
    updateSignIn.set('leave', JSON.stringify( app.data.formList[formIndex].leave) )
    // 保存到云端
    updateSignIn.save()
  },
  clickIntoForm(e){
    wx.navigateTo({
      url: `../formMessage/formMessage?index=${e.currentTarget.dataset.index}`
    })
  },
  onShareAppMessage: function () {
    return {

      title: '社团签到',

      desc: '快拉上你的社团小伙伴一起来签到和分享吧！~',

      path: '/pages/index/index'

    }
  },
  deleteForm(e){
    let index=e.currentTarget.dataset.index
    var form = AV.Object.createWithoutData('formList',this.data.formList[index].id );
    form.destroy().then( (success)=> {
      console.log('删除成功')
      let formList=this.data.formList
      formList.splice(index,1)
      this.setData({formList})
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
    }, function (error) {
      console.log('删除失败')
    });
  }
})