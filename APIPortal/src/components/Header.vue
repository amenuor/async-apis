<template>
  <navbar>
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <a class="navbar-brand" href="#"></a>
    <ul class="nav navbar-nav d-md-down-none">
      <li class="nav-item">
        <a class="nav-link navbar-toggler sidebar-toggler" href="#" @click="sidebarMinimize">&#9776;</a>
      </li>
      <li class="nav-item">
      </li>
    </ul>
    <ul class="nav navbar-nav ml-auto">
      <li class="nav-item d-md-down-none">
        <router-link to="/microservices" class="nav-link" href="#"><i class="icon-bell"></i><span id="top-alerts" class="badge badge-pill badge-danger">2</span></router-link>
      </li>
      <li class="nav-item d-md-down-none">
        <a class="nav-link navbar-toggler aside-menu-toggler" href="#" @click="asideToggle">&#9776;</a>
      </li>
    </ul>
  </navbar>
</template>
<script>

import navbar from './Navbar'

export default {
  name: 'appheader',
  components: {
    navbar
  },
  created () {
  },
  methods: {
    click () {
      // do nothing
    },
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
/* eslint-disable */
//////////////////////////////////////////////////////////////////////////////////////////////////////
// TODO: Ensure we show the correct information:                                                    //
//   - #top-alerts and #menu-alerts should contain the right number of microservices currently down //
//   - #chats should contain the amount of unseen messages in the OpsChat                           //
//////////////////////////////////////////////////////////////////////////////////////////////////////
/* eslint-enable */
</script>
