<template>
    <div class="footer container">
        <img :src="FooterImg" alt="" class="footer-logo">
        <div class="links-box">
            <ul class="links clearfix">
            <li><a>帮助中心</a>|</li>
            <li><a>关于我们</a>|</li>
            <li><a>元祖服务</a>|</li>
            <li><a>人才招聘</a>|</li>
            <li><a>联系我们</a>|</li>
            <li><a>元祖会员</a></li>
        </ul>
        </div>
        <p class="copy">版权所有@2015上海元祖梦果子股份有限公司沪ICP备17013537号
            <img :src="orGan" alt="">
        <a>沪公网安备 31011802001203号</a>
        </p>
        <p class="copy"><a><img style="width:260px" :src="footer" alt=""></a></p>
    </div>
</template>
<script>
import FooterImg from '@/assets/images/footerLogo.jpg'
import orGan from '@/assets/images/organ.png'
import footer from '@/assets/images/footer.jpg'
export default {
    data () {
        return {
            FooterImg, orGan, footer
        }
    }
}
</script>
<style lang='less' scoped>
@import '~@/assets/css/common.less';
.footer{
  border-top: 5px solid @main-color;
  margin-top: 30px;
  padding-bottom: 50px;
  text-align: center;
  .footer-logo{
      display: block;
      width: 100%;
      margin: 20px 0;
  }
  .links{
      line-height: 30px;
      display: inline-block;
      li{
          float: left;
          font-size: 12px;
          a{
              margin: 0 6px;
          }
      }
  }
}
.copy{
    font-size: 12px;
    color: #333;
    line-height: 30px;
    margin-bottom: 10px;
}
</style>
