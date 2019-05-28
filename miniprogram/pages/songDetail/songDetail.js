// miniprogram/pages/songDetail/songDetail.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const innerAudioContext1 = wx.createInnerAudioContext(),
  innerAudioContext2 = wx.createInnerAudioContext(),
  innerAudioContext3 = wx.createInnerAudioContext(),
  innerAudioContext4 = wx.createInnerAudioContext(),
  innerAudioContext5 = wx.createInnerAudioContext();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    song: {},
    isstartMusic:false,//是否正在播放音乐
    isstart: false,//录音是否正在进行
    parts:1,//自己的声部,女中音
    canSing:true,//是否有权演唱
    toView: 'red',
    scrollTop: 100,
    cast: ['女高音', '女中音', '女低音', '男高音', '男中音', '男低音', '人声打击'],
    index:0

  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
   
    try {
      var value = wx.getStorageSync('song')
      this.inner = [innerAudioContext1, innerAudioContext2, innerAudioContext3, innerAudioContext4, innerAudioContext5];
      console.error("inner", this.inner)
      var text = value.lyric
      var des = text.split('\\n').join('\n');
       des = des.split('\\r').join('\r');
          this.setData({
            canSing:true,
            song: value,
            isstartMusic: false,
            lyric:des
          })
   
    } catch (e) {
      console.error('error', e)
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //console.error('昵称', res.userInfo)
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
  },
  onUnload(){
    innerAudioContext.stop()
    console.log('停止')
    this.setData({ isstartMusic: false })
    for (var i = 0; i < 5 && i < this.data.song.peopleCounting; i++) {
      this.inner[i].src = this.data.song.songFiles[i]
      this.inner[i].stop()
    }
  },
  onReady(){
    
  },
  startMusic() {
    if (this.data.isstartMusic==false){
      for (var i = 0; i < 5 && i < this.data.song.peopleCounting;i++){
        this.inner[i].src = this.data.song.songFiles[i]
        this.inner[i].play()
        console.error('播放', this.data.song.songFiles[i])       
      }
      console.log("开始播放")
      this.setData({ isstartMusic:true })
    }
    else{
      for (var i = 0; i < 5 && i < this.data.song.peopleCounting; i++) {
        this.inner[i].src = this.data.song.songFiles[i]
        this.inner[i].stop()
      }
      console.log('停止')
      this.setData({ isstartMusic:false})
    }
    
   
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
  startsing: function () {
    this.startMusic()
    if (this.data.isstart ==false) {
      this.setData({

        isstart: true
      })
      this.start()
    }
    else {
      this.setData({
        isstart: false

      })
      this.stop()
    }
  },
  start: function () {
    const options = {
      duration: 100000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },

  //停止录音
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
  },


  //播放声音
  play: function () {
    this.startMusic()
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal() {
    this.setData({
      modalName: null
    })
  }, 
  //提交
  formSubmit(e) {
    var that = this
    wx.uploadFile({
      url: 'http://47.102.219.51:8080/aka/song/'+that.data.song.songId, //仅为示例，非真实的接口地址
      filePath: this.tempFilePath,
      name: 'songFile',
      formData: {
        'openid': this.data.openid,
        'nickname': this.data.nickname,
        'part': this.data.cast[this.data.index]
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success(res) {
        console.log(res)
        if(res.statusCode==200){
          wx.navigateBack({ url: '../chorus/chorus'})
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000,
            mask: true
          })
          that.hideModal()
         
        }
        else{
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          that.hideModal()
        }
       
        
      },
      fail: err => {

        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 1000,
          mask: true
        })
        that.hideModal()
      }
    })
  },
  //选择声部
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
})