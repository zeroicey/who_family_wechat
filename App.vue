<script>
export default {
  onLaunch: async function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  }
};
</script>

<style lang="scss">
@import "./uni.scss";

page {
  --brand-primary: #6d4aff;
  --brand-primary-soft: #ede9ff;
  --brand-accent: #22c55e;
  --brand-accent-soft: #e8f9ef;
  --surface-page: #f5f7fb;
  --surface-card: #ffffff;
  --surface-muted: #eef2f7;
  --border-soft: #e5e9f2;
  --text-primary: #182131;
  --text-secondary: #5b6475;
  --text-tertiary: #8a93a5;
  --shadow-soft: 0 10rpx 30rpx rgba(24, 33, 49, 0.06);
  --shadow-strong: 0 20rpx 60rpx rgba(24, 33, 49, 0.1);
  --radius-card: 24rpx;
  --radius-pill: 999rpx;
  --content-gutter: 32rpx;
  background: var(--surface-page);
  color: var(--text-primary);
  font-size: 28rpx;
}

view,
text,
button,
input,
scroll-view,
swiper,
swiper-item,
image {
  box-sizing: border-box;
}

button {
  margin: 0;
  padding: 0;
  line-height: 1;
  background: transparent;
}

button::after {
  border: 0;
}
</style>
