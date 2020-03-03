  <template>
  <div id="preview-container" class="preview-container" style="position: relative;"></div>
</template>

  <script>
import G6 from "@antv/g6";
export default {
  data() {
    return {
      graph: null
    };
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      // const height = this.height - 420;
      // const width = this.width - 400;
      this.graph = new G6.Graph({
        container: "preview-container",
        height: 350,
        width: 750,
        fitView: true
      });
      let data = this.data;
      if (data) {
        this.graph.read(data);
      }
    }
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        if (Object.keys(newVal).length > 0) {
          this.graph.read(newVal);
        }
      }
    }
  }
};
</script>
