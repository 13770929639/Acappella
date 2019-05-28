// miniprogram/pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:null,
    openid:null,
    TabCur: 0,
    scrollLeft: 0,
    name:null,
    time: '12:01',
    date: '2019-5-28',
    location:null,
    maxPeopleCounting:0,
    comment:null,
    tabs:['全部活动','我的发起','我的加入'],
    activitys:[
      
    ],
    mypublish:[
     
      ],
    myjoin:[
   
    ]
  },
  updata: function(e){
    var that = this
    wx.cloud.callFunction({ //获取openid
      name: 'login',
      complete: res => {
        that.setData({
          openid: res.result.openid
        })
        console.log(this.data.openid)
        wx.request({  //获取mypublish
          url: 'http://47.102.219.51:8080/aka/activity/myactivity',
          data: {
            openid: res.result.openid
          },
          method: 'GET',
          success(res) {
            that.setData({
              mypublish: res.data.result
            })
            console.log(res)
          }
        })
        wx.request({  //获取activitys
          url: 'http://47.102.219.51:8080/aka/activity/activitylist',
          method: 'GET',
          data: {
            openid: res.result.openid
          },
          success(res) {
            if (res.data.success) {
              that.setData({
                activitys: res.data.result
              })
            }
            console.log(res.data)
          }
        })
        wx.request({  //获取myjion
          url: 'http://47.102.219.51:8080/aka/activity/participateactivity',
          method: 'GET',
          data: {
            openid: res.result.openid
          },
          success(res) {
            if (res.data.success) {
              that.setData({
                myjoin: res.data.result
              })
            }
            console.log(res.data)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.error('昵称', res.userInfo)
              this.setData({
                nickname: res.userInfo.nickName
              })
            }
          })
        }
      }
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        this.setData({
          openid: res.result.openid
        })

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)

      }
    })
    this.updata()
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  PushActivity(e){
    this.setData({
      modalName: null
    });
    if (this.data.name == null || this.data.name ==' ') {
      wx.showModal({
        title: '提示',
        content: '活动名称不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    var that=this
    console.log('发布成功', that.data.comment)
    wx.request({  //新建活动
      url: 'http://47.102.219.51:8080/aka/activity',
      data: {
        creatorOpenid: that.data.openid,
        creatorNickname: that.data.nickname,  
        name: that.data.name,
        time: that.data.date + ' ' + that.data.time+':00',
        location: that.data.location,
        maxPeopleCounting: that.data.maxPeopleCounting,
        comment: that.data.comment,
        phone: that.data.phone
      },
      method: 'POST',
      header: {'content-type': 'application/json;charset=utf-8'},
      success(res) {
        if (res.statusCode==200){
          console.log(that.data.name)
          console.log(res.data.reason)
          that.updata()
        }
        else if (res.statusCode==500) {
          wx.showModal({
            title: '提示',
            content: '活动名称和活动地点不能为空',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        }
      },
      fail(e){
        console.log('发布失败')
      }
    })
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  NameChange(e) {
    this.setData({
      name: e.detail.value
    })
  },
  CountingChange(e) {
    this.setData({
      maxPeopleCounting: e.detail.value
    })
  }, 
  CommentChange(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  add(){

  },
  LoactionChange(e){
    this.setData({
      location: e.detail.value
    })
  },
  PhoneChange(e){
    this.setData({
      phone: e.detail.value
    })
  },

  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  jion:function(e) {
   var that=this
   wx.request({
     url: 'http://47.102.219.51:8080/aka/activity/' + e.currentTarget.id,
     data:{
       openid:that.data.openid
     },
     method:'POST',
     success(res){
       wx.showToast({
         title: '参与活动成功',
         icon: 'success',
         duration: 1000,
         mask: true
       })
      that.updata()
     },
     fail(e){
       console.log('参与失败'+e)
     }
   })
  },
  delete:function(e){
    var that=this
    wx.request({
      url: 'http://47.102.219.51:8080/aka/activity/' + e.currentTarget.dataset.id,
      data:{
        openid:that.data.openid
      },
      method:'DELETE',
      success(res){
        console.log(e.currentTarget.dataset.id)
        console.log('删除成功' + res)
        that.updata()
      },
      fail(m){
        console.log('删除失败：'+ e.currentTarget.dataset.id)
      }
    })
  }
})