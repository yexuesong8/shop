<template>
   <div>
       <div class="top-nav-box">
       <!-- 顶部导航 -->
        <div class="container clearfix">
        <ul class="top-nav-lists fl clearfix">
            <li class="top-nav-list">
                <a>
                <img class="nav-list-img" :src="Phone" alt="微商城">
                <span class="nav-list-tit">微商城</span>
                </a>
            </li>
            <li class="top-nav-list">
                <a>
                <img class="nav-list-img" :src="Sina" alt="微商城">
                <span class="nav-list-tit">官方微博</span>
                </a>
            </li>
            <li class="top-nav-list">
                <a>
                <img class="nav-list-img" :src="Tw" alt="微商城">
                <span class="nav-list-tit">台湾元祖</span>
                </a>
            </li>
        </ul>
        <ul class="fr top-nav-lists clearfix">
            <li class="top-nav-list"><a>登录/注册</a></li>
            <li class="top-nav-list"><a>会员中心</a></li>
            <li class="top-nav-list"><a>购物车</a></li>
            <li class="top-nav-list"><a>元祖门店</a></li>
            <li class="top-nav-list"><a>帮助中心</a></li>
        </ul>
    </div>
   </div>
   <!-- 顶部广告图 -->
      <div class="top-nav-ad">
          <a href="javascript:;">
              <img :src="topNavAd" alt="">
          </a>
      </div>
   </div>
</template>
<script>
import topNavAd from '@/assets/images/topNavAd.jpg'
import Phone from '@/assets/images/icon_phone.png'
import Sina from '@/assets/images/icon_sina.png'
import Tw from '@/assets/images/icon_tw.png'
export default {
    data () {
        return {
        topNavAd, Phone, Sina, Tw
        }
    }
}
</script>
<style lang='less' scoped>
@import '../../../assets/css/common';
.top-nav-box{
    background: #eee;
    height: 34px;
    line-height: 34px;
}
// 顶部导航list
.top-nav-lists{
    .top-nav-list{
        float: left;
        font-size: 12px;
        padding: 0 10px;
        a{
            width: 100%;
            height: 34px;
            display: inline-block;
            .nav-list-img{
                vertical-align: middle;
            }
            .nav-list-tit{
                vertical-align: middle;
            }
        }
    }
}
// 顶部导航广告
.top-nav-ad{
    width: 100%;
    height: 90px;
    a{
        display: inline-block;
        width: 100%;
        height: 100%;
        img{
        width: 100%;
        height: 100%;
    }
    }
}

</style>
