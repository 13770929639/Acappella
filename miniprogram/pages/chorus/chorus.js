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
    mysongs: [{
      id: 5,
      name: '遺サレタ場所／遮光',
      url: 'cloud://acappella-0876fc.6163-acappella-0876fc/MusicIcon/3.jpg',
      music: 'cloud://acappella-0876fc.6163-acappella-0876fc/Music/遺サレタ場所／遮光.mp3',
      publisher: '岡部啓一',
      cast: ['小红', '小明', '', '小亮', '', ''],//阵容
      lyric: '噜噜噜啦啦啦啦啦啦啦\n啊啊啊啊啊啊啊啊啊啊',//歌词
      count: '2'}],

    songs: [{
      id: 0,
      name: 'Dragonsong',
      url: 'cloud://acappella-0876fc.6163-acappella-0876fc/MusicIcon/1.jpg',
      music: 'cloud://acappella-0876fc.6163-acappella-0876fc/Music/Dragonsong.mp3',
      publisher: 'Susan',
      cast:['小红','','小黑','小亮','','小绿'],//阵容
      lyric: "Children of the land do you hear\nEchoes of truths that once rang clear\nTwo souls intertwined\nOne true love they did find\nBringing land and heavens near\nBut flames that burn full bright, soon fell dark\nMemories dimmed by shadowed hearts\nIn the waxing gloom did wane the lovers moon\nWatching as their worlds drift apart\nOne souls cry\nA passion dwelling within\nSacrifice, a final plea to her kin\nYet this bond of hope, by treachery was broke\nScattering her words to the wind\nSwelling over long\nSeas of blood, are a song\nAnd death an afterthought\nTo those who fight for naught\nA throne, lying empty\nA reign, incomplete\nAlone, for eternity\nA pain, without cease\nChildren of the land, answer this",//歌词
      count: '5'
    }, {
      id: 1,
      name: 'EXEC_FLIP_FUSIONSPHERE',
      url: 'cloud://acappella-0876fc.6163-acappella-0876fc/MusicIcon/2.jpg',
      music: 'cloud://acappella-0876fc.6163-acappella-0876fc/Music/EXEC_FLIP_FUSIONSPHERE.mp3',
      publisher: 'V.A.',
      cast: ['小红', '小明', '小黑', '小亮', '', '小绿'],
      count: '1'
    }, {
      id: 2,
      name: 'Anwsers',
      url: 'cloud://acappella-0876fc.6163-acappella-0876fc/MusicIcon/3.jpg',
      music: 'cloud://acappella-0876fc.6163-acappella-0876fc/Music/Susan Calloway - Answers.mp3',
      publisher: 'susan',
      cast: ['小红', '', '小黑', '小亮', '', '小绿'],
      count: '3'
    }, {
      id: 3,
      name: '梦幻',
      publisher: 'V.A.',
      count: '6',
      cast: ['小红', '', '小黑', '小亮', '', '小绿'],
      music: 'cloud://acappella-0876fc.6163-acappella-0876fc/Music/夢幻.mp3',
      url: 'cloud://acappella-0876fc.6163-acappella-0876fc/MusicIcon/4.jpg'
    }, {
      id: 4,
      name: '萤塚',
      publisher: 'Calvaria',
      cast: ['小红', '', '小黑', '小亮', '', '小绿'],
      count: '6',
      music: 'cloud://acappella-0876fc.6163-acappella-0876fc/Music/萤塚.mp3',
      url: 'cloud://acappella-0876fc.6163-acappella-0876fc/MusicIcon/5.jpg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.towerSwiper('tower');
  },
  chooseMusic(e) {

    var id = e.currentTarget.dataset.id

    try {
      wx.setStorageSync('song', this.data.songs[id])
    } catch (e) {}
    wx.navigateTo({
      url: '../songDetail/songDetail'
    })
  },
  chooseMyMusic(e){

    var id = e.currentTarget.dataset.id

    try {
      wx.setStorageSync('song', this.data.mysongs[id])
    } catch (e) { }
    wx.navigateTo({
      url: '../songDetail/songDetail'
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