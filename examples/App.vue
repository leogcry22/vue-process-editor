<template>
  <div id="app">
    <vue-process-editor mode="edit" />
  </div>
</template>

<script>
import VueProcessEditor from "../packages/components/VueProcessEditor";
export default {
  name: "app",
  components: { VueProcessEditor }
};
</script>

<style>
html,
body {
  overflow: hidden;
  margin: 0;
  font-size: 14px;
  font-family: Microsoft YaHei, PingFang SC;
}
#app {
  margin: 0;
  padding: 0;
}
</style>
