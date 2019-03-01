import LszCanvas from "@/canvas/LszCanvas"
import {newCtx} from "../../canvas/CanvasUtil";
import MajMain from "./MajMain"

export default class MajCanvas {
  constructor(canvasId) {
    this.wid = 1200;
    this.hei = 1200;
    this.buff = newCtx(this.wid, this.hei);
    this.canvas = new LszCanvas(canvasId);
    this.majPic = {};
    this.majPicOther = {
      left: {},
      top: {},
      right: {}
    };
    //没打的牌
    this.majPicNoPaly = {
      doubleTop: {},
      doubleLeft: {},
      top: {},
      left: {}

    };
    this.initImg();
    this.cardCount = 43;//总共43个牌
    this.majMain = new MajMain(this);
    // this.canvas.pushImgObj( "标签",{left:50,
    // top:50,
    //   wid:this.majPic.wan[5].width,
    //   hei:this.majPic.wan[5].height
    // },'',this.majPic.wan[5])
    //
    this.canvas.refreshHook = this;
    this.canvas.mouseRectDrawB = false;
    this.majMain.start();
  };

  refresh() {
    this.canvas.objArr = [];
    //手上的牌
    this.drawMyMajArr(this.majMain.getMyMajArr());
    this.drawTop(this.majMain.data.top);
    this.drawLeft(this.majMain.data.left);
    this.drawRight(this.majMain.data.right);

    this.drawNoPlay();
    // this.canvas.pushImgObj("标签", {
    //     left: 10,
    //     top: 10,
    //     wid: 200,
    //     hei: 200
    //   },
    //   this.canvas.width + "--" + this.canvas.height)
  }

  pushMaj(left, top, img, imgRect) {

    this.canvas.pushImgObj("标签", {
        left: left,
        top: top,
        wid: img.width,
        hei: img.height

      },
      '', img, imgRect)
  }
  getTopPos(){
    let img = this.majPicOther.top;
    let left = (this.canvas.width - img.width * 13) / 2;
    let cardHei = img.height;
    let top = (this.canvas.height - cardHei) * 0.08;
    return [left,top];
  }
  getLeftPos(){
    let img = this.majPicOther.left;
    let left = (this.canvas.width - img.width) * 0.08;
    let cardHei = img.height - 26;
    let top = (this.canvas.height - cardHei * 15) / 2

    return [left,top];
  }
  drawTop(topData) {
    let img = this.majPicOther.top;
  //  let left = (this.canvas.width - img.width * 13) / 2;
    let cardHei = img.height;
//    let top = (this.canvas.height - cardHei) * 0.08;
    let [left,top] = this.getTopPos();

    if (topData && topData.length) {
      for (let i = 0; i < topData.length; i++) {
        this.pushMaj(left, top, img);
        left += img.width;

      }
    }

  }

  drawLeft(leftData) {
    let img = this.majPicOther.left;
    // let left = (this.canvas.width - img.width) * 0.08;
    let cardHei = img.height - 26;
    // let top = (this.canvas.height - cardHei * 15) / 2
    let [left,top] = this.getLeftPos();
    if (leftData && leftData.length) {
      for (let i = 0; i < leftData.length; i++) {
        this.pushMaj(left, top, img);
        top += cardHei;

      }
    }
  }

  drawRight(rightData) {
    let img = this.majPicOther.right;


    let left = (this.canvas.width - img.width) * 0.92;
    let cardHei = img.height - 24;
    let top = (this.canvas.height - cardHei * 15) / 2

    if (rightData && rightData.length) {
      for (let i = 0; i < rightData.length; i++) {
        this.pushMaj(left, top, img);
        top += cardHei;

      }
    }
  }

  drawNoPlay() {
    let count = 83;
    let type = "top";
    let dice = 3;

    // this.drawNoPlayTop(34);
    // this.drawNoPlayLeft(34);
  }

  drawNoPlayTop(count,endOne){
    if (count > 0){
      let [left,top] = this.getTopPos();
      let img = this.majPicNoPaly.doubleTop;

      let wid = img.width;
      let hei =img.height;
      top += (hei*1.5);
      left += wid * 2;
      for (let i = 0 ;i<count;i+=2) {

        this.pushMaj(left, top, img);

        left += wid;
      }
    }
  }
  drawNoPlayLeft(count,endOne){
    if (count > 0){
      let [left,top] = this.getLeftPos();
      let img = this.majPicNoPaly.doubleLeft;

      let wid = img.width;
      let hei =img.height-18;
      top += (hei*1.5);
      left += wid * 2;
      for (let i = 0 ;i<count;i+=2) {

        this.pushMaj(left, top, img);

        top += hei;
      }
    }
  }
  drawMyMajArr(myMajArr) {
    if (myMajArr && myMajArr.length > 0) {
      let img = this.majPic.cardUserBottom;
      let top = this.canvas.height - img.height - (this.canvas.height * 0.07);
      let cardWid = img.width / this.cardCount;   //图片里面有43张牌

      let wid = cardWid;
      let hei = img.height;
      if (this.canvas.width < cardWid * 15) {
        //太小 要缩放图片
        wid = this.canvas.width / 15;
        hei = wid / cardWid * hei;
      }
      let left = (this.canvas.width - (wid * 14)) / 2;
      for (let maj of myMajArr) {

        this.pushMaj(left, top, img, {
          left: maj * cardWid,
          top: 0,
          wid: cardWid + 1,
          hei: img.height,
          cWid: wid,
          cHei: hei
        });

        left += wid;
      }
    }
  }

  keyTest() {


    let imgData = this.buff.getImageData(0, 0, this.wid, this.wid);
    this.canvas.ctx.putImageData(imgData, 0, 0);
  };

  initImg() {

    // let bigPic = loadImg("/static/img/allMj.png");
    this.majPicOther.left = loadImg("/static/img/" + "whPic/" + "CARD_USER_LEFT" + ".png");
    this.majPicOther.right = loadImg("/static/img/" + "whPic/" + "CARD_USER_RIGHT" + ".png");
    this.majPicOther.top = loadImg("/static/img/" + "whPic/" + "CARD_USER_TOP" + ".png");

    this.majPicNoPaly.doubleLeft = loadImg("/static/img/" + "whPic/" + "doubleLeft" + ".png");
    this.majPicNoPaly.doubleTop = loadImg("/static/img/" + "whPic/" + "doubleTop" + ".png");
    this.majPicNoPaly.left = loadImg("/static/img/" + "whPic/" + "left" + ".png");
    this.majPicNoPaly.top = loadImg("/static/img/" + "whPic/" + "top" + ".png");

    this.majPic.cardUserBottom = loadImg("/static/img/" + "mjBig/" + "CARD_USER_BOTTOM" + ".png");
    this.majPic.cardTableBottom = loadImg("/static/img/" + "mjBig/" + "CARD_TABLE_BOTTOM" + ".png");
    this.majPic.cardTableTop = loadImg("/static/img/" + "mjBig/" + "CARD_TABLE_TOP" + ".png");
    this.majPic.cardTableLeft = loadImg("/static/img/" + "mjBig/" + "CARD_TABLE_LEFT" + ".png");
    this.majPic.cardTableRight = loadImg("/static/img/" + "mjBig/" + "CARD_TABLE_RIGHT" + ".png");


  }

}

function loadImg(src) {
  let img = new Image();
  img.src = src;
  // img.onload = function () {
  //   console.log("加载完毕", src)
  // }

  return img;
}
