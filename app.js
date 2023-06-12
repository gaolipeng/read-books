//app.js
App({

  getOpenID() {
    let that = this
    console.log('getOpenID')
    return new Promise((resolve) => {
      wx.cloud.callFunction({
        name: 'getId' // 云函数的名称
      }).then(res => {
        console.log(res)
        const app = getApp()
        app.openid = res.result.openid
        // 从云函数返回的结果中提取出目标数据 
        that.login(res.result.openid)
        resolve(res.result.openid);
   
      })
    })
  },
  onLaunch: function () {
    console.log('onLanuch')
      wx.cloud.init({
        env: 'cloud1-6gyszzt796272f87' // 你的云开发环境ID
      }),
      
      
      // 打开调试
      wx.setEnableDebug({
          enableDebug: true
      })
      this.getOpenID()
      
  },

  login(openid) {
    console.log('登录')
    console.log(openid)
    let that = this
    wx.cloud.database().collection('user').where({
      _openid: openid
    }).get().then(res => {
      // 查询openid是否已注册（是否在 user 表中）
      console.log(res.data)
      let data = res.data
      if (data.length > 0) {
        let userInfo = data[0]
          wx.setStorageSync('userInfo', userInfo)
          wx.switchTab({
            url: "/pages/shelf/shelf"
        })
      } else {       
        that.gotoRegister()
      }
    })
  },
  gotoRegister(){
    console.log('gotoRegister')
    wx.navigateTo({
      url: "/pages/info/info"
   })
  },

  globalData: {
    openid: 'openid',
    appid: 'wxcf431e81711984db',
    appsecret: '07a921c4ff08a0609411c25ed0c1fb08',
    user_info:'',
  }
})