<template>
  <div class="toolbar">
    <i
      class="command iconfont icon-undo"
      title="撤销"
      :class="undoList.length>0?'':'disable'"
      @click="handleUndo"
    ></i>
    <i
      class="command iconfont icon-redo"
      title="重做"
      :class="redoList.length>0?'':'disable'"
      @click="handleRedo"
    ></i>
    <span class="separator"></span>
    <i
      data-command="delete"
      class="command iconfont icon-delete-o"
      title="删除"
      :class="selectedItem?'':'disable'"
      @click="handleDelete"
    ></i>
    <span class="separator"></span>
    <i
      data-command="zoomIn"
      class="command iconfont icon-zoom-in-o"
      title="放大"
      @click="handleZoomIn"
    ></i>
    <i
      data-command="zoomOut"
      class="command iconfont icon-zoom-out-o"
      title="缩小"
      @click="handleZoomOut"
    ></i>
    <i
      data-command="autoZoom"
      class="command iconfont icon-fit"
      title="适应画布"
      @click="handleAutoZoom"
    ></i>
    <i
      data-command="resetZoom"
      class="command iconfont icon-actual-size-o"
      title="实际尺寸"
      @click="handleResetZoom"
    ></i>
    <span class="separator"></span>
    <i
      data-command="toBack"
      class="command iconfont icon-to-back"
      :class="selectedItem?'':'disable'"
      title="层级后置"
      @click="handleToBack"
    ></i>
    <i
      data-command="toFront"
      class="command iconfont icon-to-front"
      :class="selectedItem?'':'disable'"
      title="层级前置"
      @click="handleToFront"
    ></i>
    <span class="separator"></span>
    <i
      data-command="multiSelect"
      class="command iconfont icon-select"
      :class="multiSelect?'disable':''"
      title="多选"
      @click="handleMuiltSelect"
    ></i>
    <span class="separator"></span>
    <div class="toolbar-button">
      <el-button plain size="mini" @click="handleFlowData('export')" icon="el-icon-download">导出为JSON</el-button>
      <el-button plain size="mini" plian icon="el-icon-view" @click="handleFlowData('preview')">预览</el-button>
      <el-button
        :disabled="saving"
        :loading="saving"
        size="mini"
        @click="handleFlowData('save')"
        type="primary"
        icon="el-icon-check"
      >保 存</el-button>
      <!-- <el-button size="mini" type="primary" icon="el-icon-video-play">运 行</el-button> -->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import eventBus from "../../utils/eventBus";
