const util = require('../../utils/util.js')
const db = wx.cloud.database()
const app = getApp()


Page({
    data: {
        sysW: null,
        lastDay: null,
        year: null,
        hasEmptyGrid: false,
        cur_year: '',
        cur_month: '',
        firstDay: null,
        getDate:null,
        month:null,
        display:"none",
        week:[
            {
                wook: "一"
            }, {
                wook: "二"
            }, {
                wook: "三"
            }, {
                wook: "四"
            }, {
                wook: "五"
            }, {
                wook: "六"
            }, {
                wook: "日"
            },
        ],
        day:[],
        days:[],
        ornot:false,//今天是否签到
        continuity:0,//签到天数
        sign:false,//签到弹窗
    },
    getProWeekList:function(){
        let that=this
        let date=new Date()
        let cur_year = parseInt(date.getFullYear())
        let cur_month = parseInt(date.getMonth() + 1)
        let obinl = parseInt(util.getWeekByDate(new Date()));//今天周几
        let danqian = new Date(date.getTime()).getDate()
        let shang = that.getThisMonthDays(((cur_month - 1) < 1?cur_year-1:cur_year),((cur_month - 1) < 1?12:cur_month - 1))
        let ben = that.getThisMonthDays(cur_year,cur_month)
        let xyue = 7 - (7 - obinl)
        let syue = 7 - obinl
        let array = []
        let name_a = 0
        let name_b = 0
        let name_c = 0
        for(let i = 0;i<xyue;i++){
            name_a = xyue - danqian
            name_b = shang - name_a
            name_c = name_b + i + 1
            if(name_c > shang){
                name_c = 1 + (name_a <= i?i - name_a:0)
            }
            array.push({wook:name_c})
        }
        for(let i = 0;i<syue;i++){
            name_a = danqian + i + 1
            if(name_a > ben){
               name_a = name_a - ben
            }
            array.push({wook:name_a,src:''})
        }
        that.setData({
            day:array
        })
    },
    dateSelectAction: function (e) {
        let cur_day = e.currentTarget.dataset.idx;
        this.setData({
            todayIndex: cur_day
        })
        console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day + 1}日`);
        },
        setNowDate: function () {
        const date = new Date();
        const cur_year = date.getFullYear();
        const cur_month = date.getMonth() + 1;
        const todayIndex = date.getDate();
        const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
        this.calculateEmptyGrids(cur_year, cur_month);
        this.setData({
            cur_year: cur_year,
            cur_month: cur_month,
            weeks_ch,
            todayIndex,
        })
    },

    getThisMonthDays(year, month) {
        return new Date(year, month, 0).getDate();
    },
    getFirstDayOfWeek(year, month) {
        return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },
    calculateEmptyGrids(year, month) {
        const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
        let empytGrids = [];
        if (firstDayOfWeek > 0) {
            for (let i = 0; i < firstDayOfWeek; i++) {
                empytGrids.push(i);
            }
            this.setData({
                hasEmptyGrid: true,
                empytGrids
            });
        } else {
            this.setData({
                hasEmptyGrid: false,
                empytGrids: []
            });
        }
    },
	calculateDays(year, month) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000; 
        var n = timestamp * 1000;
        var tiem = new Date(n); 
        var Y = tiem.getFullYear();
        var M = (tiem.getMonth() + 1 < 10 ? '0' + (tiem.getMonth() + 1) : tiem.getMonth() + 1);
        let getDate = this.data.ornot?this.data.getDate:(this.data.getDate - 1) //多少号
        let cur_year = this.data.cur_year//年
        let cur_month = this.data.cur_month//月
        let thisMonthDays = this.getThisMonthDays(year, month);
        let month_s = year.toString() + (month.toString().length == 1?'0' + month.toString():month.toString());
        let openitem = (this.data.opentime[0] + '' +((this.data.opentime[1]+'').length == 1?'0'+this.data.opentime[1]:this.data.opentime[1]));
        for (let i = 1; i <= thisMonthDays; i++) {
            if(month_s > openitem){
                this.data.days.push({wook:i,src:''});
            }else if(openitem < month_s && month == this.data.shuttime[1]){//小于开始月份
                this.data.days.push({wook:i,src:i <= getDate?'/images/newspaper.png':''});
            }else if(openitem == month_s && month == this.data.opentime[1]){
                if((Y+''+M) == month_s && this.data.opentime[2] <= i && i <= (this.data.ornot?this.data.getDate:this.data.getDate-1)){
                    this.data.days.push({wook:i,src:'/images/newspaper.png'});
                }else if((Y+''+M) != month_s && this.data.opentime[2] <= i){
                    this.data.days.push({wook:i,src:'/images/newspaper.png'});
                }else{
                    this.data.days.push({wook:i,src:''});
                }
            }else if(openitem == month_s && month < this.data.shuttime[1]){
                this.data.days.push({wook:i,src:this.data.opentime[2] <= i?'/images/newspaper.png':''});
            }else if(openitem < month_s && month < this.data.shuttime[1]){
                this.data.days.push({wook:i,src:'/images/newspaper.png'});
            }else{
                this.data.days.push({wook:i,src:''});
            }
        }
        this.setData({
            days:this.data.days,
        })
    },
    //上下月
    handleCalendar(e) {
        const handle = e.currentTarget.dataset.handle;
        const cur_year = this.data.cur_year;
        const cur_month = this.data.cur_month;
        this.setData({
            days:[]
        })
        if (handle === 'prev') {
            let newMonth = cur_month - 1;
            let newYear = cur_year;
            if (newMonth < 1) {
                newYear = cur_year - 1;
                newMonth = 12;
            }
            this.calculateDays(newYear, newMonth);
            this.calculateEmptyGrids(newYear, newMonth);

            let firstDay = new Date(newYear, newMonth - 1, 1);
            this.data.firstDay = firstDay.getDay();
            this.setData({
                cur_year: newYear,
                cur_month: newMonth,
                marLet: this.data.firstDay
            })
            if (this.data.month == newMonth) {
                this.setData({
                    judge: 1
                })
            } else {
                this.setData({
                    judge: 0
                })
            }
        } else {
            let newMonth = cur_month + 1;
            let newYear = cur_year;
            if (newMonth > 12) {
                newYear = cur_year + 1;
                newMonth = 1;
            }
            this.calculateDays(newYear, newMonth);
            this.calculateEmptyGrids(newYear, newMonth);
            let firstDay = new Date(newYear, newMonth - 1, 1);
            this.data.firstDay = firstDay.getDay();
            this.setData({
                cur_year: newYear,
                cur_month: newMonth,
                marLet: this.data.firstDay
            })
            if (this.data.month == newMonth){
                this.setData({
                    judge:1
                })
            }else{
                this.setData({
                    judge: 0
                })
            }
        }  
    },
    dataTime: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var months = date.getMonth() + 1;

        //获取现今年份
        this.data.year = year;

        //获取现今月份
        this.data.month = months;

        //获取今日日期
        this.data.getDate = date.getDate();

        //最后一天是几号
        var d = new Date(year, months, 0);
        this.data.lastDay = d.getDate();

        //第一天星期几
        let firstDay = new Date(year, month, 1);
        this.data.firstDay = firstDay.getDay();
        this.setData({
            marLet:this.data.firstDay
        })
    },
    
    onshow:function(){

        this.setData({
            display:"block",
        })
    },
    onhide:function(){
        this.setData({
            display: "none",
        })
    },
    onLoad: function (options) {
      var that = this
      // 添加打卡总数据
      wx.cloud.database().collection('cardAll').where({
        _openid: app.openid
      }).get().then(res => {
        // console.log(res)
        let data = res.data
        if (data.length == 0) {
          db.collection('cardAll').add({
            data:{
              num1: 0,
              num2: 0,
            }
          })
        }
      })
      // 获取打卡天数
  
      const collection = db.collection('cardDetail')
      collection.where({
        _openid: app.openid
      }).count().then(res => {
        console.log(res)
        console.log(that.data)
        
        // that.data.continuity = res.total
        // console.log(that.continuity)

        that.setData({
          continuity: res.total,
        })
       
      }).catch(err => {
        console.error('查询失败：', err)
      })
      console.log("card onload")
    
        this.setNowDate();
        this.getProWeekList()
        this.dataTime();
        var res = wx.getSystemInfoSync();
        this.setData({
            sysW: res.windowHeight / 12-5,//更具屏幕宽度变化自动设置宽度
            getDate: this.data.getDate,
            judge:1,
            month: this.data.month,
        });
        this.sigarr();
    },
    //获取数组参数
    sigarr:function(e){
        let that = this
        let ornot = that.data.ornot?0:1//当天是否签到
        let continuity = that.data.continuity//连续签到天数
        let obinl = parseInt(util.getWeekByDate(new Date()));//今天周几
        let cur_year = that.data.cur_year;//年份
        let cur_month = that.data.cur_month - 1;//月份
        if (cur_month < 1) {//月份小于1年份减1
            cur_year = cur_year - 1;
            cur_month = 12;
        }
        let num = obinl<continuity?(obinl + 1):continuity
        //七日签到数组
        for(let i = 0;i < num;i++){
            if(i <= (obinl + 1)){ 
                if(ornot == 0){
                    if(0 <= (obinl - i - 1)){
                        that.data.day[obinl - i - 1].src = "/images/newspaper.png"
                    }
                }else{
                    if(0 <= (obinl - i - 2)){
                        that.data.day[obinl - i - 2].src = "/images/newspaper.png"
                    }
                }
            }else{
                return false
            }
        }  
        //签到数组
        that.setData({
            day:that.data.day,//七天签到
            shuttime:[that.data.cur_year,that.data.cur_month,(that.data.getDate - ornot)],//结束签到时间
        })
        if(that.data.getDate < continuity){//当前天数不够减去连续签到天数
            let qindao = continuity - that.data.getDate//签到天数
            let rili = parseInt(that.getThisMonthDays(cur_year, cur_month))//上月天数
            if((rili + that.data.getDate) < continuity){//连续签到天数大于上个月加当前日期的和
              let num = 1
              let guil = ''
              let gumlitem = continuity - rili - that.data.getDate + ornot
              for(let i = 0;i < num;i++){
                  num++
                  cur_month = cur_month - 1
                  if (cur_month < 1) {
                      cur_year = cur_year - 1;
                      cur_month = 12;
                  }
                  guil = parseInt(that.getThisMonthDays(cur_year, cur_month))//上月天数
                  gumlitem = gumlitem - guil
                  if(gumlitem < 1){
                      gumlitem = Math.abs(gumlitem) +  1
                      num = 0
                  }
              }
              that.setData({
                  opentime:[cur_year,cur_month,gumlitem],//开始签到时间
              })
            }else{
                that.setData({
                    opentime:[cur_year,cur_month,(rili - qindao + 1 - ornot)],//开始签到时间
                })
            }
        }else{
            that.setData({
                opentime:[that.data.cur_year,that.data.cur_month,(that.data.getDate - continuity + 1 - ornot)],//开始签到时间
            })
        }
        this.calculateDays(that.data.cur_year, that.data.cur_month);//数组获取
    },
    //打卡签到
    dakainc:function(e){
        let that = this 
        let date = new Date();
        that.setData({
            ornot:true,
            continuity:that.data.continuity + 1,
            days:[],
            cur_year:date.getFullYear(),
            cur_month:date.getMonth() + 1,
            todayIndex:date.getDate(),
            judge:1,
        })
        that.dataTime()//年月份排版
        that.calculateEmptyGrids(that.data.cur_year,that.data.cur_month)//年月份排版
        that.sigarr();//获取数组参数
        that.popup();//显示签到弹窗
        // 添加数据
        wx.cloud.database().collection('cardDetail').add({
          data:{
            cardtime: date
          }
        })

         
    },
    //显示签到弹窗
    popup:function(e){
        this.setData({
            sign:!this.data.sign
        })
    },
    //七日数组显示文字
    wenlin:function(e){
        let index = e.currentTarget.dataset.index
        this.data.day[index].check = this.data.day[index].check?false:true
        this.setData({
            day:this.data.day
        })
    },
    //数组显示文字
    wenldisp:function(e){
        let index = e.currentTarget.dataset.index
        this.data.days[index].check = this.data.days[index].check?false:true
        this.setData({
            days:this.data.days
        })
    },
    //滑动切换
    swiperTab: function (e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
    },
    //点击切换
    clickTab: function (e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current,
            })
        }
    },
})
