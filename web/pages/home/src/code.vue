<template>
    <div>
        <button @click="toSave">保存</button>
        <div class="code-wrapper">
            <textarea ref="mycode" name="code" v-model="jsonData"></textarea>
        </div>
    </div>
</template>

<script type="text/babel">
    import {getFileJSON, createPage} from './service.js'
  export default{
    data () {
      return {
        msg: 'hello vue',
        jsonData: {"test":  'my'}
      }
    },
    created () {
    },
    mounted () {
        getFileJSON('list.json').then((result) => {
            // this.jsonData = JSON.stringify(result.data);
            this.jsonData = result.data.substring(1, result.data.length-1);
            this.$nextTick(() => {
                this.createEditor();
            })
        });
    },
    components: {
    },
    beforeDestroy () {
        this.editor = null;
    },
    methods: {
        createEditor () {
            this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
                matchBrackets: true,
                autoCloseBrackets: true,
                mode: "application/ld+json",
                lineWrapping: true,
                lineNumbers: true
            });
        },
        toSave () {
            let jsonText = this.editor.getValue();
            createPage({configData: jsonText}).then((rsp) => {
                console.log(rsp.data);
            })
        }
    }
  }
</script>
<style lang="stylus">
.code-wrapper {
    position: fixed;
    right: 0px;
    bottom: 0px;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid green;
    .CodeMirror {
        height 100%
    }
}
</style>
