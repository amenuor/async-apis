<template>
  <div>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-default">Api Name</span>
      </div>
      <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" v-model="apiName" />
      <div class="input-group-prepend">
        <span class="input-group-text" id="inputGroup-sizing-default">Api ID</span>
      </div>
      <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" v-model="apiId" readonly/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'metadata-form',
  props: ['apidefs', 'apiId'],

  data () {
    return {
      apiName: ''
    }
  },

  watch: {
    apidefs: function (newApidefs) {
      if (this.$route.name === 'EditApi' && !this.changed && newApidefs[this.apiId]) {
        this.apiName = newApidefs[this.apiId].apiDef.metadata.apiName
      }
    }
  },

  updated () {
    this.$emit('input', {apiName: this.apiName, apiId: this.apiId})
    this.changed = true
  }
}
</script>