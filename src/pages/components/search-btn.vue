<template>
    <view class="wrap">
        <view class="search-box">
            <input class="input" type="text" :placeholder="placeholder" v-model="search" />
            <button type="default" class="btn" hover-class="hover" @click="$emit('searchClick')">{{searchText}}</button>
        </view>
    </view>
</template>

<script>
  export default {
    name: "search-btn",
    props: {
      value: String,
      placeholder: String,
      searchText: {
        default: '搜索',
        type: String
      }
    },
    computed: {
      search: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
    @import "../../uni.styl"
    .wrap {
        display block
        width 100%
    }
    .search-box {
        width 100%
        display: flex;
        border: 1px solid $uni-border-color;
        border-radius: 5px;
        overflow hidden;
    .input{
        flex: 1;
        line-height 40px
        padding 5px;
    }
    .btn {
        background-color $uni-list-item-hover-color;
        color #fff
        border-radius 0
        border none
        width auto
        padding 0 20px
    }

    }
</style>
