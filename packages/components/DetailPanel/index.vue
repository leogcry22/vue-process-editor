<template>
  <div class="detailpannel">
    <div class="detail-container">
      <div v-if="status=='node-selected'">
        <div class="pannel-title">节点属性</div>
        <div class="block-container">
          <el-form label-width="68px">
            <el-form-item class="node-id" label="节点ID">
              <el-input disabled :value="node.id" />
            </el-form-item>
            <el-form-item label="节点名称">
              <el-input
                v-model="node.activityName"
                placeholder="请输入节点名称"
                @change="handleChangeName"
              />
            </el-form-item>
            <el-form-item label="节点描述">
              <el-input
                v-model="node.activityDepict"
                type="textarea"
                :rows="4"
                placeholder="请输入节点描述，如：申请节点、审核节点"
              ></el-input>
            </el-form-item>
            <template v-if="node.activityNodeType!='jarNode'&&node.activityNodeType!='endNode'">
              <el-form-item label="接收规则" v-if="node.activityNodeType!='startNode'">
                <el-select v-model="node.activityAccept" placeholder="请选择接收规则" clearable>
                  <el-option
                    v-for="item in accept"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="运行规则">
                <el-select v-model="node.activityRun" placeholder="请选择运行规则" clearable>
                  <el-option
                    v-for="item in running"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
      <div v-if="status=='edge-selected'" class="pannel">
        <div class="pannel-title">
          方向条件设置
          <div class="term-button">
            <el-button
              plain
              size="mini"
              icon="el-icon-plus"
              @click="additems(0)"
              v-if="termLists.length===0"
            >创建条件</el-button>
          </div>
        </div>
        <div class="block-container">
          <!-- 渲染条件列表 -->
          <section
            ref="termLists"
            class="term-panel"
            v-for="(value, index) in termLists"
            :key="index"
          >
            <!-- <el-tag
              effect="plain"
              class="term-tag el-icon-sort"
              size="medium"
              type="info"
              v-if="index>0"
            >{{value.termType=="and"?"AND":"OR"}}</el-tag>-->
            <el-card shadow="never" class="term-card">
              <div slot="header" class="term-header">
                <span class="term-number">条件定义</span>
                <el-button
                  plain
                  class="term-delete"
                  style="float: right; padding: 5px"
                  icon="el-icon-delete"
                  @click="rmitems(index)"
                >删除</el-button>
              </div>
              <el-form label-width="85px">
                <el-form-item label="条件名称">
                  <el-select
                    v-model="value.id"
                    placeholder="请选择条件名称"
                    clearable
                    @change="handleSaveCase"
                  >
                    <el-option
                      v-for="item in dataObj"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="逻辑表达式">
                  <el-select
                    :disabled="value.id==''"
                    v-model="value.logic"
                    placeholder="请选择逻辑表达式"
                    clearable
                    @change="handleSaveCase"
                    v-if="value.fieldType=='boolean'||value.fieldType=='varchar'"
                  >
                    <el-option
                      v-for="item in logicExpress.filter(item => item.use == 'all')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-select
                    :disabled="value.id==''"
                    v-model="value.logic"
                    placeholder="请选择逻辑表达式"
                    clearable
                    @change="handleSaveCase"
                    v-else
                  >
                    <el-option
                      v-for="item in logicExpress.filter(item => item.use != '')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="value.fieldType=='boolean'" label="值">
                  <el-select
                    :disabled="value.id==''"
                    v-model="value.value"
                    placeholder="请选择条件的值"
                    clearable
                    @change="handleSaveCase"
                  >
                    <el-option
                      v-for="item in flag"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-else label="值">
                  <el-input
                    :disabled="value.id==''"
                    v-model="value.value"
                    placeholder="请输入条件的值"
                    clearable
                    @change="handleSaveCase"
                  />
                </el-form-item>
                <!-- <el-form-item label="条件类型">
                  <el-radio-group v-model="value.termType" size="mini" @change="additems(index)">
                    <el-radio-button label="and">AND</el-radio-button>
                    <el-radio-button label="or">OR</el-radio-button>
                  </el-radio-group>
                </el-form-item>-->
              </el-form>
            </el-card>
          </section>
        </div>
      </div>
      <div v-if="status==='canvas-selected'" class="pannel">
        <div class="pannel-title">流程信息</div>
        <div class="block-container">
          <el-form label-width="68px">
            <el-form-item label="流程名称">
              <el-input v-model="flow.flowName" placeholder="请输入流程名称" @change="handleFlowName" />
            </el-form-item>
            <el-form-item label="流程类型">
              <span>审核流程</span>
            </el-form-item>
            <el-form-item label="流程描述">
              <el-input
                v-model="flow.flowDepict"
                type="textarea"
                :rows="6"
                placeholder="请输入流程描述"
                @change="handleFlowDesc"
              />
            </el-form-item>
            <el-form-item label="数据对象">
              <el-button plain size="mini" plian icon="el-icon-edit" @click="handleDataObject">编辑</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="pannel-title">画布</div>
        <div class="block-container">
          <el-checkbox v-model="showGrid" @change="changeGridState">显示网格</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "../../utils/eventBus";
