<template>
  <div class="animated fadeIn">
    <div class="row">
      <api-definition v-for="apidef in apidefs" :apidef="apidef" :key="apidef.id"/>
    </div><!--/.row-->
    <button class="round">+</button>
  </div>
</template>

<script>
import ApiDefinition from './mainpage/apidef'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'mainpage',
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