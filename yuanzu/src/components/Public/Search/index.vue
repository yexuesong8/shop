<template>
    <div class="search-module container clearfix">
        <img class="fl search-logo" :src="Logo">
        <div class="nav-search-box">
            <input type="text" class="search-input" placeholder="请输入搜索名称">
            <div class="search-text">
                <span>热门搜索:
                    <a>MUCH蛋糕</a>
                    <a>精致西点</a>
                    </span>
            </div>
            <a class="search-btn">搜索</a>
        </div>
        <img class="fr tel" :src="Tel">
    </div>
</template>
<script>
import Logo from '@/assets/images/logo.png'
import Tel from '@/assets/images/tel.jpg'
export default {
  data () {
    return {
      Logo, Tel
    }
  }
}
</script>
<style lang='less' scoped>
@import '~@/assets/css/common.less';
.search-module{
    text-align: center;
    margin-top: 20px;
    .nav-search-box{
     height: 20px;
     width: 400px;
     border: 3px solid @weight-color;
     display: inline-block;
     height: 40px;
     margin-top: 30px;
     position: relative;
     .search-input{
         height: 34px;
         width: 100%;
         outline: none;
         border: 0;
         padding-left: 20px;
     }
     .search-text{
        font-size: 12px;
        margin-top: 10px;
        text-align: left;
        color: #aeaeae;
        font-family: '宋体';
        a{
            color:#aeaeae;
            &:hover{
                color: #4f4f4f;
            }
        }
     }
     .search-btn{
         width: 70px;
         height: 40px;
         line-height: 36px;
         text-align: center;
         display: inline-block;
         background: @weight-color;
         position: absolute;
         right: -3px;
         top: -3px;
         color: #fff;
         &:hover{
             background:@main-color;
         }
     }
 }
 .search-logo{
     margin-top: 20px;
 }
}
// 判断屏幕大小隐藏图片
@media (max-width: 992px) {
    .tel{
        display: none;
    }
}
@media (max-width: 370px) {
    .search-logo{
        display: none;
    }
}
</style>
