// pages/shelf/shelf.js
//获取应用实例

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
  

 
      data: {
        nickname:'微信用户',
        avatar: '',
        show: false
      },
      showPopup() {
        this.setData({ show: true });
      },
    
      onClose() {
        this.setData({ show: false });
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let userinfo = wx.getStorageSync('userInfo');
        if (userinfo) {
            this.setData({
                // avatar: dev_request.BASE_URL + userinfo.icon,
                avatar: userinfo.avatarUrl,
                nickname: userinfo.nickName,
            })
        }
    },

/* 获取用户授权 */

    /**
     * 关于作者
     */
    aboutAuthor:function () {
        wx.navigateTo({
            url: "../about/about"
        })
    },
    clickCard:function () {
      wx.navigateTo({
          url: "../card/card"
      })
    },
    test(){
      console.log("dianjil")
      console.log(wx.getStorageSync('userInfo'))
      // 直接调用数据库测试
      // const db = wx.cloud.database()
      // db.collection('ceshi').get({
      //   success: function(res) {
      //     console.log(res)
      //     console.log(res.data)
      //   },
      //   fail(e){
      //     console.log(e)
      //   }
      // })
      // wx.cloud.callFunction({
      //   // 云函数名称
      //   name: 'login',
      //   // 传给云函数的参数
      //   // data: {
      //   //   a: 1,
      //   //   b: 2,
      //   // },
      // })
      // .then(res => {
      //   console.log(res) // 3
      // })
      // .catch(console.error)

    },
    /**
     * 退出登录
     */
    outLogin: function () {
        let that=this
        wx.showModal({
            title: '是否退出登录？',
            content: '退出后将清除用户本地用户信息以及阅读记录',
            success: res => {
                if (res.confirm) {
                    wx.clearStorage()
                    app.globalData.user_info = ''
                    that.setData({
                        avatar: '../../image/dev.png',
                        username: '未登录',
                    })
                }
            }
        })
    }
})