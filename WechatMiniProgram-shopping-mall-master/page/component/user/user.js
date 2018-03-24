// page/component/new-pages/user/user.js
Page({
  data: {
    thumb: '',
    nickname: '',
    orders: [],
    hasAddress: false,
    goodName:'',
    goodMainUrl:'',
    address: {}
  },

  //（待做：自动刷新）
  onLoad() {
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    }),

      /**
       * 发起请求获取订单列表信息（待做：自动刷新）
       */
      setTimeout(function () {//用延迟执行的方式避免因为事务冲突得到刚刚删除空的数据库而得不到数据
      var nickName = getApp().globalData.nickName;
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo
          nickName = userInfo.nickName
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
        }
      }),
        wx.request({
          url: 'http://localhost:8080/yMybatis/orders/get_all',
          method:"POST",
          data:{
            "nickName":nickName
          },
          success(res) {
            console.log(res.data)
            self.setData({
              orders: res.data
            })
          }
        });
      }, 1000)
  },
  onShow() {
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  payOrders: function (e){
    var self = this;
    wx.showModal({
      //title: 'message',
      content: "确认退订？",
      text: 'center',
      success: function(){
        wx.request({
          url: 'http://localhost:8080/yMybatis/orders/del',
          header: {
            'content-type': 'application/json'
          },
          method: 'DELETE',
          data: {
            "orderId": e.currentTarget.dataset.id
          },
          success: function (res) {
            wx.showModal({
              //title: 'message',
              content: res.data,
              text: 'center',
              complete() {
                wx.reLaunch({
                  url: "/page/component/user/user"
                })
              }
            })
          }
        })
      }
    })
  }
})