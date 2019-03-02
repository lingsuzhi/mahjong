import {newCtx, posToRect, posInRect} from "./CanvasUtil"
import CanvasDraw from "./CanvasDraw"

export default function LszCanvas(canvasId) {
  let me = this;
  me.objArr = [];
  me.canvansDom = document.getElementById(canvasId);

  me.mouseRectDrawB = true;
  me.width = me.canvansDom.clientWidth;
  me.height = me.canvansDom.clientHeight;
  if (me.width < me.height) {
    me.rotateWid = me.height;
    me.height = me.width;
    me.width = me.rotateWid;
  }
  me.refreshHook = null;
  me.ctx = me.canvansDom.getContext("2d");
  me.buff = newCtx(me.width, me.height);
  if (me.rotateWid) {
    me.ctx.translate(me.width, me.height)
    me.ctx.rotate(270 * Math.PI / 180)
    me.ctx.translate(me.height - me.width, -me.width)
  }

  // //焦点变更回调
  me.focusChangeFun = null;
  //输入框
  me.inputBox = null;

  let draw = new CanvasDraw(me.buff);

  me.mouseRect = {
    type: '',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    moveObj: {
      offX: 0,
      offY: 0,
      obj: null,
      oldLeft: 0,
      oldTop: 0
    },
    getRect: function () {
      return posToRect(this.x1, this.y1, this.x2, this.y2);
    }
  };

  me.setType = function (type) {
    me.mouseRect.type = type;
  };

  me.refresh = function () {
//    me.buff.clearRect(0, 0, me.width, me.height);

//加个背景色
    me.buff.fillStyle = "#ffffbf";
    me.buff.fillRect(0, 0, me.width, me.height);
    if (me.refreshHook) {
      me.refreshHook.refresh();
    }
    me.refreshEx(me.objArr);
    if (me.mouseRectDrawB) {
      me.mouseRectDraw();
    }

    let imgData = me.buff.getImageData(0, 0, me.width, me.height);
    if (me.rotateWid) {
      createImageBitmap(imgData).then(img => {
        me.ctx.drawImage(img, 0, 0)
      });
    } else {
      me.ctx.putImageData(imgData, 0, 0);
    }
  };

  //鼠标矩形
  me.mouseRectDraw = function () {
    if (me.mouseRect.type) {
      switch (me.mouseRect.type) {
        case 'mouse':
          draw.rectByLineDash(me.mouseRect.getRect(), [4, 6]);
          break;
        case 'move':

          break;
        default:
          let rect = {
            left: me.mouseRect.x2 - 50,
            top: me.mouseRect.y2 - 15,
            wid: 100,
            hei: 30
          };
          draw.textByRect(me.mouseRect.type, rect);
          draw.rect(rect);
          break
      }
    }

  };
  me.findObjById = function (id) {
    for (let obj of me.objArr) {
      if (obj.id === id) {
        return obj;
      }
    }
  };
  me.selectObjById = function (id) {
    if (!id) {
      return
    }
    let obj = me.findObjById(id);
    if (obj.focus !== true) {
      me.selectObj(obj);

    }
  };
  me.selectObjByPos = function (x, y) {

    let obj = me.findFocusByPos(x, y);
    me.selectObj(obj);
  };
  me.selectObj = function (focusObj) {
    for (let obj of me.objArr) {
      obj.focus = false;
    }
    if (focusObj) {
      focusObj.focus = true;
    }
    //为Null 也要掉用
    if (me.focusChangeFun) {
      me.focusChangeFun(focusObj);
    }
    me.refresh()
  };

  me.findFocusByPos = function (x, y) {
    for (let obj of me.objArr) {
      if (posInRect(x, y, obj)) {
        return obj;
      }
    }
  };

  function getNewId() {
    if (me.objArr.length === 0) {
      return 1;
    }
    let max = 1;
    for (let obj of me.objArr) {
      if (obj.id > max) {
        max = obj.id;
      }
    }
    return max + 1;
  }

  me.pushImgObj = function (type, rect, text, img, imgRect) {
    let obj = {
      type: type,
      left: rect.left,
      top: rect.top,
      wid: rect.wid,
      hei: rect.hei,
      align: "居中",
      text: text,
      img: img,
      imgRect: imgRect,
      font: {
        fontFamily: '宋体',
        fontSize: '16px',
        color: '#333333',
        fontWeight: '常规',   // 粗体
      },
      focus: false,
      border: 0,
      id: getNewId(),
    };
    me.objArr.push(obj);
    return obj;
  }
  me.pushObj = function (mouseRect) {
    let rect = {
      left: mouseRect.x2 - 50,
      top: mouseRect.y2 - 15,
      wid: 100,
      hei: 30
    };
    let obj = {
      type: mouseRect.type,
      left: rect.left,
      top: rect.top,
      wid: rect.wid,
      hei: rect.hei,
      align: "居中",
      text: mouseRect.type,
      font: {
        fontFamily: '宋体',
        fontSize: '16px',
        color: '#333333',
        fontWeight: '常规',   // 粗体
      },
      focus: false,
      border: 0,
      id: getNewId(),
    };
    me.objArr.push(obj);
    return obj;
  };

  me.refreshEx = function (arr) {
    for (let obj of arr) {
      draw.display(obj)
    }
  };

  me.findFocus = function () {
    for (let obj of me.objArr) {
      if (obj.focus) {
        return obj;
      }
    }
  };

  me.canvansDom.onkeydown = function (e) {
    let focusObj = null;
    let focusIndex = -1;
    for (let index in me.objArr) {
      let obj = me.objArr[index];

      if (obj.focus) {
        focusObj = obj;
        focusIndex = index;
      }
    }

    switch (e.key) {
      case 'Delete':
        if (focusObj) {
          me.objArr.splice(focusIndex, 1);
        }
        break;
      case 'ArrowRight':
        if (focusObj) {
          focusObj.wid = focusObj.wid + 5;
        }
        break;
      case 'ArrowLeft':
        if (focusObj) {
          if (focusObj.wid > 5) {
            focusObj.wid = focusObj.wid - 5;
          }
        }
        break;
      case 'ArrowUp':
        if (focusObj) {
          focusObj.hei = focusObj.hei + 5;
        }
        break;
      case 'ArrowDown':
        if (focusObj) {
          if (focusObj.hei > 5) {
            focusObj.hei = focusObj.hei - 5;
          }
        }
        break;
      default:
        return;
    }
    me.refresh()
  };


  me.canvansDom.onmousedown = function (e) {
    let x = e.offsetX;
    let y = e.offsetY;
    if (e.buttons === 1) {
      //左键
      let obj = me.findFocus();
      if (obj && posInRect(x, y, obj)) {
        me.mouseRect.type = 'move';
        me.mouseRect.moveObj.obj = obj;

        me.mouseRect.moveObj.offX = x - obj.left;
        me.mouseRect.moveObj.offY = y - obj.top;
        me.mouseRect.moveObj.oldLeft = obj.left;
        me.mouseRect.moveObj.oldTop = obj.top;

        if (me.mouseRect.moveObj.offX < 0 || me.mouseRect.moveObj.offY < 0 || me.mouseRect.moveObj.offY > obj.hei || me.mouseRect.moveObj.offX > obj.wid) {
          me.mouseRect.type = '';
        }
      } else {
        me.mouseRect.type = 'mouse';
        me.mouseRect.x1 = x;
        me.mouseRect.y1 = y;

        me.mouseRect.x2 = me.mouseRect.x1;
        me.mouseRect.y2 = me.mouseRect.y1;

      }

    }
  };

  me.canvansDom.ondblclick = function () {
    // let x = e.offsetX;
    // let y = e.offsetY;
    let obj = me.findFocus();
    if (obj) {
      me.inputBox(obj);
    }
  };

  me.canvansDom.onmousemove = function (e) {
    let x = e.offsetX;
    let y = e.offsetY;
    if (e.buttons === 1) {
      //左键
      me.mouseRect.x2 = x;
      me.mouseRect.y2 = y;
      if (me.mouseRect.type) {
        switch (me.mouseRect.type) {
          case 'mouse':

            break;
          case 'move':

            me.mouseRect.moveObj.obj.left = x - me.mouseRect.moveObj.offX;
            me.mouseRect.moveObj.obj.top = y - me.mouseRect.moveObj.offY;
            break;
        }
      }
    }
    me.refresh();
  };

  me.canvansDom.onmouseup = function (e) {
    let x = e.offsetX;
    let y = e.offsetY;

    //左键
    if (me.mouseRect.type) {
      switch (me.mouseRect.type) {
        case 'mouse':
          me.selectObjByPos(x, y);


          break;
        case 'move':

          break;
        default:
          me.pushObj(me.mouseRect);
      }


      me.mouseRect.type = '';
    } else {

    }
    me.refresh();
  };
}
