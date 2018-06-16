<template>
  <div class="animated fadeIn">
    <div v-if="error">
      <div class="card card-danger">{{error}}</div>
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
      schema: ''
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
      this.storeApiDefinition({apiId: this.metadata.apiId, apidef: {metadata: this.metadata, schemaB64: window.btoa(this.schema)}})
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