import Util from "@antv/g6/src/util";
import { Message } from "element-ui";
import { generateTermStr, isObjHasNull, uniqueId, getBox } from "../../utils";
import { saveflowData } from "../../api/flow";
export default {
  data() {
    return {
      page: {},
      graph: {},
      redoList: [],
      undoList: [],
      editor: null,
      command: null,
      saving: false,
      selectedItem: null,
      multiSelect: false,
      flowData: {
        flowName: "",
        flowType: "审核流程",
        flowDepict: "",
        flowActivityNumber: 0,
        flowDataObject: [],
        nodes: [],
        edges: []
      }
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  methods: {
    init() {
      const { editor, command } = this.$parent;
      this.editor = editor;
      this.command = command;
    },
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
      });
      eventBus.$on("add", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("update", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("delete", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("updateItem", item => {
        this.command.executeCommand("update", [item]);
      });
      eventBus.$on("addItem", item => {
        this.command.executeCommand("add", [item]);
      });
      eventBus.$on("nodeselectchange", () => {
        this.selectedItem = this.graph.findAllByState("node", "selected");
        this.selectedItem = this.selectedItem.concat(
          ...this.graph.findAllByState("edge", "selected")
        );
      });
      eventBus.$on("deleteItem", () => {
        this.handleDelete();
      });
      eventBus.$on("muliteSelectEnd", () => {
        this.multiSelect = false;
        this.selectedItem = this.graph.findAllByState("node", "selected");
      });
      eventBus.$on("flownamechange", data => {
        this.flowData.flowName = data;
      });
      eventBus.$on("flowdescchange", data => {
        this.flowData.flowDepict = data;
      });
      eventBus.$on("saveDataObj", data => {
        this.flowData.flowDataObject = data;
      });
    },
    handleUndo() {
      if (this.undoList.length > 0) this.command.undo();
    },
    handleRedo() {
      if (this.redoList.length > 0) this.command.redo();
    },
    handleDelete() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.command.executeCommand("delete", this.selectedItem);
        this.selectedItem = null;
      }
    },
    getFormatPadding() {
      return Util.formatPadding(this.graph.get("fitViewPadding"));
    },
    getViewCenter() {
      const padding = this.getFormatPadding();
      const graph = this.graph;
      const width = this.graph.get("width");
      const height = graph.get("height");
      return {
        x: (width - padding[2] - padding[3]) / 2 + padding[3],
        y: (height - padding[0] - padding[2]) / 2 + padding[0]
      };
    },
    handleZoomIn() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
    },
    handleZoomOut() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter());
    },
    handleToBack() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          item.toBack();
          this.graph.paint();
        });
      }
    },
    handleToFront() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          if (item.getType() === "edge") {
          } else {
            item.toFront();
          }
          this.graph.paint();
        });
      }
    },
    handleAutoZoom() {
      this.graph.fitView(20);
    },
    handleResetZoom() {
      this.graph.zoomTo(1, this.getViewCenter());
    },
    handleMuiltSelect() {
      this.multiSelect = true;
      this.graph.setMode("mulitSelect");
    },
    // 导出或保存流程信息
    handleFlowData(type) {
      var editorData = this.graph.save();
      var nodeNum = editorData.nodes.length;
      if (nodeNum <= 0) {
        this.$message({
          showClose: true,
          message: "当前无流程信息",
          type: "warning",
          duration: 1500
        });
        return;
      }
      if (!this.flowData.flowName && type != "preview") {
        this.$message({
          showClose: true,
          message: "请输入流程名称",
          type: "warning",
          duration: 1500
        });
        return;
      }
      editorData.edges.some(attrs => {
        let terms = attrs.attribute;
        if (terms.length >= 1) {
          if (isObjHasNull(terms[0])) {
            this.$message({
              showClose: true,
              message:
                "请完整设置节点[" +
                attrs.source +
                "]至节点[" +
                attrs.target +
                "]的条件",
              type: "warning",
              duration: 1500
            });
            return true;
          }
        }
      });
      this.flowData.flowActivityNumber = nodeNum;
      this.flowData.nodes = editorData.nodes;
      this.flowData.edges = editorData.edges;
      if (type == "export") {
        var datastr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(this.flowData));
        var downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", datastr);
        downloadAnchorNode.setAttribute("download", "流程数据.json");
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      } else if (type == "save") {
        this.saving = true;
        let formData = new FormData();
        formData.append("flowData", JSON.stringify(this.flowData));
        saveflowData(formData)
          .then(response => {
            Message({
              showClose: true,
              message: response.data.message,
              type: response.data.status,
              duration: 1500,
              onClose: () => {
                this.saving = false;
              }
            });
          })
          .catch(error => {
            this.saving = false;
          });
      } else if (type == "preview") {
        eventBus.$emit("showpreview", this.flowData);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./toolbar.css";
.toolbar {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e9e9e9;
  height: 42px;
  line-height: 36px;
  z-index: 3;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  position: absolute;
}
.toolbar .command:nth-of-type(1) {
  margin-left: 24px;
}
.toolbar .command {
  height: auto;
  width: auto;
  box-sizing: border-box;
  padding: 2px;
  margin: 0px 6px;
  border-radius: 2px;
  border: 1px solid rgba(2, 2, 2, 0);
}
.toolbar .command:hover {
  cursor: pointer;
  border: 1px solid #e9e9e9;
}
.toolbar .disable {
  color: rgba(0, 0, 0, 0.25);
}
.toolbar .separator {
  margin: 4px;
  border-left: 1px solid #e9e9e9;
}
.toolbar .toolbar-button {
  display: inline-block;
  margin-left: 12px;
}
</style>
