<template>
  <transition name="fade" v-if="apidef">
    <div class="card">
      <div class="card-block p-3 clearfix">
        <i class="fa fa-cogs bg-primary p-3 font-2xl mr-3 float-left"></i>
        <div class="h5 text-primary mb-0 mt-2">{{apidef.apiDef.metadata.apiName}}</div>
        <div class="text-muted text-uppercase font-weight-bold font-xs">Running<br/>{{apidef.createdAt}}</div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'api-definition',
    props: [
      'apidef'
    ]
  }
</script>

<style>
.card {
  min-width: 300px;
}
</style>