<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item class="collapse-title" title="基本节点" name="baseNode">
      <ul>
        <li
          v-for="(item,index) in baseList"
          :key="index"
          class="getItem"
          :data-shape="item.shape"
          :data-type="item.type"
          :data-size="item.size"
          draggable
          @dragstart="handleDragstart"
          @dragend="handleDragEnd($event,item)"
        >
          <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
          {{item.name}}
        </li>
      </ul>
    </el-collapse-item>
    <el-collapse-item class="collapse-title" title="活动节点" name="activitiNode">
      <ul>
        <li
          v-for="(item,index) in activitiList"
          :key="index"
          class="getItem"
          :data-shape="item.shape"
          :data-type="item.type"
          :data-size="item.size"
          draggable
          @dragstart="handleDragstart"
          @dragend="handleDragEnd($event,item)"
        >
          <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
          {{item.name}}
        </li>
      </ul>
    </el-collapse-item>
    <el-collapse-item class="collapse-title" title="服务配置节点" name="jarNode">
      <ul>
        <li
          v-for="(item,index) in servList"
          :key="index"
          class="getItem"
          :data-shape="item.shape"
          :data-type="item.type"
          :data-size="item.size"
          draggable
          @dragstart="handleDragstart"
          @dragend="handleDragEnd($event,item)"
        >
          <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
          {{item.name}}
        </li>
      </ul>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import eventBus from "../../utils/eventBus";
import okSvg from "../../assets/icons/ok.svg";
import { uniqueId } from "../../utils";
export default {
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
      baseList: [
        {
          activityNodeType: "startNode",
          activityName: "开始",
          activityDepict: "",
          activityAccept: "",
          acceptId: "1",
          activityRun: "",
          runId: "1",
          name: "开始节点",
          size: "128*48",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#67C23A",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          outPoints: [[0, 0.5], [1, 0.5], [0.5, 1]],
          isDoingStart: true
        },
        {
          activityNodeType: "endNode",
          activityName: "结束",
          activityDepict: "",
          name: "结束节点",
          size: "128*48",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#F56C6C",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          inPoints: [[0, 0.5], [1, 0.5], [0.5, 1]],
          isDoingEnd: true
        }
      ],
      activitiList: [
        {
          activityNodeType: "applyNode",
          activityName: "申请节点",
          activityDepict: "",
          activityAccept: "",
          acceptId: "2",
          activityRun: "",
          runId: "2",
          name: "申请节点",
          size: "208*48",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#409EFF",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        },
        {
          activityNodeType: "approvalNode",
          activityName: "审批节点",
          activityDepict: "",
          activityAccept: "",
          acceptId: "3",
          activityRun: "",
          runId: "3",
          name: "审批节点",
          size: "208*48",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#E6A23C",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        }
      ],
      servList: [
        {
          activityNodeType: "servNode",
          activityName: "服务包节点",
          activityDepict: "",
          activityAccept: "",
          acceptId: "4",
          activityRun: "",
          runId: "4",
          name: "服务包节点",
          size: "128*48",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#13C2C2",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        }
      ],
      activeNames: ["baseNode", "activitiNode"]
    };
  },
  created() {
    this.bindEvent();
  },
  methods: {
    handleDragstart(e) {
      e.dataTransfer.setData("firefox", "fix");
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    checkMultiNode(item) {
      let nodes = this.page.graph.getNodes();
      let hasMore = false;
      for (let index in nodes) {
        let node = nodes[index].getModel();
        if (
          node.activityNodeType == item.activityNodeType &&
          (item.activityNodeType == "startNode" ||
            item.activityNodeType == "endNode")
        ) {
          hasMore = true;
        }
      }
      return hasMore;
    },
    handleDragEnd(e, item) {
      if (!this.checkMultiNode(item)) {
        let data = {};
        Object.assign(data, item);
        data.offsetX = this.offsetX;
        data.offsetY = this.offsetY;
        if (this.page) {
          const graph = this.page.graph;
          // const size = e.target.dataset.size.split("*");
          const xy = graph.getPointByClient(e.x, e.y);
          data.x = xy.x;
          data.y = xy.y;
          data.size = item.size.split("*");
          data.type = "node";
          this.command.executeCommand("add", [data]);
        }
      }
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
        this.command = page.command;
      });
    }
  }
};
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 199px;
  border-right: 1px solid #e6e9ed;
}
.itempannel ul {
  padding: 0px;
  margin: 8px;
  padding-left: 8px;
}
.itempannel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 160px;
  height: 48px;
  line-height: 46px;
  margin-bottom: 4px;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
.itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}
.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
<style lang="scss">
.collapse-title .el-collapse-item__header {
  height: 40px !important;
  line-height: 40px !important;
  padding-left: 12px !important;
}
.collapse-title .el-collapse-item__content {
  padding: 0px !important;
}
</style>
