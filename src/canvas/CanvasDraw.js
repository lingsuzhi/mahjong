export default function CanvasDraw(canvas2d) {
  let me = this;
  let ctx = canvas2d;

  let style = {
    strokeStyle: '#666666',
    lineWidth: 2,
    fillStyle: "#ffEEdd",
    fontStyle: '#303133',
    focusStyle: '#67C23A',
    lineHeight: 24,
    lineDash: []
  }

  me.rect = function (rect, color, lineWidth) {
    if (color) {
      ctx.strokeStyle = color;
    } else {
      ctx.strokeStyle = style.strokeStyle;
    }
    if (lineWidth) {
      ctx.lineWidth = lineWidth;
    } else {
      ctx.lineWidth = style.lineWidth;
    }
    ctx.setLineDash(style.lineDash)
    ctx.strokeRect(rect.left, rect.top, rect.wid, rect.hei);
  }

  me.rectByLineDash = function (rect, lineDash) {
    let oldDash = style.lineDash;
    style.lineDash = lineDash;
    me.rect(rect)
    style.lineDash = oldDash;
  }

  //填充矩形
  me.fullRect = function (rect) {
    ctx.fillStyle = style.fillStyle;
    ctx.fillRect(rect.left, rect.top, rect.wid, rect.hei);
  };

  me.text = function (text, x, y) {
    if (text) {
      txtInit();
      ctx.fillText(text, x, y);
    }
  };
  //画标签
  me.drawLabel = function (obj) {
    //图片
    if (obj.img) {
      if (obj.imgRect) {
        ctx.drawImage(obj.img, obj.imgRect.left , obj.imgRect.top, obj.imgRect.wid  , obj.imgRect.hei ,
          obj.left, obj.top, obj.imgRect.cWid, obj.imgRect.cHei,)
      } else {
        ctx.drawImage(obj.img, obj.left, obj.top)
      }
    }
    //文本
    if (obj.text) {
      ctx.fillStyle = obj.font.color;
      ctx.font = me.fontToStr(obj.font);
      me.textByRect(obj.text, obj, obj.align);
    }
    //边框
    if (obj.border > 0) {
      me.rect(obj, undefined, obj.border)
    }
  };

  me.fontToStr = function (font) {
    let str = font.fontSize;
    if (font.fontWeight == '粗体') {
      str += " " + "bold"
    }
    str += " " + font.fontFamily;
    return str;
  };

  me.textByRect = function (text, rect, align) {
    if (text) {
      let x = rect.left + (rect.wid / 2);
      let y = (rect.hei) / 2 + rect.top + 5;
      switch (align) {
        case "左对齐":
          ctx.textAlign = 'left';
          x = rect.left + 2
          break
        case "居中":
          ctx.textAlign = 'center';
          break;

        case "右对齐":
          ctx.textAlign = 'right';
          x = rect.left + rect.wid - 2;
          break;
      }

      ctx.fillText(me.findmaxStr(text, rect.wid), x, y);
    }
  }

  me.display = function (obj) {
    if (!obj || !obj.type) {
      return
    }
    switch (obj.type) {
      case "标签":
        me.drawLabel(obj)
        break;
      case "表格":
        me.text(obj.text, obj.left, obj.top)

        break;
    }

    if (obj.focus) {
      me.rect(obj, style.focusStyle)
    }
  }

  function txtInit() {
    ctx.fillStyle = "#333333";
    ctx.font = "16px 宋体";
    ctx.textAlign = 'left';
  }

  me.findmaxStr = function (text, maxWidth) {
    let arrText = text.split('');
    let line = '';

    for (let n = 0; n < arrText.length; n++) {
      let testLine = line + arrText[n];
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth) {
        return line;
      } else {
        line = testLine;
      }

    }
    return text;
  }
  //自动换行
  me.wrapText = function (text, x, y, maxWidth) {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
      return;
    }
    txtInit();
    if (typeof maxWidth == 'undefined') {
      maxWidth = 180;
    }
    // 字符分隔为数组
    let arrText = text.split('');
    let line = '';

    for (let n = 0; n < arrText.length; n++) {
      let testLine = line + arrText[n];
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth) {
        ctx.fillText(line, x, y);
        line = arrText[n];
        y += style.lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };
}
