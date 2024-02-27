<template>
  <div class="page">
    <p class="page_title vsd-pb">哦霍，页面不存在！^_^ ^_^</p>
   <el-button class="vsd-mt" @click="closeCurrentWindow">
      返回首页
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    closeCurrentWindow() {
      window.location.href = "about:blank";
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: #FFF;
  background-blend-mode: multiply,multiply;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .page_title {
    font-size: 20px;
    color: #000;
  }
}
</style>
