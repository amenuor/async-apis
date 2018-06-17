<template>
  <div class="animated fadeIn">
    <div v-if="error || localError">
      <div class="card card-danger">{{error || localError}}</div>
    </div>
    <div v-if="success" class="animated fadeIn">
      <div class="card card-success">{{success}}</div>
    </div>
    <div>
      <div class="row">
        <div class="col-12">
          <metadata-form :apidefs="apidefs" :apiId="apiId" v-model="metadata"/>
        </div>
      </div><!--/.row-->
      <div class="row">
        <div class="col-12">
          <json-editor :apidefs="apidefs" :apiId="apiId" v-model="schema"/>
        </div>
      </div><!--/.row-->
      <button class="round" @click="store()">Save</button>
    </div>
  </div>
</template>

<script>
import JsonEditor from './createApi/jsonEditor'
import MetadataForm from './createApi/metadataForm'
import uuidv4 from 'uuid/v4'
import Q from 'q'
import Ajv from 'ajv'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'upsert-api',
  components: {
    MetadataForm,
    JsonEditor
  },
  data () {
    return {
      notFound: false,
      apiId: null,
      metadata: null,
      schema: '',
      localError: null,
      ajv: new Ajv({ loadSchema: (input) => { return Q.promise(function (resolve) { resolve(input) }) } })
    }
  },
  computed: {
    ...mapGetters({
      apidefs: 'apidefs',
      error: 'error',
      success: 'success'
    })
  },
  methods: {
    ...mapActions([
      'fetchApiDefinitions',
      'storeApiDefinition'
    ]),
    store () {
      if (!this.schema) {
        this.setLocalError('Invalid empty schema.')
        return
      }
      if (!this.isJsonString(this.schema)) {
        this.setLocalError('Invalid json schema.')
        return
      }
      this.ajv.compileAsync(JSON.parse(this.schema)).then(() => {
        this.storeApiDefinition({apiId: this.metadata.apiId, apidef: {metadata: this.metadata, schemaB64: window.btoa(this.schema)}})
      }).catch(err => {
        this.setLocalError('Invalid schema. ' + err)
        console.error(err)
      })
    },
    setLocalError (errorMessage) {
      this.localError = errorMessage
      window.setTimeout(() => {
        this.localError = null
      }, 5000)
    },
    isJsonString (str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }
  },
  created () {
    this.fetchApiDefinitions()
    if (this.$route.name === 'EditApi') {
      this.apiId = this.$route.params.apiId
    } else {
      this.apiId = uuidv4()
    }
  }

}
</script>

<style scoped>
button.round{
  border-radius: 50%;
  background-color: #4fc08d;
  width: 50px;
  height: 50px;
  font-size: 1em;
  color: white;
  position: fixed;
  bottom: 100px;
  left: 50%;
}
</style>