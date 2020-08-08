<template>
    <view class="no-data">
        {{text}}
    </view>
</template>

<script>
  export default {
    name: "no-data",
    props: {
      text: {
        type: [Number, String],
        default: '暂无数据'
      }
    },
    data() {
      return {
        selectIndex: 0
      }
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus">
    .no-data {
        color: #999;
        text-align: center;
        padding: 10px;
        margin: auto;
    }
</style>