import Grid from "@antv/g6/build/grid";
import { isObjHasNull, uniqueId } from "../../utils";
export default {
  data() {
    return {
      status: "canvas-selected",
      showGrid: true,
      page: {},
      graph: {},
      item: {},
      flow: {},
      node: {},
      edge: {},
      grid: null,
      showDataObject: false,
      termLists: [], // 条件集合
      dataObj: [],
      accept: [
        {
          value: "all",
          label: "所有人"
        },
        {
          value: "role",
          label: "角色"
        },
        {
          value: "dept",
          label: "部门"
        }
      ],
      running: [
        {
          value: "user",
          label: "操作员执行"
        },
        {
          value: "machine",
          label: "机器执行"
        }
      ],
      logicExpress: [
        {
          use: "num",
          value: ">",
          label: "大于"
        },
        {
          use: "num",
          value: "<",
          label: "小于"
        },
        {
          use: "all",
          value: "=",
          label: "等于"
        },
        {
          use: "num",
          value: ">=",
          label: "大于等于"
        },
        {
          use: "num",
          value: "<=",
          label: "小于等于"
        },
        {
          use: "all",
          value: "!=",
          label: "不等于"
        }
      ],
      fieldType: [
        {
          value: "int",
          desc: "年龄、个数",
          label: "整数"
        },
        {
          value: "float",
          desc: "单价、薪水",
          label: "小数"
        },
        {
          value: "varchar",
          desc: "姓名、地址",
          label: "字符"
        },
        {
          value: "boolean",
          desc: "完成、达标",
          label: "布尔(是/否)"
        }
      ],
      flag: [
        {
          value: "true",
          label: "是"
        },
        {
          value: "false",
          label: "否"
        }
      ]
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  methods: {
    init() {},
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
        eventBus.$on("nodeselectchange", item => {
          if (item.select === true && item.target.getType() === "node") {
            self.status = "node-selected";
            self.item = item.target;
            self.node = item.target.getModel();
          } else if (item.select === true && item.target.getType() === "edge") {
            this.termLists = [];
            self.status = "edge-selected";
            self.item = item.target;
            self.edge = item.target.getModel();
            if (self.edge.attribute.length > 0) {
              this.termLists = self.edge.attribute;
            }
          } else {
            self.status = "canvas-selected";
            self.item = null;
            self.node = null;
          }
        });
        this.changeGridState(true);
      });
      eventBus.$on("saveDataObj", data => {
        this.dataObj = data;
      });
    },
    handleChangeName(e) {
      const model = {
        label: e
      };
      this.graph.update(this.item, model);
    },
    handleSaveCase(e) {
      eventBus.$emit("saveCase", this.termLists);
      const model = {
        attribute: this.termLists
      };
      this.graph.update(this.item, model);
    },
    handleFlowName() {
      eventBus.$emit("flownamechange", this.flow.flowName);
    },
    handleFlowDesc() {
      eventBus.$emit("flowdescchange", this.flow.flowDepict);
    },
    handleDataObject() {
      eventBus.$emit("showDataObj", true);
    },
    changeGridState(value) {
      if (value) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    },
    additems(index) {
      const item = this.termLists[index];
      if (item && isObjHasNull(item)) {
        this.$message({
          showClose: true,
          message: "请先填写完一项后再继续追加",
          type: "warning",
          duration: 1500
        });
        item.termType = "";
        return;
      } else if (index !== 0) {
        return;
      } else {
        this.termLists.unshift({
          id: "",
          logic: "",
          value: ""
        });
      }
    },
    rmitems(index) {
      if (index > this.termLists.length - 1) {
        this.termLists[index - 1].termType = "";
      } else if (index < this.termLists.length - 1) {
        this.termLists[index + 1].termType = "";
      }
      this.termLists.splice(index, 1);
      // this.$message.success({
      //   showClose: true,
      //   message: "删除成功",
      //   type: "success",
      //   duration: 1500
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 349px;
  overflow: auto;
  border-left: 1px solid #e6e9ed;
}
.detailpannel .block-container {
  padding: 16px 12px;
}
.block-container .el-col {
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.pannel-title {
  position: relative;
  height: 40px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  box-sizing: border-box;
  line-height: 40px;
  padding-left: 12px;
}
.node-id {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.term-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
}
.term-tag {
  width: 70px;
  text-align: center;
  margin: 10px auto;
  display: block;
}
.term-header {
  position: relative;
  padding-left: 6px;
}
.term-delete {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
<style lang="scss">
.term-card .el-card__header {
  height: 40px !important;
  line-height: 40px !important;
  padding: 0px !important;
}
.term-card .el-card__body {
  padding: 12px !important;
}
</style>
