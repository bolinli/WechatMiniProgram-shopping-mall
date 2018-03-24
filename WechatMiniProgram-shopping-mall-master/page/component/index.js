const ImageUploader = require('../common/image_uploader/image_uploader.js');
Page({
  data: {
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    odd_goods: ["nae", "john"],
    even_goods: [],
    title_goods:[],
    new_even: "jjfdsafsdafsdafasf",
    interval: 3000,
    duration: 800,
    isManager: false,
    isManagers: wx.getStorage({
      key: 'isManager',
      success: function(res)
      {this.isManager=res.data;
      console.log(res.data+" is "+this.isManager)},
    }),
    img1: ImageUploader.mergeData({
      imageUploadTitle: '图片',

      sourceType: ['camera', 'album'], //上传图片的来源，相机/相册
      sizeType: ['original'],//上传前是否压缩，默认原图
      maxCount: 1,//一次选择图片的数量
      //以上三个配置项详情请看小程序文档

      uploadedImagesPaths: [],//保存已上传的图片路径，也可以设置初始时就显示的图片
      uploadParams: {
        url: 'http://localhost:8080/yMybatis/upload/temp/image',//后台接收上传图片的路径
        name: 'file',//后台依靠这个字段拿到文件对象
        formData: {}//这个字段可以设置传到后台的额外的参数
        //以上三个配置项详情请看小程序文档
      }
    }),
  },
  onReady() {//获取奇数商品详情
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        getApp().globalData.nickName = userInfo.nickName
      }
    }),
    this.setData({
      //new_even:this.data.new_even.substr(1,6)
      //new_even: "aabybccddeeffgghhii".substr(3,6)       
    })
    var self = this;
    wx.request({
      url: 'http://localhost:8080/yMybatis/good/get_all_odd',
      success(res) {
        self.setData({
          odd_goods: res.data,
          //new_even:res.data[2].goodName.substr(3,6)//good      
        });
      }
    });
    wx.request({
      url: 'http://localhost:8080/yMybatis/good/get_all_even',
      success(res) {
        self.setData({
          even_goods: res.data,
        });
      },
    });
    wx.request({
      url: 'http://localhost:8080/yMybatis/good/get_title',
      success(res) {
        self.setData({
          title_goods: res.data,
        });
      },
    });
  },
  uploadfile(e){
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        console.log(nickName);
        if (nickName === "柏林") {
          getApp().globalData.isManager = true;
          console.log(getApp().globalData);
        } else {
          getApp().globalData.isManager = false;
        }
      }
    });
  },
  //index.js
  //获取应用实例


  onLoad: function() {
    new ImageUploader(this, 'img1');
    // new ImageUploader(this, 'img2');
  }
})


