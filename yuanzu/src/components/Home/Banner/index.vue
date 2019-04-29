<template>
    <div class="container">
    <!-- banner轮播图 -->
 <div class="block">
    <el-carousel height="400px">
      <el-carousel-item v-for="(item, index) in imgLists" :key="index">
        <img :src="item">
      </el-carousel-item>
    </el-carousel>
  </div>
  <!-- 新品Hot -->
  <div class="hot clearfix">
      <div class="tabs">
        <ul class="tab-lists">
        <li v-for="(item,index) in tabs" class="tab-list-btn" :key='index' :class="{active:index == num}" @mouseenter="tab(index)">
            <a>{{item}}</a>
            <span></span>
            </li>
        </ul>
        <div class="tab-cons">
            <div v-show="0 == num" class="tab-con">
                <ul class="tab-con-lists clearfix">
                    <li>
                        <router-link to='/detail/1'>
                            <img :src="TabImg1">
                        </router-link>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg1">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg1">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg1">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                </ul>
            </div>
            <div v-show="1 == num" class="tab-con">
                <ul class="tab-con-lists clearfix">
                    <li>
                        <a>
                            <img :src="TabImg2">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg2">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg2">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg2">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                </ul>
            </div>
            <div v-show="2 == num" class="tab-con">
                <ul class="tab-con-lists clearfix">
                    <li>
                        <a>
                            <img :src="TabImg3">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg3">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg3">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg3">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                </ul>
            </div>
            <div v-show="3 == num" class="tab-con">
                <ul class="tab-con-lists clearfix">
                    <li>
                        <a>
                            <img :src="TabImg4">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg4">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg4">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                    <li>
                        <a>
                            <img :src="TabImg4">
                        </a>
                        <strong>8号恋艾初茶慕思蛋糕</strong>
                        <em>￥998</em>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="tabs-ad">
        <a>
            <img :src="TabImg5" alt="">
        </a>
    </div>
  </div>
  <!-- 商品展示1 -->
  <div class="block shop clearfix">
      <h3 class="shop-title">
          <img :src="icon1" alt="">
          MUCH蛋糕
      </h3>
      <div class="shop-img">
              <img :src="shop1" alt="">
              <span class="guang"></span>
      </div>
      <ul class="shop-lists">
          <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
          <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
              <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
      </ul>
  </div>
   <!-- 商品展示2 -->
  <div class="block shop clearfix">
      <h3 class="shop-title">
          <img :src="icon2" alt="">
          元祖礼盒
      </h3>
      <div class="shop-img">
              <img :src="shop2" alt="">
              <span class="guang"></span>
      </div>
      <ul class="shop-lists">
          <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
          <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
              <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
      </ul>
  </div>
   <!-- 商品展示3 -->
  <div class="block shop clearfix">
      <h3 class="shop-title">
          <img :src="icon3" alt="">
          精致西点
      </h3>
      <div class="shop-img">
              <img :src="shop3" alt="">
              <span class="guang"></span>
      </div>
      <ul class="shop-lists">
          <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
          <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
              <li>
              <a>
                  <img :src="TabImg1" alt="">
                  <strong>朵朵咖啡鲜奶蛋糕 </strong>
                  <span> 朵朵咖啡，悦享品质</span>
                  <em>￥999</em>
              </a>
              </li>
      </ul>
  </div>
  <div class="activity">
      <h3 class="shop-title">精选活动</h3>
      <ul class="clearfix">
          <li>
              <a>
                  <img :src="activity1" alt="">
              </a>
          </li>
          <li>
              <a>
                  <img :src="activity2" alt="">
              </a>
          </li>
          <li>
              <a>
                  <img :src="activity3" alt="">
              </a>
          </li>
      </ul>
      </div>
    </div>
