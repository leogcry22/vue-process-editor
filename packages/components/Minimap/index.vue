<template>
  <div id="navigator" class="navigator">
    <div class="pannel-title">导航器</div>
    <div id="minimap" class="minimap" ref="minimap"></div>
  </div>
</template>

<script>
import Minimap from "@antv/g6/build/minimap";
import eventBus from "../../utils/eventBus";
export default {
  data() {
    return {
      minimap: null,
      graph: null
    };
  },
  created() {
    this.bindEvent();
  },
  mounted() {
    this.$nextTick(() => {
      this.initMinmap();
    });
  },
  methods: {
    initMinmap() {
      const cfgs = {
        container: "minimap"
      };
      this.minimap = new Minimap({ ...cfgs });
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.graph = page.graph;
        this.bindPage();
      });
    },
    bindPage() {
      if (!this.minimap || !this.graph) {
        return;
      }
      this.graph.addPlugin(this.minimap);
    }
  }
};
</script>

<style scoped>
.navigator {
  width: 200px;
  /* height: 176px; */
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 2;
}
.pannel-title {
  height: 40px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  box-sizing: border-box;
  background: #ebeef2;
  line-height: 40px;
  padding-left: 12px;
}
</style>
