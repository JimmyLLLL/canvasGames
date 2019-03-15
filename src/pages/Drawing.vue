<template>
  <div class="DrawingWrapper"
  >
    <div 
    class="startCount"
    v-show="showCount"
    >
    {{startCount}}
    </div>
    <div class="holdonTime">
      生存:{{holdonTime}}秒
    </div>
    <div class="robNum">
      幽灵围剿者:{{pcNum-1}}个
    </div>
    <div class="level">
      速度:{{11-playerSpeed}}
    </div>
    <canvas 
    class="canvasMain" 
    ref="canvasMain"
    @touchstart="handleTouchStart"
    >
      
    </canvas>
  </div>
</template>

<script>
export default {
  name: 'Drawing',
  data () {
    return {
      screenHeight:0,
      screenWidth:0,
      playerX:0,
      playerY:0,
      playerHeight:8,
      playerWidth:30,
      timeCir:'',  //存储定时器以清除
      moveY:0,   //一步走多远
      moveX:0,
      pc:[],    //机器人的位置情况，数组与pcNum保持一致，放弃0位置
      pcNum:1,   //机器人的数目默认1为0
      time:0,  //坚持的时间
      playerSpeed:10,    //移动的速度
      robotTimeCir:[],  //机器人的定时器
      color:['#3b2e7e','#7bcfa6','#db5a6b','#d6ecf0','#faff72','purple','#ca6924','#622a1d','red','orange'],
      robColor:[], //同样从1开始
      startCount:5,     // 5秒倒计时
      showCount:true, //展现54321时间
      holdonTime:0,   //坚持的时间
      crash:false   //真的碰撞了吗

    }
  },
  methods:{
//初始化函数

    //初始键盘监听
    learnKeyInit(){
      const that = this
      document.onkeydown = (e)=>{
          e.preventDefault()
          let key = window.event.keyCode
          if (key == 39) {
              that.handleMove('r')
          }else if(key == 37){
            that.handleMove('l')
          }else if(key == 38){
            that.handleMove('u')
          }else if(key == 40){
            that.handleMove('d')
          }
        }
    },
    //防止在gameover页面按上下键造成无效监听而报错
    deleteLearnKey(){
      document.onkeydown = (e)=>{
          e.preventDefault()
          let key = window.event.keyCode
          if (key == 39) {
          }else if(key == 37){
          }else if(key == 38){
          }else if(key == 40){
          }
        }
    },
    //每10秒加速一次
    addSpeed(){
      this.playerSpeed = this.playerSpeed-0.5
    },
    //返回幽灵的随机颜色
    randColor(){
      let ran = Math.random()*10
      ran = parseInt(ran)
      return this.color[ran]
    },
    //初始化玩家形态    
    initPlayer(isPc,num){
      const that = this
      const canvasMain = this.$refs.canvasMain
      const ctx = canvasMain.getContext("2d")
      if(isPc){  //如果是机器人的情况下
        if(!num){ //如果是第一个机器人出现
          this.robColor[this.pcNum] = this.randColor()
          ctx.fillStyle = this.robColor[this.pcNum]
          this.pc[that.pcNum] = {x:0,y:0}
          ctx.fillRect(that.pc[that.pcNum].x,that.pc[that.pcNum].y,that.playerWidth,that.playerHeight)
          this.pcNum++          
        }else{
          ctx.fillStyle = this.robColor[num]
          ctx.fillRect(that.pc[num].x,that.pc[num].y,that.playerWidth,that.playerHeight)
        }

        //垃圾逻辑，等待重构，上面都是机器人初始化

      }else{
        //如果是玩家的情况下
        ctx.fillStyle = "blue"
        ctx.fillRect(that.playerX,that.playerY,that.playerWidth,that.playerHeight)
      }

    },
    //初始化canvas，解决模糊问题
    initCanvas(){
      this.screenWidth = document.documentElement.clientWidth || document.body.clientWidth;
      this.screenHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const canvasMain = this.$refs.canvasMain
      canvasMain.width = this.screenWidth
      canvasMain.height = this.screenHeight
      //功能新增，初始化player的长度与高度
      this.moveX = 1 //每次移动1个单位
      this.moveY = 1
      this.playerHeight = this.screenHeight/20   //玩家的高度与宽度取决于屏幕的宽度
      this.playerWidth = this.screenWidth/20
      this.playerX = this.screenWidth-this.playerWidth  //让玩家的初始位置在右下角
      this.playerY = this.screenHeight-this.playerHeight
    },

//功能逻辑函数
 //让画面不再随着手指抖动
    handleTouchStart(e){
      e.preventDefault()
    },
    //连续移动,机器人与玩家
    contMove(target,pos,isRob,num){
      const that = this
      if(!isRob){
        clearInterval(that.timeCir)  //如果是玩家在用键盘控制，必须要清除上一次定时器才可能改变方向       
      }
      if(target=='x')    //当接到是左右横向移动的指令
      {
        let cir0 = setInterval(()=>{         //报错问题根源
          if(that.crash==true){  //检测是否碰撞
              clearInterval(cir0)     //碰撞则清除本次定时器
          }
          if(that.crash == false){
            if(isRob){     //如果是机器人移动
              that.clearPos(true,num)  //先清除上一次位置


              //机器人碰到墙就反向的算法
              if(that.pc[num].x<=0&&pos<0){
                that.pc[num].x = that.pc[num].x - pos
              }else if(that.pc[num].x>=that.screenWidth-that.playerWidth&&pos>0){
                that.pc[num].x = that.pc[num].x - pos
                target = 'y'
              }else{
                that.pc[num].x = that.pc[num].x + pos
              }
              
              that.initPlayer(true,num)
            }else{
              //玩家横向移动越界检测
              const beyond = that.playerX>=0&&(that.playerX+that.playerWidth)<=that.screenWidth&&(that.playerY+that.playerHeight)>=0&&that.playerY<that.screenHeight
              if(beyond){   //如果没有越界
                  that.clearPos()
                  that.playerX = that.playerX + pos
                  that.isCrash()                                 
                  that.initPlayer()
                }else{
                  this.crash = true
                  clearInterval(that.timeCir)  //如果越界，结束游戏清除定时器
                  clearInterval(cir0)  //清除自己的定时器
                  setTimeout(()=>{
                    that.$router.push({path:'/Gameover'})
                  },0)  //异步，最后才跳，给程序完成其它任务的空间
                }           
            }
          }
          },that.playerSpeed)
        //记录定时器
        if(isRob){
          this.robotTimeCir[num] = cir0
        }else{
          this.timeCir = cir0
        }  
      }else if(target=='y'){
        var cir1 = setInterval(()=>{
          if(that.crash==true){
              clearInterval(cir1)
          }
          if(that.crash == false){
            if(isRob){
              const beyond = that.pc[num].x>=0&&that.pc[num].x<that.screenWidth&&that.pc[num].y>=0&&that.pc[num].y<that.screenHeight
              that.clearPos(true,num)
              if(that.pc[num].y<=0&&pos<0){
                that.pc[num].y = that.pc[num].y - pos
              }else if(that.pc[num].y>=that.screenHeight-that.playerHeight&&pos>0){
                that.pc[num].y = that.pc[num].y -pos
              }else{
                that.pc[num].y = that.pc[num].y + pos
              }
              
              that.initPlayer(true,num)
            }else{
              const beyond = that.playerX>=0&&(that.playerX+that.playerWidth)<=that.screenWidth&&that.playerY>=0&&(that.playerY+that.playerHeight)<=that.screenHeight //越界检测
              if(beyond){
                  that.clearPos()
                  that.playerY = that.playerY + pos
                  that.isCrash()                
                  that.initPlayer()
                }else{
                  this.crash = true
                  clearInterval(cir1)
                  clearInterval(that.timeCir) 
                  setTimeout(()=>{
                    that.$router.push({path:'/Gameover'})
                  },0)
                }           
            }
          }
          },that.playerSpeed)
        if(isRob){
          this.robotTimeCir[num] = cir1
        }else{
          this.timeCir = cir1
        }
      }

    },
    //清除位置
    clearPos(isRob,num){
      const that = this
      const canvasMain = this.$refs.canvasMain
      const ctx = canvasMain.getContext("2d")
      if(isRob){
        ctx.clearRect(that.pc[num].x-1,that.pc[num].y-1,that.playerWidth+2,that.playerHeight+2)   //清除机器人的过去位置
      }else{
        ctx.clearRect(that.playerX-1,that.playerY-1,that.playerWidth+2,that.playerHeight+2)     //清除玩家的过去位置        
      }
 
    },
    //监听键盘后的触发事件    
    handleMove(status){      
      if(status=='r'){
        this.contMove('x',this.moveX)
      }else if(status=='l'){
        this.contMove('x',-this.moveX)
      }else if(status=='u'){
        this.contMove('y',-this.moveY)
      }else if(status=='d'){
        this.contMove('y',this.moveY)
      }
    },
    //处理机器人的移动，与上个函数逻辑一样的
    handleRobMove(num){
      const that = this
      let tik = setInterval(()=>{
        if(that.crash==true){
          clearInterval(tik)
        }
        const ran = Math.random()
        clearInterval(that.robotTimeCir[num])
        if(ran<0.25){
          that.contMove('x',that.moveX,true,num)
        }else if(ran>=0.25&&ran<0.5){
          that.contMove('x',-that.moveX,true,num)       
        }else if(ran>=0.5&&ran<0.75){
          that.contMove('y',that.moveY,true,num)
        }else if(ran>=0.75){
          that.contMove('y',-that.moveY,true,num)         
        }
      },800)
    },
    makeRob(){
      const that = this
      if(this.crash == false){
        setTimeout(()=>{
          if(that.crash == false){
            that.handleHoldonTime()
          }    
        },5000) //五秒后游戏才开始计时
        let tik = setInterval(()=>{
          if(this.crash == false){
            if(that.crash==true){
              clearInterval(tik)
            }
            that.initPlayer(true)
            that.handleRobMove(that.pcNum-1)            
          }

        },5000) //每五秒出现一个新机器人        
      }
    },
    //是否碰撞算法
    isCrash(){
      let group = this.pc
      group.forEach((item)=>{
        const leftTop = (item.x+this.playerWidth)>=this.playerX&&this.playerX>=item.x&&(item.y+this.playerWidth)>=this.playerY&&this.playerY>=item.y
        const rightTop = (item.x+this.playerWidth)>=(this.playerX+this.playerWidth)&&(this.playerX+this.playerWidth)>=item.x&&(item.y+this.playerWidth)>=this.playerY&&this.playerY>=item.y
        const leftBot = (item.x+this.playerWidth)>=this.playerX&&this.playerX>=item.x&&(item.y+this.playerWidth)>=(this.playerY+this.playerWidth)&&(this.playerY+this.playerHeight)>=item.y
        const rightBot = (item.x+this.playerWidth)>=(this.playerX+this.playerWidth)&&(this.playerX+this.playerWidth)>=item.x&&(item.y+this.playerWidth)>=(this.playerY+this.playerWidth)&&(this.playerY+this.playerHeight)>=item.y
        if(leftTop||rightTop||leftBot||rightBot){
          this.crash = true
        }

      })
    },
    //开始54321倒计时函数
    hanldeStartCount(){
      const that = this
      let tik = setInterval(()=>{
          if(that.crash == true){
            clearInterval(tik)
          }else{
            if(that.startCount == 1){
              clearInterval(tik)
              that.showCount = false
            }
              that.startCount--
          }
      },1000)
    },
    handleHoldonTime(){
      const that = this
      let tik = setInterval(()=>{
        if(that.crash == true)
        {
          clearInterval(tik)
          setTimeout(()=>{
            that.$router.push({path:'/Gameover'})
          },0)

        }else{
          if(that.playerSpeed!=0.5){
            if(that.holdonTime%10==0){
              that.addSpeed()
            }        
          }
          that.holdonTime++          
        }

      },1000)
    },
    leaveSaveData(){
      const that = this
      const storage = window.localStorage
      if(storage.record){
        let record = JSON.parse(storage.getItem('record'))
        record.push(that.holdonTime)
        record = JSON.stringify(record)
        storage.setItem('record',record)
      }else{
        let record = []
        record.push(that.holdonTime)
        record = JSON.stringify(record)
        storage.setItem('record',record)
      }
    },
    //再次检验清除定时器
    securityClearInter(){
      const that = this
      clearInterval(that.timeCir)
      this.robotTimeCir.forEach((item)=>{
        clearInterval(item)
      })

    },

    //兼容移动端
    touchMethods(){
      const that = this
      let startX, startY
      document.addEventListener('touchstart',function (ev) {
        startX = ev.touches[0].pageX
        startY = ev.touches[0].pageY
      }, false)

      document.addEventListener('touchend',function (ev) {
        let endX, endY
        endX = ev.changedTouches[0].pageX
        endY = ev.changedTouches[0].pageY
        var direction = that.GetSlideDirection(startX, startY, endX, endY)
        switch(direction) {
            case 0:
                that.handleMove('u')
                break;
            case 1:
                that.handleMove('d')
                break
            case 2:
                that.handleMove('r')
                break
            case 3:
                that.handleMove('l')
                break
            case 5:
                break

          }
      }, false)
    },
    GetSlideDirection(startX, startY, endX, endY){
      if(Math.abs(endY-startY)>Math.abs(endX-startX)){
        let dy = startY-endY
        if(dy>0){
          return 0  //上滑
        }else if(dy<0){
          return 1 //下滑
        }else{
          return 5  //不动
        }
      }else{
        let dx = startX-endX
        if(dx<0){
          return 2  //右滑
        }else if(dx>0){
          return 3 //左滑
        }else{
          return 5 //不动
        }
      }
    }
  },
  mounted(){
    this.initCanvas()
    this.learnKeyInit()
    this.touchMethods()
    this.handleMove('l')
    this.hanldeStartCount()
    this.makeRob()
  },
  destroyed(){
    this.leaveSaveData()
    this.deleteLearnKey()
    this.securityClearInter()
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .DrawingWrapper
    overflow hidden
    position absolute
    height 100%
    width 100%
    .level
      position absolute
      right 0
      top .73rem
      font-weight bold
    .startCount
      position absolute
      margin-left 3.2rem
      margin-top 5.2rem
      color black
      font-size 2.5rem
    .holdonTime
      position absolute
      right 0
      top .05rem
      font-weight bold
    .robNum
      position absolute
      right 0
      top .4rem
      font-weight bold
    .canvasMain
      background-color grey
      width 100%
      height 100%


</style>
