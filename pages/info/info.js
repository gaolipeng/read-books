// index.js
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {

    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
  },

  onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    wx.cloud.uploadFile({
      cloudPath: 'image/' + app.globalData.openid + Date.now() + '.png', // 云存储路径，可自定义
      filePath: avatarUrl,
      success: (res) => {
        console.log('上传成功', res.fileID)
        this.setData({
          avatarUrl: res.fileID,
        })
        this.avatarUrl = res.fileID
        // 这里可以将 fileID 保存到数据库或其他地方
      },
      fail: (error) => {
        console.log('上传失败', error)
      }
    })

 
  },
  formSubmit(e){

      console.log('昵称：',e.detail.value.nickname)

      let userData = {
        avatarUrl: this.avatarUrl,
        nickName: e.detail.value.nickname,
      }
      if(userData.nickName == ''){
        console.log("error")
      }
      else{
        this.addUser(userData)
      }

  },
  addUser(userData){
    console.log(userData)
    const db = wx.cloud.database()
    db.collection("user").add({
      data:userData
    })
    wx.setStorageSync('userInfo', userData)
    wx.switchTab({
      url: "/pages/shelf/shelf"
  })
  }

})
