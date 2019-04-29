<template>
    <div class="main-menu container clearfix">
        <div class="submenu fl" @mouseenter="changeShow" @mouseleave="changeShow">
               全部商品分类
               <div class="submenu-lists" v-show="show">
                   <ul>
                       <!-- 1 -->
                       <li class="submenu-list">
                           <span class="submenu-title">
                               <span class="submenu-img">
                                   <img :src="subMenu1">
                               </span>
                               <a>元祖端午节</a>
                           </span>
                           <a>纸质提货券</a>
                           <a>端午礼盒</a>
                           <a>电子提货券</a>
                       </li>
                       <!-- 2 -->
                       <li class="submenu-list">
                           <span class="submenu-title">
                               <span class="submenu-img">
                                   <img :src="subMenu2">
                               </span>
                               <a>冰品季</a>
                           </span>
                           <a>冰淇淋蛋糕</a>
                           <a>冰品电心</a>
                       </li>
                       <!-- 3 -->
                       <li class="submenu-list">
                           <span class="submenu-title">
                               <span class="submenu-img">
                                   <img :src="subMenu3">
                               </span>
                               <a>元祖踏青季</a>
                           </span>
                           <a>踏青小食</a>
                           <a>踏青蛋糕</a>
                       </li>
                       <!-- 4 -->
                       <li class="submenu-list">
                           <span class="submenu-title">
                               <span class="submenu-img">
                                   <img :src="subMenu4">
                               </span>
                               <a>MUCH蛋糕</a>
                           </span>
                           <a>鲜奶蛋糕</a>
                           <a>巧克力蛋糕</a>
                           <a>慕斯蛋糕</a>
                           <a>多层蛋糕</a>
                       </li>
                       <!-- 5 -->
                       <li class="submenu-list">
                           <span class="submenu-title">
                               <span class="submenu-img">
                                   <img :src="subMenu5">
                               </span>
                               <a>元祖礼盒</a>
                           </span>
                           <a>水果礼盒</a>
                           <a>糕点礼盒</a>
                       </li>
                       <!-- 6 -->
                       <li class="submenu-list">
                           <span class="submenu-title">
                               <span class="submenu-img">
                                   <img :src="subMenu6">
                               </span>
                               <a>精致西点</a>
                           </span>
                           <a>小慕斯类</a>
                           <a>西点卷类</a>
                           <a>麻薯类</a>
                           <a>其他</a>
                       </li>
                   </ul>
               </div>
               </div>
       <ul class="main-menu-lists fl">
           <li class="main-menu-list"><router-link to='/'>元祖商城</router-link></li>
           <li class="main-menu-list"><router-link :to="{path: 'detail/', query: {task_id: 1}}">品牌故事</router-link></li>
           <li class="main-menu-list"><router-link to='/detail/2'>企业试吃</router-link></li>
           <li class="main-menu-list"><a>启蒙乐园</a></li>
           <li class="main-menu-list"><a>联系我们</a></li>
       </ul>
    </div>
</template>
<script>
import subMenu1 from '@/assets/images/submenu1.png'
import subMenu2 from '@/assets/images/submenu2.jpg'
import subMenu3 from '@/assets/images/submenu3.png'
import subMenu4 from '@/assets/images/submenu4.png'
import subMenu5 from '@/assets/images/submenu5.png'
import subMenu6 from '@/assets/images/submenu6.png'
export default {
    data () {
      return {
          show: false,
          subMenu1,
          subMenu2,
          subMenu3,
          subMenu4,
          subMenu5,
          subMenu6
      }
    },
    methods: {
        // submenu的显示隐藏
    changeShow: function () {
        this.show = !this.show
    }
    }
}
</script>
<style lang='less' scoped>
 @import '~@/assets/css/common.less';
.main-menu{
    height: 40px;
    border-bottom: 2px solid @main-color;
    .main-menu-lists{
        height: 100%;
        line-height: 38px;
        .main-menu-list{
            display: inline-block;
            a{
                width: 100%;
                height: 100%;
                display: inline-block;
                padding: 0 20px;
            }
        }
    }
    .submenu{
            width: 225px;
            background: @main-color;
            text-align: center;
            color: #fff;
            cursor: pointer;
            position: relative;
            height: 40px;
            line-height: 40px;
            font-family: '宋体';
            .submenu-lists{
                position: absolute;
                color: #000;
                width: 100%;
                font-size: 12px;
                z-index: 999;
                line-height: 27px;
                .submenu-list{
                    padding: 10px 0 9px 34px;
                    text-align: left;
                    background: #eee;
                    position: relative;
                    &:nth-child(2n){
                        background: #fff;
                    }
                    a{
                    line-height: 20px;
                    color: #6b6b6b;
                    &:hover{
                        color: @main-color;
                    }
                   }
                    .submenu-title{
                        display: block;
                        height: 27px;
                        line-height: 27px;
                        text-align: left;
                        .submenu-img{
                            position: absolute;
                            left: 6px;
                            top: 15px;
                            width: 22px;
                            height: 22px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
}
</style>
