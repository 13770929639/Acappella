// miniprogram/pages/solo/solo.js

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgURL:'',
    standstyle:'',
    singing1style:'display:none;',
    singing2style:'display:none;',
    hint:'',
    isstart:false,
    mode:'生成伴奏'
  },
  onLoad: function (options) {

  },
  startsing:function(){
    if(this.data.standstyle==''){
      this.setData({
        standstyle: 'display:none;',
        singing1style: '',
        hint:'',
        isstart:true
      })
      this.countTime()
      this.start()
    }
    else{
      this.setData({
        standstyle: '',
        isstart:false
     
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
  changemode(){
    if (this.data.mode =='生成伴奏'){
      this.setData({mode:'测试音高'})
    }
    else{
      this.setData({ mode:'生成伴奏'})
    }
  },
  countTime(){
    let that = this;
    let countDownNum = 0;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        that.setData({
          hint: countDownNum
        })
        countDownNum++;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (that.data.standstyle == '' || countDownNum>=360) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          that.setData({
            hint: '',
            singing1style: 'display:none;',
            singing2style: 'display:none;',       
          })
                  
        }
        else{if (countDownNum%2==0){
          that.setData({
            singing1style: 'display:none;',
            singing2style: '',
          })
        }
        if (countDownNum % 2 == 1) {
          that.setData({
            singing1style: '',
            singing2style: 'display:none;',
          })
        }}
      }, 1000)
    })
  }


})