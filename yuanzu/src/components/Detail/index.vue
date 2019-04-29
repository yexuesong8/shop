<template>
    <div class="container clearfix detail-box">
       <div class="shop-detail">
         <div class="shop-detail-top clearfix">
           <!--放大镜图-->
           <div class="shop-images fl">
             <div class="shop-big-img">
               <vue-magnify
                 :previewImg="img"
                 :zoomImg="img">
                 <img :src="img" alt="">
               </vue-magnify>
             </div>
             <div class="shop-detail-img clearfix">
               <div class="control">
                 <img :src="controlLeft" alt="">
               </div>
               <div class="shop-img-lists">
                 <ul class="clearfix">
                   <li class="shop-img-list"  @mouseenter="changeImg(index)" v-for="(item, index) in imgLists" :key="index">
                     <img :src="item" alt="">
                   </li>
                 </ul>
               </div>
               <div class="control">
                 <img :src="controlRight" alt="">
               </div>
             </div>
           </div>
           <!--右边详细内容 价格-->
           <div class="shop-info">
             <h3 class="">坚果礼盒</h3>
             <!--商品介绍-->
             <div class="summary">
               巴旦木，黑芝麻。高山与田园两只清隽古调
             </div>
             <!--商品价格-->
             <div class="price-box">
               <span>优惠价:</span>
               <span class="price">￥120.00</span>
             </div>
             <!--立即购买-->
             <div class="buy-box">
               <span class="num">数&nbsp;&nbsp;&nbsp;量:</span>
               <div class="number clearfix">
                 <div class="number-left">
                   <input type="text" :value="num">
                 </div>
                 <!--加减数量-->
                 <div class="number-right">
                   <span @click="addNum" class="cancelselect">+</span>
                   <span @click="subNum" class="cancelselect">-</span>
                 </div>
               </div>
               <div class="buy-btn">
                 <button class="btn-buy"><router-link to='/cart'>立即购买</router-link></button>
                 <button class="addCart">加入购物车</button>
               </div>
             </div>
             <!--服务承诺-->
             <div class="chengnuo">
               服务承诺:
               <img :src="ok" alt="">
               精选食材
               <img :src="ok" alt="">
               品质保证
               <img :src="ok" alt="">
               五星服务
               <img :src="ok" alt="">
               贴心宅配
             </div>
             <!--商品编号-->
             <div class="shop-number">
               <span>商品编号:100000310</span>
               <a>
                 <img :src="Love" alt="">
                 收藏</a>
             </div>

           </div>
         </div>
         <!--评价-->
         <div class="product-content">
           <div class="product-tabs">
             <ul class="tabs-list clearfix">
               <li>
                 <a :class="showTabsBtn ? 'active' : ''" @click="isShowBtn1">商品介绍</a>
               </li>
               <li>
                 <a :class="showTabsBtn ? '' : 'active'" @click="isShowBtn2">评价内容</a>
               </li>
             </ul>
             <div class="tabs-content">
               <div class="shop-detail-con" :class="showTabsCon==0 ? 'tabs-con' : ''">
                 <div class="tabs-body">
                   <img :src="imgList" alt="" v-for="(imgList, index) in imgDetail" :key="index">
                 </div>
               </div>
               <div  class="shop-detail-con" :class="showTabsCon==1 ? 'tabs-con' : ''">
                 <div class="pinglun-con">
                   <div class="pinglun">
                     欢迎您第一个发表评论
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
      <!--猜你喜欢-->
       <div class="my-love">
         <div class="my-love-con">
            <h3 class="love-tit">猜你喜欢</h3>
           <ul class="love-lists">
             <li>
               <a>
               <img :src="Love1" alt="">
               </a>
               <em>￥258.00</em>
               <strong> 甜蜜如心鲜奶蛋糕</strong>
             </li>
             <li>
               <a>
                 <img :src="Love2" alt="">
               </a>
               <em>￥258.00</em>
               <strong> 甜蜜如心鲜奶蛋糕</strong>
             </li>
             <li>
               <a>
                 <img :src="Love3" alt="">
               </a>
               <em>￥258.00</em>
               <strong> 甜蜜如心鲜奶蛋糕</strong>
             </li>
             <li>
               <a>
                 <img :src="Love1" alt="">
               </a>
               <em>￥258.00</em>
               <strong> 甜蜜如心鲜奶蛋糕</strong>
             </li>
             <li>
               <a>
                 <img :src="Love2" alt="">
               </a>
               <em>￥258.00</em>
               <strong> 甜蜜如心鲜奶蛋糕</strong>
             </li>
             <li>
               <a>
                 <img :src="Love3" alt="">
               </a>
               <em>￥258.00</em>
               <strong> 甜蜜如心鲜奶蛋糕</strong>
             </li>
           </ul>
         </div>
       </div>
    </div>

