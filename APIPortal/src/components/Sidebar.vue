<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav">
        <li class="nav-title">
          Team Name
        </li>
        <li class="nav-item">
          <router-link :to="'/dashboard'" class="nav-link"><i class="icon-speedometer"></i> Dashboard</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/microservices'" class="nav-link" exact><i class="fa fa-server"></i> Microservices</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/logs'" class="nav-link" exact><i class="fa fa-file-code-o"></i> Logs</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="'/opschat'" class="nav-link" exact><i class="fa fa-comments-o"></i> OpsChat</router-link>
        </li>
        <li class="divider"></li>
      </ul>
    </nav>
  </div>
</template>
<script>

export default {
  name: 'sidebar',
  methods: {
    handleClick (e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    }
  }
}
</script>

<style lang="css">
  .nav-link {
    cursor:pointer;
  }
</style>
