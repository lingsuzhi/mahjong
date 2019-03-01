<template>
  <!--<div style="height: 100%;width: 100%;margin: 0;padding: 0;">-->
    <!--<canvas id="myCanvas" style=" height: 100%;width: 100%;margin: 0;padding: 0;"></canvas>-->
  <!--</div>-->
  <canvas id="myCanvas" tabindex="1110" :width="getWid()" :height="getHei()" style="padding: 0;" @keyup.f4 = keyTest>
    你的浏览器不支持canvas
  </canvas>
</template>

<script>
  import MajCanvas from "./MajCanvas"

  let data = () => {
    return {
      maj:null
    }
  }
  export default {
    data: data,
    name: "Main",
    methods:{
      getWid(){
        return document.documentElement.clientWidth;
      },
      getHei(){
        return document.documentElement.clientHeight;
      },
      keyTest(){
        this.maj.keyTest();
      }
    },
    mounted: function () {
      this.maj = new MajCanvas('myCanvas');
      // let me = this;
      // window.onorientationchange=function(){
      //   let canvansDom = document.getElementById("myCanvas");
      //   // if(window.orientation==90||window.orientation==-90){
      //   //    alert('横屏了');
      //   //
      //   // }else{
      //   //
      //   //   alert('没有横屏');
      //   // }
      //   canvansDom.width = me.getWid() + "px";
      //   canvansDom.height = me.getHei() + "px";
      // }

    },
  }
</script>

<style scoped>
  canvas:focus {
    outline: none
  }

</style>
