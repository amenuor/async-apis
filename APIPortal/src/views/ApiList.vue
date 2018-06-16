<template>
  <div class="animated fadeIn">
    <div class="row">
      <router-link v-for="apidef in apidefs" :key="apidef.apiId" :to="'/editapi/' + apidef.apiId">
        <api-definition :apidef="apidef"/>
      </router-link>
    </div><!--/.row-->
    <router-link :to="'/newapi'">
      <button class="round">+</button>
    </router-link>
  </div>
</template>

<script>
import ApiDefinition from './apiList/apidef'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'api-list',
  components: {
    ApiDefinition
  },
  computed: {
    ...mapGetters({
      apidefs: 'apidefs'
    })
  },
  methods: {
    ...mapActions([
      'fetchApiDefinitions'
    ])
  },
  created () {
    this.fetchApiDefinitions()
  }
}
/* eslint-disable */
//////////////////////////////////////////////////////////
// TODO: Add code to correctly serve paginated contents //
//////////////////////////////////////////////////////////
/* eslint-enable */
</script>

<style scoped>
button.round{
  border-radius: 50%;
  background-color: #4fc08d;
  width: 50px;
  height: 50px;
  font-size: 2em;
  color: white;
  position: fixed;
  bottom: 100px;
  left: 50%;
}
</style>