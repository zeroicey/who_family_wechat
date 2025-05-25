<template>
  <view class="order-content">
    <view class="product-info">
      <image class="product-image" :src="productImage" mode="aspectFill"></image>
      <view class="product-detail">
        <text class="product-name">{{ productName }}</text>
        <text class="product-desc">{{ productDesc }}</text>
        <view class="price-info">
          <text class="price">¥{{ price.toFixed(2) }}</text>
          <text class="quantity">x{{ quantity }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  productName: {
    type: String,
    required: true
  },
  productDesc: {
    type: String,
    default: ''
  },
  productImage: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});
</script>

<style lang="scss" scoped>
.order-content {
  padding: 3vw 3vw 3vw 4vw;
  border-bottom: 1px solid #f5f5f5;

  .product-info {
    display: flex;

    .product-image {
      width: 16vw;
      height: 16vw;
      background-color: #f5f5f5;
      margin-right: 3vw;
      border-radius: 1vw;
    }

    .product-detail {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .product-name {
        font-size: 3.5vw;
        color: #333;
        margin-bottom: 1vw;
        width: 65vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
      }

      .product-desc {
        font-size: 3vw;
        color: #999;
        width: 65vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 1vw;
      }

      .price-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
          font-size: 3.2vw;
          color: #333;
        }

        .quantity {
          font-size: 3vw;
          color: #999;
        }
      }
    }
  }
}
</style>
