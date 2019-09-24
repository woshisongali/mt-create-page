<template>
<div>
  {{msg}}
  <code-panel></code-panel>
</div>
  
</template>
<script type="text/babel">
  import Vue from 'vue'
  import codePanel from './src/code.vue'
  export default{
    data () {
      return {
        msg: 'hello vue'
      }
    },
    mounted () {
    },
    components: {
      'code-panel': codePanel
    },
    methods: {}
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.hover-styl {
  cursor pointer
}

</style>
<style lang="stylus">
.customStyle {
  width 500px
  margin 0px auto
  background #fff
}
</style>

