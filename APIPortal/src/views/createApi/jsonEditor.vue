<template>
  <div>
    <textarea id="json-editor" name="json-editor"></textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/comment/continuecomment'
import 'codemirror/addon/comment/comment'
import '../../../static/css/codemirror.css'

export default {
  name: 'json-editor',
  props: ['apidefs', 'apiId'],

  watch: {
    apidefs: function (newApidefs) {
      if (this.$route.name === 'EditApi' && !this.changed && newApidefs[this.apiId]) {
        this.codeMirror.doc.setValue(window.atob(newApidefs[this.apiId].apiDef.schemaB64))
      }
    }
  },

  mounted () {
    this.codeMirror = CodeMirror.fromTextArea(document.getElementById('json-editor'), {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: 'application/ld+json',
      lineWrapping: true,
      lineNumbers: true
    })

    this.codeMirror.on('change', (doc, changeObj) => {
      this.$emit('input', doc.getValue())
      this.changed = true
    })
  }

}
</script>