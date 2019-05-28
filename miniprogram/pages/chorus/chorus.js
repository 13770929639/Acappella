// miniprogram/pages/chorus/chorus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    cardCur: 0,
    recommend: [{
        id: 1,
        url: 'cloud://acappella-0876fc.6163-acappella-0876fc/7.jpg'
      },
      {
        id: 3,
        url: 'cloud://acappella-0876fc.6163-acappella-0876fc/2.jpg'
      },
      {
        id: 4,
        url: 'cloud://acappella-0876fc.6163-acappella-0876fc/5.jpg'
      },
    ],
    mysongs:[],

    songs: [ //合唱歌曲，每次随机5-10个，下拉刷新
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
  
   

  },
  onShow(){
    //获取openid
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        wx.request({
          url: 'http://47.102.219.51:8080/aka/song/mysong', // 我的歌曲
          method: 'GET',
          data: {
            openid: res.result.openid
          },
          success(res) {
            that.setData({
              mysongs: res.data.result
            })
            console.error("songs" ,res.data.result)
          }
        })

      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../solo/solo',
        })
      }
    })
    wx.request({
      url: 'http://47.102.219.51:8080/aka/song/songlist', // 歌曲列表
      method: 'GET',
      data: {
      },
      success(res) {
        that.setData({
          songs: res.data.result
        })
      }
    })

    this.towerSwiper('tower');
  },
  chooseMusic(e) {

    var id = e.currentTarget.dataset.id

    try {
      wx.setStorageSync('song', this.data.songs[id])
      console.error('选择歌曲', id)
    } catch (e) {}
    wx.navigateTo({
      url: '../songDetail/songDetail'
    })
  },
  chooseMyMusic(e) {

    var id = e.currentTarget.dataset.id

    try {
      wx.setStorageSync('song', this.data.mysongs[id])
    } catch (e) {}
    wx.navigateTo({
      url: '../songDetail/songDetail'
    })
  },
  //删除
  delMusic(e) {
    var that=this
    var id = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '确定删除吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'http://47.102.219.51:8080/aka/song/' + id, // 我的歌曲
            method: 'DELETE',
            data: {
            },
            success(res) {
              console.error(' [delMusic] 调用', res)
              if (res.data.success == true) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
              }
              else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'fail',
                  duration: 1000,
                  mask: true
                })
              }

              that.onShow()
            },
            fail: err => {

              console.error(' [delMusic] 调用失败', err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  
  
  },
 


  //以下是轮播用的
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      towerList: list
    })
  },

  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },

  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },

  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.towerList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        towerList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        towerList: list
      })
    }
  },
});