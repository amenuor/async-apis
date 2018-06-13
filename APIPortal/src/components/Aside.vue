<template>
  <aside class="aside-menu px-4">
    <hr>
    <h6>System Utilization</h6>
    <div class="text-uppercase mb-1 mt-4"><small><b>CPU Usage</b></small></div>
    <div class="progress progress-xs">
      <div class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <small class="text-muted">348 Processes. 1/4 Cores.</small>
    <div class="text-uppercase mb-1 mt-2"><small><b>Memory Usage</b></small></div>
    <div class="progress progress-xs">
      <div class="progress-bar bg-warning" role="progressbar" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <small class="text-muted">11444GB/16384MB</small>
  </aside>
</template>

<script>
export default {
  name: 'appaside'
}
/* eslint-disable */
///////////////////////////////////////////////////////////////////////////////
// TODO: Show data related to the current resources used by the whole system //
///////////////////////////////////////////////////////////////////////////////
/* eslint-enable */
</script>
