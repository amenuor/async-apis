<template>
  <transition name="fade">
    <b-card class="bg-secondary" no-body v-if="show">
      <div slot="header">
        Card with header actions
        <div class="card-header-actions">
          <b-link href="#" class="card-header-action btn-setting">
            <i class="icon-settings"></i>
          </b-link>
          <b-link class="card-header-action btn-minimize" v-b-toggle.collapse1>
            <i class="icon-arrow-up"></i>
          </b-link>
          <b-link href="#" class="card-header-action btn-close" v-on:click="show = !show">
            <i class="icon-close"></i>
          </b-link>
        </div>
      </div>
      <b-collapse id="collapse1" visible>
        <b-card-body>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
        </b-card-body>
      </b-collapse>
    </b-card>
  </transition>
</template>