</template>
<script>
import Image1 from '@/assets/images/banner1.jpg'
import Image2 from '@/assets/images/banner2.jpg'
import Image3 from '@/assets/images/banner3.jpg'
import Image4 from '@/assets/images/banner4.jpg'
import Image5 from '@/assets/images/banner5.jpg'
import TabImg1 from '@/assets/images/1.jpg'
import TabImg2 from '@/assets/images/2.jpg'
import TabImg3 from '@/assets/images/3.jpg'
import TabImg4 from '@/assets/images/4.jpg'
import TabImg5 from '@/assets/images/5.jpg'
import icon1 from '@/assets/images/submenu4.png'
import icon2 from '@/assets/images/submenu5.png'
import icon3 from '@/assets/images/submenu6.png'
import shop1 from '@/assets/images/shop1.jpg'
import shop2 from '@/assets/images/shop2.jpg'
import shop3 from '@/assets/images/shop3.jpg'
import activity1 from '@/assets/images/activity1.jpg'
import activity2 from '@/assets/images/activity2.jpg'
import activity3 from '@/assets/images/activity3.jpg'
export default {
    data () {
        return {
            imgLists: [Image1, Image2, Image3, Image4, Image5],
                tabs: ['元祖新品', '热销推荐', '节庆民俗', '元祖卡券'],
                num: 0,
                TabImg1,
                TabImg2,
                TabImg3,
                TabImg4,
                TabImg5,
                icon1,
                icon2,
                icon3,
                shop1,
                shop2,
                shop3,
                activity1,
                activity2,
                activity3
        }
    },
    methods: {
        tab (index) {
            this.num = index
        }
    }
}
</script>
<style lang='less' scoped>
@import '~@/assets/css/common.less';
body{
    background-color: #f9f9f9;
}
.hot{
    margin-top: 20px;
}
.tabs{
    float: left;
    .tab-lists{
        margin-bottom: 10px;
        .tab-list-btn{
        display: inline-block;
        cursor: pointer;
        height: 54px;
        line-height: 54px;
        padding: 0 80px;
        border-bottom: 3px solid #000;
        position: relative;
        &.active{
            border-bottom: 3px solid @main-color;
        }
        &.active span{
           width: 0;
           height: 0;
           border-top: 10px solid transparent;
           border-right: 10px solid transparent;
           border-left: 10px solid transparent;
           border-bottom: 10px solid @main-color;
           position: absolute;
           top: 32px;
           left: 50%;
           margin-left: -5px;
           display: inline-block;
        }
  }
    }
}
// tab内容
.tab-con-lists{
    width: 100%;
    li{
        float: left;
        width: 25%;
        height: 258px;
        padding: 13px 18px 5px;
        background-color: #fff;
        text-align: center;
        box-sizing: border-box;
        border: 1px solid #fff;
        &:hover{
            border: 1px solid #c8c8c8;
            box-shadow: 0 0 4px #ccc;
        }
        a{
            width: 185px;
            height: 185px;
            display: block;
            img{
                width: 100%;
                height: 100%;
            }
        }
        strong{
            height: 30px;
            line-height: 30px;
            overflow: hidden;
            display: block;
        }
        em{
            color: @weight-color;
            font-weight: 600;
            font-style:normal;
        }
    }
}
// hot广告
.tabs-ad{
    float: right;
    a{
        display: block;
        width: 100%;
        margin-top: 18px;
    }
}
// 商品展示区
.shop-title{
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    font-size: 18px;
    color: #6b6b6b;
    font-weight: 500;
    border-bottom: 2px solid @main-color;
    margin-top: 20px;
}
.shop{
    .shop-img{
        float: left;
        width: 316px;
        height: 367px;
        overflow: hidden;
        position: relative;
        &:hover{
                .guang{
                    animation: guang 1.5s;
                }
            }
        img{
            width: 100%;
            height: 100%;
        }
        .guang{
            width: 317px;
            height: 368px;
            position: absolute;
            display: inline-block;
            top: -50%;
            left: -50%;
            background: url('../../../assets/images/guang.png')no-repeat;
        }
    }
    .shop-lists{
        float: left;
        li{
            width: 288px;
            height: 367px;
            float: left;
            padding: 20px 20px 0;
            text-align: center;
            border: 1px solid #fff;
            &:hover{
                border: 1px solid #eee;
            }
            img{
                width: 180px;
                height: 180px;
                display: block;
                margin: 50px auto 10px auto;
                transition: all 1s;
                &:hover{
                    transform: scale(1.25)
                }
            }
            strong{
                display: block;
                font-size: 18px;
                overflow: hidden;
                margin-top: 24px;
            }
            span{
                display: block;
                font-size: 12px;
                overflow: hidden;
                height: 19px;
                line-height: 19px;
            }
            em{
                color: @main-color;
                font-weight: 600;
                font-style:normal;
                height: 28px;
                line-height: 28px;
                overflow: hidden;
            }
        }
    }
}
// 精选活动
.activity{
    .shop-title{
        border: none;
    }
    li{
        float: left;
        margin-right: 20px;
    }
}
@keyframes guang {
    0%{
      left: -50%;
      top: -50%;
    }
    100%{
       left: 90%;
       top: 90%;
    }
}
</style>
