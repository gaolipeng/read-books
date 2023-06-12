var dev_request = require('../../utils/dev_request');

Page({

    /**
     * 页面的初始数据
     */
    
    data: {
        isEmpty: false,
        empty_msg: 'Pen友，书架没书，赶紧添加几本吧',
        books: []
    },

 
    books:function () {
      wx.navigateTo({
          url: "../book1/books"
      })
  },
  book1:function () {
    wx.navigateTo({
        url: "../book2/book2"
    })
},
     
    
    


    onShow: function () {
        let that = this
        dev_request.Get('/user/bookshelf', function (books) {
            if (books.data.length > 0) {
                that.isEmpty = true
                books.data.forEach(function (item) {
                    item.cover = dev_request.ZHUISHU_URL + item.cover
                })
                that.setData({
                    books: books.data
                })
            } else {
                that.isEmpty = false
            }
        })
    },

    openBook: function (params) {
        let book=params.currentTarget.dataset.book
        wx.navigateTo({
            url: '../read/read?bookid=' + book._id + '&isCollect=' + book.isCollect + '&bookTitle=' + book.title
        })
    }

})