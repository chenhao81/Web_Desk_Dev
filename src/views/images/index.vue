<!--<template>-->
<!--<div class="app-container">-->
<!--<div class="text-center">-->
<!--<org-tree-->
<!--:data="data"-->
<!--:horizontal="horizontal"-->
<!--:collapsable="collapsable"-->
<!--:label-class-name="labelClassName"-->
<!--:render-content="renderContent"-->
<!--@on-expand="onExpand"-->
<!--@on-node-click="onNodeClick"-->
<!--&gt;-->
<!--</org-tree>-->
<!--</div>-->
<!--</div>-->
<!--</template>-->
<!--<script>-->
<!--import OrgTree from './tree/tree'-->

<!--export default {-->
<!--name: 'app',-->
<!--components: {-->
<!--OrgTree-->
<!--},-->
<!--data() {-->
<!--return {-->
<!--data: {-->
<!--id: 0,-->
<!--label: '镜像概览',-->
<!--children: [-->
<!--{-->
<!--id: 2,-->
<!--label: '镜像1',-->
<!--showAction: false,-->
<!--children: [-->
<!--{-->
<!--id: 5,-->
<!--label: '镜像2',-->
<!--showAction: false,-->
<!--children: [-->
<!--{-->
<!--id: 5,-->
<!--label: '镜像2',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 6,-->
<!--label: '镜像3',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 9,-->
<!--label: '镜像4',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 10,-->
<!--label: '镜像5',-->
<!--showAction: false-->
<!--}-->
<!--]-->
<!--},-->
<!--{-->
<!--id: 6,-->
<!--label: '镜像3',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 9,-->
<!--label: '镜像4',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 10,-->
<!--label: '镜像5',-->
<!--showAction: false-->
<!--}-->
<!--]-->
<!--},-->
<!--{-->
<!--id: 3,-->
<!--label: '镜像6',-->
<!--showAction: false,-->
<!--children: [-->
<!--{-->
<!--id: 7,-->
<!--label: '镜像7',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 8,-->
<!--label: '镜像8',-->
<!--showAction: false-->
<!--}-->
<!--]-->
<!--},-->
<!--{-->
<!--id: 4,-->
<!--label: '镜像9',-->
<!--showAction: false,-->
<!--children: [-->
<!--{-->
<!--id: 5,-->
<!--label: '镜像2',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 6,-->
<!--label: '镜像3',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 9,-->
<!--label: '镜像4',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 10,-->
<!--label: '镜像5',-->
<!--showAction: false-->
<!--}-->
<!--]-->
<!--},-->
<!--{-->
<!--id: 9,-->
<!--label: '镜像10',-->
<!--showAction: false,-->
<!--children: [-->
<!--{-->
<!--id: 5,-->
<!--label: '镜像2',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 6,-->
<!--label: '镜像3',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 9,-->
<!--label: '镜像4',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 10,-->
<!--label: '镜像5',-->
<!--showAction: false,-->
<!--children: [-->
<!--{-->
<!--id: 5,-->
<!--label: '镜像2',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 6,-->
<!--label: '镜像3',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 9,-->
<!--label: '镜像4',-->
<!--showAction: false-->
<!--},-->
<!--{-->
<!--id: 10,-->
<!--label: '镜像5',-->
<!--showAction: false-->
<!--}-->
<!--]-->
<!--}-->
<!--]-->
<!--}-->
<!--]-->
<!--},-->
<!--horizontal: true,-->
<!--collapsable: false,-->
<!--labelClassName: 'bg-white'-->
<!--}-->
<!--},-->
<!--methods: {-->
<!--renderContent(h, data) {-->
<!--return data.label-->
<!--},-->
<!--onExpand(data) {-->
<!--if ('expand' in data) {-->
<!--data.expand = !data.expand-->

<!--if (!data.expand && data.children) {-->
<!--this.collapse(data.children)-->
<!--}-->
<!--} else {-->
<!--this.$set(data, 'expand', true)-->
<!--}-->
<!--},-->
<!--onNodeClick(e, data) {-->
<!--alert(data.label)-->
<!--},-->
<!--collapse(list) {-->
<!--list.forEach(child => {-->
<!--if (child.expand) {-->
<!--child.expand = false-->
<!--}-->
<!--child.children && this.collapse(child.children)-->
<!--})-->
<!--}-->
<!--}-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.bg-white {-->
<!--background-color: white;-->
<!--}-->

<!--.bg-orange {-->
<!--background-color: orange;-->
<!--}-->

<!--.bg-gold {-->
<!--background-color: gold;-->
<!--}-->

<!--.bg-gray {-->
<!--background-color: gray;-->
<!--}-->

<!--.bg-lightpink {-->
<!--background-color: lightpink;-->
<!--}-->

<!--.bg-chocolate {-->
<!--background-color: chocolate;-->
<!--}-->

<!--.bg-tomato {-->
<!--background-color: tomato;-->
<!--}-->
<!--</style>-->
<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：管理和维护镜像。"
      type="info"
      show-icon>
    </el-alert>
    <div class="filter-container" style="margin-top: 10px;">
      <el-input v-model="listQuery.searchCode" class="filter-item" style="width: 150px;"
                placeholder="请输入镜像名称"></el-input>
      <el-button type="slateblue" class="filter-item" icon="el-icon-search" @click="searchImageList">查询
      </el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="deleteAll" icon="el-icon-delete">删除</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="addImage(1,{})" icon="el-icon-plus">添加
      </el-button>
    </div>
    <el-table :data="items" v-loading="listLoading" border fit highlight-current-row
              @selection-change="handleSelectionChange"
              style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="镜像名称" width="150" prop="name">
      </el-table-column>
      <el-table-column align="center" label="是否主镜像" width="100" prop="primary ">
        <template slot-scope="scope">
          <span>{{ scope.row.primary  | filterisMain }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="镜像文件" width="150" prop="file">
      </el-table-column>
      <el-table-column align="center" label="操作系统" width="150" prop="os">
      </el-table-column>
      <el-table-column align="center" label="镜像类型" width="150" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type | filterType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="绑定用户组" min-width="150" prop="groups">
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="200" prop="desc">
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click.native="addImage(2,scope.row)">编辑</el-button>
          <el-button type="text" @click.native="copyDialogShow=true">复制</el-button>
          <el-button type="text">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="items.length" class="pagination-container fr">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="items.length">
      </el-pagination>
    </div>
    <el-dialog
      width="500"
      :title="imageQuery.imageTitle"
      custom-class="imageDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="imageDialogShow">
      <el-form class="small-space" :model="imageQuery" label-position="left" :rules="image_rules"
               ref="imageQueryForm"
               label-width="100px">
        <el-form-item label="镜像名称" prop="name">
          <el-input v-model="imageQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="镜像文件" prop="file">
          <el-select v-model="imageQuery.file" style="width: 100%">
            <el-option
              v-for="item in FileList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统" prop="os">
          <el-select v-model="imageQuery.os" style="width: 100%">
            <el-option value="Windows 10" label="Windows 10"></el-option>
            <el-option value="Windows 7 32位" label="Windows 7 32位"></el-option>
            <el-option value="Windows 7 64位" label="Windows 7 64位"></el-option>
            <el-option value="Windows XP" label="Windows XP"></el-option>
            <el-option value="Linux" label="Linux"></el-option>
            <el-option value="其他" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镜像类型" prop="type">
          <el-select v-model="imageQuery.type" style="width: 100%">
            <el-option :value="item.value" :label="item.label" v-for="item in typeOptions"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="is_primary">
          <el-checkbox v-model="imageQuery.is_primary">设置为主镜像</el-checkbox>
          <p>（主镜像为终端默认下载的镜像，唯一且可修改）</p>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="imageQuery.desc" type="text" placeholder="请填写镜像备注，不超过25个字符"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500"
      title="复制镜像"
      custom-class="imageDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="copyDialogShow">
      <el-form class="small-space" :model="copyQuery" label-position="left" :rules="copy_rules"
               ref="copyQueryForm"
               label-width="100px">
        <el-form-item label="镜像名称" prop="name">
          <el-input v-model="copyQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="镜像文件" prop="file">
          <span>Window7_64.vdi</span>
          <!--<el-select v-model="imageQuery.file" style="width: 100%"></el-select>-->
        </el-form-item>
        <el-form-item label="操作系统" prop="system">
          <el-select v-model="copyQuery.system" style="width: 100%"></el-select>
        </el-form-item>
        <el-form-item label="镜像类型" prop="type">
          <el-select v-model="copyQuery.type" style="width: 100%">
            <el-option :value="item.value" :label="item.label" v-for="item in typeOptions"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postActionCopy">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import * as image from '@/api/Image'

  export default {
    data() {
      return {
        listLoading: false,
        imageDialogShow: false,
        copyDialogShow: false,
        imageQuery: {
          imageTitle: '添加镜像'
        },
        copyQuery: {},
        image_rules: {},
        copy_rules: {},
        total: 0,
        listQuery: {
          searchCode: '',
          pageNo: 1,
          pageSize: 10
        },
        multipleSelection: [],
        items: [],
        FileList: [],
        typeOptions: [
          {
            value: 0,
            label: '个性化'
          },
          {
            value: 1,
            label: '还原'
          }
        ]
      }
    },
    created() {
      this.getImageList()
    },
    methods: {
      getImageFileList() {
        image.getFileList().then(res => {
          if (res.data.res === 0) {
            this.FileList = res.data.files
          }
        })
      },
      searchImageList() {
        const query = Object.assign({}, this.listQuery)
        console.log(query)
        image.searchList(query).then(res => {
          console.log('searchList:')
          console.log(res)
          if (res.data.res === 0) {
            this.items = res.data.images
            console.log(this.items)
          }
        })
      },
      getImageList() {
        image.getList().then(res => {
          console.log(res)
          if (res.data.res === 0) {
            this.items = res.data.images
            console.log(this.items)
          }
        })
      },
      postAction() {
        let _fn = image.postImageAdd
        if (this.imageQuery.imageTitle === '编辑镜像') _fn = image.postImageEdit
        const query = Object.assign({}, this.imageQuery)
        console.log(query)
        _fn(query).then(res => {
          if (res.data.res === 0) {
            this.imageDialogShow = false
            this.refresh()
            this.$message({
              type: 'success',
              message: `${this.imageQuery.imageTitle}成功!`
            })
          }
        })
      },
      postActionCopy() {
        image.postImageCopy().then(res => {
          if (res.data.res === 0) {
            this.$message({
              type: 'success',
              message: '复制成功!'
            })
          }
        })
      },
      resetF() {
        this.imageDialogShow = false
      },
      handleCurrentChange(v) {
        this.listQuery.pageNo = v
        this._search()
      },
      handleSizeChange(v) {
        this.listQuery.pageSize = v
        this._search()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      refresh() {
        this.searchImageList()
      },
      deleteAll() {
        var query = { 'uuids': [] }
        for (var j = 0, len = this.multipleSelection.length; j < len; j++) {
          query.uuids.push(this.multipleSelection[j].uuid)
        }
        this.$confirm('您已选中' + len + '个镜像，确认删除？此动作不能撤销。', '删除镜像', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          image.postImageDel(query).then(() => {
            this.refresh()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addImage(v, obj) {
        console.log(obj)
        this.imageQuery = Object.assign({}, obj)
        this.imageQuery.imageTitle = '添加镜像'
        if (v === 2) {
          this.imageQuery.imageTitle = '编辑镜像'
        }
        this.imageDialogShow = true
        this.getImageFileList()
      }
    },
    filters: {
      filterisMain(t) {
        const map = {
          1: 'Y',
          0: 'N'
        }
        return map[t]
      },
      filterType(v) {
        const map = {
          0: '个性化',
          1: '还原'
        }
        return map[v]
      }
    }
  }
</script>
