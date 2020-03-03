<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor">
      <!--toolbar-->
      <toolbar />
      <div style="height: 42px;"></div>
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel />
        <!--miniMap-->
        <!-- <minimap /> -->
        <!--detailpannel-->
        <detail-panel />
        <!--page-->
        <page :height="height" :width="width" />
      </div>
    </div>
    <Flow />
    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handlePreviewClose"
    >
      <preview :height="height" :width="width" :data="data" />
      <span slot="footer" class="dialog-footer">
        <el-button plian @click="handlePreviewClose">返 回</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="数据对象"
      :visible.sync="dataObjVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handleDataClose"
    >
      <el-table class="objDataTable" :data="objData">
        <el-table-column property="name" label="名称">
          <template slot-scope="scope">
            <el-input :disabled="!scope.row.editing" v-model="scope.row.name" placeholder="数据名称"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="type" label="类型" width="200">
          <template slot-scope="scope">
            <el-select
              :disabled="!scope.row.editing"
              v-model="scope.row.type"
              placeholder="数据类型"
              clearable
            >
              <el-option
                v-for="item in fieldType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.desc }}</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <template v-if="scope.row.editing==true">
              <el-tooltip class="item" effect="dark" content="完成" placement="top" :hide-after="750">
                <span @click="handleDone(scope.$index, scope.row)">
                  <i class="el-icon-check"></i>
                </span>
              </el-tooltip>
            </template>
            <template v-if="scope.row.editing==false">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top" :hide-after="750">
                <span @click="handleEdit(scope.$index, scope.row)">
                  <i class="el-icon-edit"></i>
                </span>
              </el-tooltip>
            </template>
            <template v-if="scope.row.allow==false">
              <el-divider direction="vertical"></el-divider>
              <el-tooltip class="item" effect="dark" content="删除" placement="top" :hide-after="750">
                <span @click="handleDelete(scope.$index, scope.row)">
                  <i class="el-icon-delete"></i>
                </span>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button plain icon="el-icon-plus" @click="addNew" :disabled="adding">添加数据</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveDataObj">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Toolbar from "../Toolbar";
import ItemPanel from "../ItemPanel";
import DetailPanel from "../DetailPanel";
import Minimap from "../Minimap";
import Page from "../Page";
import Preview from "../Preview";
import Flow from "../Flow";
import Editor from "../../components/Base/Editor";
import command from "../../command";
import eventBus from "../../utils/eventBus";
import { uniqueId } from "../../utils";
export default {
  name: "VuePocessEditor",
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Minimap,
    Page,
    Flow,
    Preview
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    }
  },
  created() {
    this.init();
    this.bindEvent();
  },
  data() {
    return {
      data: {},
      editor: {},
      objData: [],
      termLists: [],
      command: null,
      adding: false,
      previewVisible: false,
      dataObjVisible: false,
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
          label: "布尔"
        }
      ]
    };
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
    },
    //添加行数
    addNew() {
      let newValue = {
        id: uniqueId("dataObj"),
        name: "",
        type: "",
        editing: true,
        allow: false
      };
      //添加新的行数
      this.objData.push(newValue);
      this.adding = true;
    },
    // 编辑行
    handleEdit(index, row) {
      row.editing = true;
      this.adding = true;
    },
    // 完成编辑行
    handleDone(index, row) {
      this.objData.some((element, eleIndex) => {
        if (element.name == "") {
          this.$message.warning({
            showClose: true,
            message: "请填写数据名称",
            duration: 1500
          });
          return true;
        } else if (element.name == row.name && index !== eleIndex) {
          this.$message.warning({
            showClose: true,
            message: "数据类型项不能重复",
            duration: 1500
          });
          return true;
        } else if (element.type == "") {
          this.$message.warning({
            showClose: true,
            message: "请选择数据类型",
            duration: 1500
          });
          return true;
        } else {
          element.editing = false;
          this.adding = false;
        }
      });
    },
    //删除行数
    handleDelete(index) {
      if (
        this.termLists.filter(item => item.id == this.objData[index].id)
          .length >= 1
      ) {
        this.$message.warning({
          showClose: true,
          message: "该数据项正在使用中，无法删除",
          duration: 1500
        });
        return;
      } else {
        this.objData.splice(index, 1);
        this.adding = false;
      }
    },
    bindEvent() {
      eventBus.$on("showpreview", data => {
        this.dialogVisible = true;
        this.data = data;
      });
      eventBus.$on("showDataObj", isShow => {
        this.dataObjVisible = isShow;
      });
      eventBus.$on("saveCase", data => {
        this.termLists = data;
      });
    },
    saveDataObj() {
      this.handleDataClose();
      this.objData.forEach((element, index) => {
        if (element.name == "" || element.type == "") {
          this.handleDelete(index);
        } else {
          element.editing = false;
        }
      });
      eventBus.$emit("saveDataObj", this.objData);
    },
    handlePreviewClose() {
      this.data = {};
      this.dialogVisible = false;
    },
    handleDataClose() {
      this.dataObjVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.objDataTable {
  i {
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.objDataTable .el-dialog__body {
  padding: 20px !important;
}
.objDataTable .el-table__row {
  height: 60px !important;
}
</style>
