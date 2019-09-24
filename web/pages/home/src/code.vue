<template>
    <div class="code-wrapper">
        <button @click="toSave">保存</button>
        <textarea id="code" name="code">{{jsonData}}</textarea>
    </div>
</template>

<script type="text/babel">
  export default{
    data () {
      return {
        msg: 'hello vue',
        jsonData: {
            "@context": {
                "name": "http://schema.org/name",
                "description": "http://schema.org/description",
                "image": {
                "@id": "http://schema.org/image",
                "@type": "@id"
                },
                "geo": "http://schema.org/geo",
                "latitude": {
                "@id": "http://schema.org/latitude",
                "@type": "xsd:float"
                },
                "longitude": {
                "@id": "http://schema.org/longitude",
                "@type": "xsd:float"
                },
                "xsd": "http://www.w3.org/2001/XMLSchema#"
            },
            "name": "The Empire State Building",
            "description": "The Empire State Building is a 102-story landmark in New York City.",
            "image": "http://www.civil.usherbrooke.ca/cours/gci215a/empire-state-building.jpg",
            "geo": {
                "latitude": "40.75",
                "longitude": "73.98"
            }
        }
      }
    },
    mounted () {
        this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            matchBrackets: true,
            autoCloseBrackets: true,
            mode: "application/ld+json",
            lineWrapping: true
        });
    },
    components: {
    },
    beforeDestroy () {
        this.editor = null;
    },
    methods: {
        toSave () {
            let jsonText = this.editor.getValue();
            console.log(jsonText);
        }
    }
  }
</script>
<style>
.code-wrapper .CodeMirror-scroll {
    width: 600px;
    height: 200px;
    border: 1px solid green;
}
</style>
