// miniprogram/pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    time: '12:01',
    date: '2018-12-25',
    tabs:['全部活动','我的发起','我的加入'],
    activitys:[
      {name:'线下合唱-小星星',
        time:'2019-6-10 10:00',
        position:'南京理工大学',
        phone:'13770929639',
        counts:9,
        hint:'参加的同学请加群：123455333',
        totalcounts:20
      },
      {
        name: '线下合唱-小星星',
        time: '2019-6-10 10:00',
        position: '南京理工大学',
        phone: '13770929639',
        counts: 9,
        hint:'-',
        totalcounts: 20
      },
      {
        name: '线下合唱-小星星',
        time: '2019-6-10 10:00',
        position: '南京理工大学',
        phone: '13770929639',
        counts: 9,
        hint: '-',
        totalcounts: 20
      },
    ],
    mypublish:[
      {
        name: '我发布的线下合唱1',
        time: '2019-6-10 10:00',
        position: '南京理工大学',
        phone: '13770929639',
        counts: 10,
        hint: '-',
        totalcounts: 20
      }
      ],
    myjoin:[
      {
        name: '我加入的线下合唱1',
        time: '2019-6-10 10:00',
        position: '南京理工大学',
        phone: '13770929639',
        counts: 11,
        hint: '-',
        totalcounts: 20
      },
      {
        name: '我加入的线下合唱2',
        time: '2019-6-10 10:00',
        position: '南京理工大学',
        phone: '13770929639',
        counts: 20,
        hint: '-',
        totalcounts: 20
      },
    ]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  add(){

  },

  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  }
})