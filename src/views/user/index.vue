<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：通过本地用户管理，可实现用户组的创建、编辑、删除，并可以在用户组下实现用户的创建、编辑、删除，同时为用户组绑定镜像。"
      type="info"
      show-icon>
    </el-alert>
    <div class="filter-container" style="margin-top: 10px;">
      <el-button type="slateblue" class="filter-item" @click.native="groupDialogShow=true">添加组</el-button>
      <el-button type="slateblue" class="filter-item">删除组</el-button>
      <el-input model="listQuery.userName" class="filter-item" style="width: 250px;"
                placeholder="请输入用户名、姓名、用户组名称"></el-input>
      <el-button type="slateblue" class="filter-item" icon="el-icon-search">查询</el-button>
      <el-button type="slateblue" class="filter-item" @click.native="userDialogShow=true">添加用户</el-button>
      <el-button type="slateblue" class="filter-item" @click.native="deleteUser">删除用户</el-button>
      <el-dropdown class="filter-item fr" @command="handleCommand">
        <el-button type="slateblue">
          更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">批量导入</el-dropdown-item>
          <el-dropdown-item command="b">重置密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="tree_container">
          <div class="header_title">
            <p style="font-weight: normal">
              <span class="fl" style="font-size: 24px;color: #999">组织图</span>
              <span class="fr">
                  <el-button icon="el-icon-plus" size="mini"></el-button>
                  <el-button icon="el-icon-edit" size="mini"></el-button>
                  <el-button icon="el-icon-delete" size="mini"></el-button>
              </span>
            </p>
            <div style="clear: both"></div>
          </div>
          <el-tree :data="treeData" :props="defaultProps" class="group_tree" @current-change="currentChange"
                   show-checkbox default-expand-all
                   :highlight-current="true"></el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content">
          <el-table :data="items" v-loading="listLoading" border fit highlight-current-row
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>
            <el-table-column align="center" label="用户名" width="100" prop="userName">
            </el-table-column>
            <el-table-column align="center" label="姓名" width="100" prop="name">
            </el-table-column>
            <el-table-column align="center" label="所在用户组" min-width="100" prop="groupname">
            </el-table-column>
            <el-table-column align="center" label="已绑定终端" width="150" prop="termname">
            </el-table-column>
            <el-table-column align="center" label="云盘空间" width="100" prop="space">
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="180" prop="createtime">
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="userDialogShow=true">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-pagination v-if="items.length" align="right" @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page.sync="listQuery.pageNo"
                         :page-sizes="[5,10,20,30,50]" :page-size="listQuery.pageSize"
                         layout="total, sizes, prev, pager, next" :total="items.length">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      width="500"
      title="重置密码"
      append-to-body
      custom-class="resetPasswordDialog defineDialog"
      :visible.sync="resetPasswordDialogShow">
      <el-form class="small-space" :model="resetQuery" label-position="left" :rules="rules" ref="resetPasswordForm"
               label-width="100px">
        <el-form-item label="管理员密码" prop="old_password">
          <el-input v-model="resetQuery.old_password"></el-input>
        </el-form-item>
        <el-form-item label="更新密码" prop="new_password">
          <el-input v-model="resetQuery.new_password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="r_password">
          <el-input v-model="resetQuery.r_password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button @click.native="resetF" plain>关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500"
      :title="groupTitle"
      custom-class="groupDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="groupDialogShow">
      <el-form class="small-space" :model="groupQuery" label-position="left" :rules="group_rules" ref="groupQueryForm"
               label-width="100px">
        <el-form-item label="用户组名称" prop="name">
          <el-input v-model="groupQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="上级用户组" prop="groupId">
          <el-select v-model="groupQuery.groupId" style="width: 100%"></el-select>
        </el-form-item>
        <el-form-item label="绑定镜像" prop="terminal">
          <el-select v-model="groupQuery.terminal" style="width: 100%"></el-select>
        </el-form-item>
        <el-form-item label="外设策略" prop="terminal" class="s_item">
          <span> (勾选表示启用，不勾选表示禁用)</span>
        </el-form-item>
        <el-form-item class="s_cgroup">
          <el-checkbox-group v-model="groupQuery.checkList">
            <el-checkbox label="输入设备"></el-checkbox>
            <el-checkbox label="存储设备"></el-checkbox>
            <el-checkbox label="摄像设备"></el-checkbox>
            <el-checkbox label="办公设备"></el-checkbox>
            <el-checkbox label="音频设备"></el-checkbox>
            <el-checkbox label="手机"></el-checkbox>
            <el-checkbox label="其他设备"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="用户组描述" prop="desc">
          <el-input v-model="groupQuery.desc" type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="500"
      :title="userTitle"
      custom-class="userDialog defineDialog"
      append-to-body
      top="5vh"
      :visible.sync="userDialogShow">
      <el-form class="small-space" :model="userQuery" label-position="left" :rules="user_rules" ref="UserQueryForm"
               label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userQuery.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userQuery.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="员工编号" prop="cardId">
          <el-input v-model="userQuery.cardId"></el-input>
        </el-form-item>
        <el-form-item label="用户组" prop="group">
          <!--<el-tree :data="treeData" :props="defaultProps"-->
          <!--accordion node-key="id"-->
          <!--show-checkbox-->
          <!--:default-expanded-keys="[2, 3]"-->
          <!--:default-checked-keys="[5]"></el-tree>-->
          <el-cascader
            :options="options"
            change-on-select
            clearable
            placeholder="请选择用户组"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" style="width:48%;display: inline-block">
          <el-input v-model="userQuery.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="width:48%;display: inline-block">
          <el-input v-model="userQuery.desc"></el-input>
        </el-form-item>
        <el-form-item prop="email" style="margin-bottom: 0">
          <el-checkbox v-model="userQuery.checked">是否需要配置个人云盘</el-checkbox>
        </el-form-item>
        <el-form-item class="s">
          <p>1、个人云盘容量勾选则自动配置40G云盘，不选则不配置;</p>
          <p>2、个人云盘默认下载速度为1MB/S.</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postActionUser">提 交</el-button>
        <el-button type="slateblue" @click.native="resetFUser">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="批量导入用户"
      :visible.sync="ExportShow"
      custom-class="ExportDialog defineDialog"
      top="5vh"
      :before-close="handleClose">
      <span>选择要导入的Excel文件</span><a style="margin-left: 15px;color: #2795d5">点击下载模板</a><br>
      <!--<el-input type="text"></el-input>-->
      <!--<el-upload-->
      <!--class="upload"-->
      <!--ref="upload"-->
      <!--action="https://jsonplaceholder.typicode.com/posts/"-->
      <!--:on-preview="handlePreview"-->
      <!--:show-file-list="false"-->
      <!--:on-remove="handleRemove"-->
      <!--:file-list="fileList"-->
      <!--:before-upload="beforeUpload"-->
      <!--:auto-upload="false">-->
      <!--<el-button slot="trigger" size="small" type="primary">浏览</el-button>-->
      <!--</el-upload>-->
      <uploader :options="UploadOptions" class="uploader" :file-status-text="statusText" ref="uploader"
                @file-complete="fileComplete" @complete="complete" :autoStart="false">
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <p style="text-indent: 0">将文件拖到此处，或
            <uploader-btn>选择文件</uploader-btn>
          </p>
          <!--<uploader-btn :attrs="attrs">选择图片</uploader-btn>-->
          <!--<uploader-btn :directory="true">选择文件夹</uploader-btn>-->
        </uploader-drop>
        <uploader-list></uploader-list>
      </uploader>
      <div style="display: block;margin-top: 10px;">
        <span>遇到重复记录:</span>
        <el-radio v-model="radio" label="1">跳过</el-radio>
        <el-radio v-model="radio" label="2">覆盖</el-radio>
      </div>
      <!--<div style="margin-top: 10px;display: block">-->
      <!--<span>批量导入说明：</span>-->
      <!--　　<p>-->
      <!--导入完成，显示Excel中所有用户数据，被成功处理和失败处理的条数，如果全部成功，弹出框方式显示成功处理的总条数；如果有失败处理的记录，弹出框方式显示成功和失败的条数。管理员可下载失败日志，查看处理失败的用户数据。</p>-->
      <!--　　<p>-->
      <!--当导入过程中，出现Excel里的某条用户数据与系统已有用户数据重复时，若您选择的是“跳过”，则不会改变该条已有的用户数据信息；若选择的是“覆盖”，则系统将会更新该条用户数据信息，该用户之前在系统中的数据将不做任何保留。判断用户重复的标准是用户名是否相同，是否为同一用户的判断标准是用户名是否一致。</p>-->
      <!--　　<p>导入用户数据过程中遇到系统中未填写用户所在用户组时，系统将自动创建该用户组，并将用户置于该用户组下；导入的Excel里未填写用户组时，默认将用户自动添加到“根节点”下。</p>-->
      <!--</div>-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="ExportShow = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">开始导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import * as user from '@/api/user'

  export default {
    data() {
      return {
        resetQuery: {},
        resetPasswordDialogShow: false,
        rules: {},
        fileList: [],
        ExportShow: false,
        listLoading: false,
        groupTitle: '添加用户组',
        userTitle: '添加用户',
        groupDialogShow: false,
        userDialogShow: false,
        groupQuery: {},
        radio: '1',
        userQuery: {
          checked: false
        },
        statusText: {
          success: '成功了',
          error: '出错了',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        },
        UploadOptions: {
          target: '//localhost:3000/upload',
          testChunks: false
        },
        deleteAction(t) {

        },
        autoStart: false,
        attrs: {
          accept: 'image/*'
        },
        options: [
          {
            value: 'zhinan',
            label: '用户组1',
            children: [
              {
                value: 'shejiyuanze',
                label: 'XXX组',
                children: [
                  {
                    value: 'yizhi',
                    label: 'XXX组'
                  }
                ]
              }
            ]
          },
          {
            value: 'zujian',
            label: '用户组2',
            children: [
              {
                value: 'basic',
                label: 'XXX组',
                children: [
                  {
                    value: 'layout',
                    label: 'XXX组'
                  }
                ]
              }
            ]
          }
        ],
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          userName: '',
          userId: ''
        },
        group_rules: {},
        user_rules: {},
        items: [],
        total: 0,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        multipleSelection: []
      }
    },
    methods: {
      deleteUser() {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'error',
            message: '请选择需要删除的用户!'
          })
          return
        }
        this.$confirm(`您已选中${this.multipleSelection.length}个用户，确认删除？此动作不能撤销。`, '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const userids = []
          this.multipleSelection.forEach(m => {
            userids.push(m.userid)
          })
          user.postUserDel({ userids }).then((res) => {
            if (res.data.res === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除用户失败!'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      submitUpload() {
        const uploader = this.$refs.uploader.uploader
        console.log(uploader)
        const h = this.$createElement
        this.$msgbox({
          title: '消息',
          message: h('p', null, [
            h('span', null, '操作完成，成功笔数：100；失败笔数：2 '),
            h('i', { style: 'color: teal' }, '')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              done()
              instance.confirmButtonLoading = false
            } else {
              done()
            }
          }
        }).then(action => {
        })
      },
      complete() {
        console.log('complete', arguments)
      },
      fileComplete() {
        console.log('file complete', arguments)
      },
      // beforeUpload(file) {
      //   console.log(file.type)
      // },
      // submitUpload() {
      //   this.$refs.upload.submit()
      // },
      // handleRemove(file, fileList) {
      //   console.log(file, fileList)
      // },
      // handlePreview(file) {
      //   console.log(file)
      // },
      handleCommand(command) {
        if (command === 'a') {
          this.ExportShow = true
        } else {
          this.resetPasswordDialogShow = true
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭？').then(_ => {
          done()
        }).catch(_ => {})
      },
      handleSelectionChange(v) {
        this.multipleSelection = v
      },
      postAction() {},
      postActionUser() {},
      resetF() {},
      resetFUser() {},
      handleCurrentChange(v) {
        this.listQuery.pageNo = v
      },
      handleSizeChange(v) {
        this.listQuery.pageSize = v
      },
      remove(node) {
        console.log(node)
      },
      currentChange(node, obj) {
        console.log(node)
        user.getUserList({ groupid: node.groupid }).then(res => {
          if (res.data.res === 0) {
            this.items = res.data.users
            this.total = this.items.length
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      },
      getCompanyTree() {
        user.getUserGroupList().then(res => {
          if (res.data.res === 0) {
            this.treeData = res.data.children
          }
        })
      }
    },
    created() {
      this.getCompanyTree()
    }
  }
</script>
<style lang="scss" scoped>
  .el-tree {
    padding: 5px;
    min-height: 150px;
    border: 1px #ccc solid;
    overflow-x: hidden;
    &.group_tree {
      min-height: 150px;
      max-height: 500px;
    }
  }

  .s_item {
    label {
      width: 100% !important;
    }
  }

  .s_cgroup {
    .el-checkbox {
      margin-left: 10px;
    }
  }

  .uploader {
    width: 100%;
    padding: 15px;
    /*margin: 40px auto 0;*/
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    .uploader-btn {
      margin-right: 4px;
    }
    .uploader-list {
      max-height: 440px;
      overflow: auto;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .tree_container {
    .header_title {
      margin-bottom: 5px;
      .el-button {
        border: none;
      }
    }
  }
</style>
