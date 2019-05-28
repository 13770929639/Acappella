// miniprogram/pages/songDetail/songDetail.js
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

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
        console.log("detail"+value)
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
      // Do something when catch error
    }
  },
  onUnload(){
    this.innerAudioContext.stop()
    console.log('停止')
    this.setData({ isstartMusic: false })
  },
  onReady(){
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.src = this.data.song.songFiles[0]
    console.log(this.data.song.songFiles[0])
  },
  startMusic() {
    if (this.data.isstartMusic==false){
      
      this.innerAudioContext.play()
      console.log("开始播放")
      this.setData({ isstartMusic:true })
    }
    else{
      this.innerAudioContext.stop()
      console.log('停止')
      this.setData({ isstartMusic:false})
    }
    this.innerAudioContext.onPlay(() => {
      
     
    })
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
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
  //选择声部
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
})