export default class MajMain {


  constructor(majCanvas) {
    this.data = {
      top:{
        // 牌的总数 length
        // 打过的牌
        // 吃牌
        // 碰牌
        // 杠牌
        // 激活状态
      },
      left:{},
      right:{},
      my:{
        mayArr:[],//手上的牌
      }

    };
    this.MajCanvas = majCanvas;
  }
  getMyMajArr(){
    return  this.data.my.majArr.sort((a,b)=>a-b);
  }
  start() {
    //0-33
    this.data.top.length = 13;
    this.data.left.length = 13;
    this.data.right.length = 13;
    this.data.my.length = 13;

    this.data.my.majArr = [
      2, 5, 7,
      8, 9, 15,
      3, 19, 20
      , 24, 25, 29
      , 32
    ];
  }
}
