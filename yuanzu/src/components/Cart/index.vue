<template>
  <div class="container cart-box clearfix">
    <!--订单状态step-->
    <div class="cart-step">
      <ul class="cart-step-lists clearfix">
        <li>1.购物车</li>
        <li>2.填写订单</li>
        <li>3.提交成功</li>
        <li>4.在线支付</li>
      </ul>
    </div>
    <!--加入的商品-->
    <div class="cartContent">
      <template>
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="img"
          >
            <template slot-scope="scope">
              <img  :src="scope.row.img" alt="" style="width: 100px;height: 100px">
            </template>
          </el-table-column>
          <el-table-column
            prop="shop"
            label="商品">
            <template slot-scope="scope">
              <a>{{scope.row.shop}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格">
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量">
            <template slot-scope="scope">
              <a class="num-add" @click="addNum(scope.row.num)">+</a><input type="text" class="num-input" :value="scope.row.num"><a class="num-add" @click="prevNum">-</a>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, tableData)"
                type="text"
                size="small">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!--结算-->
    <div class="statistics">
      <h3>订单合计</h3>
      <div class="total">
        <div>商品数量总计:1</div>
        <div class="">商品金额合计(不包含运费):<em>￥258</em></div>
      </div>
      <div class="">总计:258</div>
      <div class="statistics-btn">
        <a>继续购物</a>
        <a>结算</a>
      </div>
    </div>
  </div>
</template>
<script>
  import stepImg from '@/assets/images/stepbg.jpg'
  import shop1 from '@/assets/images/love1.jpg'
  let tableData = [
    {
      shop: '8号桃花扇鲜奶蛋糕',
      price: 258,
      img: shop1,
      num: 1
    },
    {
      shop: '8号桃花扇鲜奶蛋糕',
      price: 258,
      img: shop1,
      num: 1
    }
  ]
    export default {
    data () {
      return {
        stepImg,
        tableData,
        shop1,
        total: 1
      }
    },
      methods: {
        deleteRow (index, rows) {
          rows.splice(index, 1)
        },
        addNum (e) {
           e += 1
          console.log(e)
        },
        prevNum () {
          this.total--
        }
      },
      computed: {
        tableData: function () {
          return tableData
        }
      }
    }
</script>
<style lang="less" scoped>
  @import '~@/assets/css/common.less';
  .cart-box{
    margin-top: 30px;
  }
.cart-step{
  width: 100%;
  margin-bottom: 15px;
  .cart-step-lists{
    width: 100%;
    background: url("../../assets/images/stepbg.jpg") no-repeat;
    li{
      float: left;
      width: 25%;
      text-align: center;
      height: 31px;
      line-height: 31px;
    }
  }
}
  /*商品数量加减*/
  .num-input{
    width: 30px;
    text-align: center;
    outline:0;
    height: 23px;
    font-size: 12px;
    line-height: 23px;
    vertical-align: middle;
  }
  .num-add{
    width: 23px;
    height: 23px;
    border: 1px solid #ccc;
    display: inline-block;
    text-align: center;
    line-height: 21px;
    vertical-align: middle;
    background: #f0f0f0;
    user-select: none;
  }
  /*合计*/
  .statistics{
    float: right;
    margin-top: 20px;
    h3{
      font-size:16px;
      font-weight: normal;
      border-bottom:1px solid #959595;
      margin-bottom: 10px;
    }
    .total{
      border-bottom: 1px solid #959595;
      margin-bottom: 10px;
      line-height: 30px;
      em{
        color: @main-color;
        font-style: normal;
        font-weight: 700;
      }
    }
  }
  .statistics-btn{
    margin-top: 10px;
    a{
      width: 120px;
      background: #de5356;
      color: #fff;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      text-align: center;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    };
  }
</style>