</template>
<script>
  import shopImage4 from '@/assets/images/shop4.jpg'
  import shopImage5 from '@/assets/images/shop5.jpg'
  import shopImage6 from '@/assets/images/shop6.jpg'
  import shopImage7 from '@/assets/images/shop7.jpg'
  import controlLeft from '@/assets/images/left.gif'
  import controlRight from '@/assets/images/right.gif'
  import ok from '@/assets/images/ok.gif'
  import Love from '@/assets/images/icon_sc.gif'
  import Love1 from '@/assets/images/love1.jpg'
  import Love2 from '@/assets/images/love2.jpg'
  import Love3 from '@/assets/images/love3.jpg'
  import shopDetail1 from '@/assets/images/shopDetail1.jpg'
  import shopDetail2 from '@/assets/images/shopDetail2.jpg'
  import shopDetail3 from '@/assets/images/shopDetail3.jpg'
  import shopDetail4 from '@/assets/images/shopDetail4.jpg'
  import shopDetail5 from '@/assets/images/shopDetail5.jpg'
  import shopDetail6 from '@/assets/images/shopDetail6.jpg'
  import shopDetail7 from '@/assets/images/shopDetail7.jpg'
  import shopDetail8 from '@/assets/images/shopDetail8.jpg'
  import shopDetail9 from '@/assets/images/shopDetail9.jpg'
  import shopDetail10 from '@/assets/images/shopDetail10.jpg'
  import shopDetail11 from '@/assets/images/shopDetail11.jpg'
  import shopDetail12 from '@/assets/images/shopDetail12.jpg'
  import shopDetail13 from '@/assets/images/shopDetail13.jpg'
  import shopDetail14 from '@/assets/images/shopDetail14.jpg'
export default {
    data () {
        return {
          img: shopImage4,
          ok,
          Love,
          Love1,
          Love2,
          Love3,
          imgLists: [shopImage4, shopImage5, shopImage6, shopImage7],
          imgDetail: [shopDetail1, shopDetail2, shopDetail3, shopDetail4, shopDetail5, shopDetail6, shopDetail7, shopDetail8, shopDetail9, shopDetail10, shopDetail11, shopDetail12, shopDetail13, shopDetail14],
          controlLeft,
          controlRight,
          num: 1,
          showTabsBtn: true,
          showTabsCon: 0
        }
    },
  methods: {
    changeImg (index) {
      this.img = this.imgLists[index]
    },
    addNum () {
      this.num++
    },
    subNum () {
      if (this.num > 0) {
        this.num--
      } else {
        this.num = 0
      }
    },
    isShowBtn1 () {
      this.showTabsBtn = !this.showTabsBtn
      this.showTabsCon = 0
    },
    isShowBtn2 () {
      this.showTabsBtn = !this.showTabsBtn
      this.showTabsCon = 1
    }
  }
}
</script>
<style lang="less" scoped="">
  @import '~@/assets/css/common.less';
  .detail-box{
    margin-top: 30px;
  }
  .cancelselect{
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
  }
  /*左边内容*/
  .shop-detail{
    width: 990px;
    float: left;
  }
  /*商品左边大图*/
  .shop-big-img{
    width: 450px;
    height: 450px;
    margin-right:30px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  /*左右移动图片*/
  .control{
    float: left;
    margin-top:20px;
  }
  .shop-img-lists{
    float: left;
    width: 420px;
    padding:0 10px;
    margin-top:20px;
  }
  .shop-img-list{
    float: left;
    width: 84px;
    img{
      width: 62px;
      height: 62px;
      display: inline-block;
    }
  }
  /*右边价格等详细内容*/
  .shop-info{
    width: 428px;
    float: right;
    margin-right:50px;
    h3{
      font-weight: normal;
      font-size:16px;
      overflow: hidden;
      height: 25px;
      line-height: 25px;
    }
    .summary{
      font-size:14px;
      color: #959595;
      margin-bottom:15px;
    }
    .price-box{
      margin-bottom: 15px;
      color: #959595;
      font-size:14px;
      height: 30px;
      line-height: 30px;
      .price{
        color: @weight-color;
        font-size:24px;
        font-weight:700;
      }
    }
  }
  /*数量*/
  .buy-box{
    height: 40px;
    margin-bottom: 20px;
    vertical-align: middle;
    padding-bottom: 2px;
    .num{
      font-size:14px;
      line-height: 25px;
      color: #959595;
    }
  }
  .number{
    display: inline-block;
    height: 38px;
    line-height: 38px;
    vertical-align: middle;
    .number-left{
      float: left;
      width: 45px;
      height: 36px;
      text-align: center;
      border:1px solid #ddd;
      input{
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        display: block;
        text-align: center;
      }
    }
    .number-right{
      float: left;
      height: 36px;
      span{
        display: block;
        width: 15px;
        height: 50%;
        border-bottom: 1px solid #ddd;
        border-right: 1px solid #ddd;
        line-height: 18px;
        text-align: center;
        cursor: pointer;
        font-size:14px;
      }
      span:nth-child(1){
        border-top:1px solid #ddd;
      }
    }
  }
  /*加入购物车*/
  .buy-btn{
    display: inline-block;
    line-height: 40px;
    vertical-align: middle;
    button{
      height: 38px;
      font-size:20px;
      width: 150px;
      border: 0;
      outline: 0;
      margin-left: 24px;
      cursor: pointer;
    }
    .addCart{
      color: #fff;
      background: @weight-color;
      &:hover{
        background: @main-color;
      }
    }
    .btn-buy{
      background-color: #feedf3;
      color: @main-color;
      width: 110px;
      border:1px solid @main-color;
      &:hover{
        color: @weight-color;
      }
    }
  }
  /*承诺*/
  .chengnuo{
    padding: 0 12px;
    line-height: 29px;
    color: #5a5a58;
    margin-bottom: 21px;
    background-color: #f7f3e8;
    font-size:12px;
    text-align: center;
  }
  /*编号*/
  .shop-number{
    font-size:12px;
    vertical-align: middle;
    height: 25px;
    line-height: 25px;
    span{
      margin-right:30px;
    }
    a{
      vertical-align: middle;
      display: inline-block;
      height: 25px;
      img{
        vertical-align: -4px;
      }
    }
  }

  /*评价内容*/
  .product-content{
    width: 990px;
    margin-top:30px;
    .product-tabs{
      .tabs-list{
        width: 100%;
        background: #999999;
        li{
          float: left;
          a{
            width: 150px;
            height: 30px;
            display: inline-block;
            text-align: center;
            line-height: 30px;
            font-size:14px;
            color: #fff;
            &.active{
              background: #b6ab8f;
            }
          }
        }
      }
    }
  }
  .tabs-content{
    .shop-detail-con{
      display: none;
    }
  }
  .tabs-con{
    display: block !important;
  }
  .tabs-body{
    width: 920px;
    margin:0 auto;
    padding: 20px 0;
    img{
      max-width: 920px;
      display: block;
      margin:0 auto;
    }
  }
  .pinglun-con{
    width: 920px;
    margin: 0 auto;
  }
  .pinglun{
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #a5a5a5;
    margin:30px 0;
    font-size:14px;
    color: #a5a5a5;
  }
  /*猜你喜欢*/
  .my-love{
    width: 190px;
    float: right;
    background: #fff;
  }
  .love-tit{
    height: 30px;
    line-height: 30px;
    padding:0 13px;
    background: @main-color;
    margin-bottom: 10px;
    color: #fff;
    font-size:14px;
  }
  .love-lists{
    width: 170px;
    margin: 0 auto;
    li{
      width: 170px;
      margin-bottom: 10px;
      a{
        img{
          width: 170px;
          height: 170px;
          display: block;
        }
      }
      em{
        display: block;
        text-align: right;
        font-style: normal;
        color: @weight-color;
        height: 27px;
        line-height: 27px;
        font-weight: 600;
        font-size: 12px;
      }
      strong{
        height: 36px;
        line-height: 18px;
        font-size: 12px;
        font-weight: normal;
      }
    }
  }

</style>
