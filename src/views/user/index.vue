<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：通过本地用户管理，可实现用户组的创建、编辑、删除，并可以在用户组下实现用户的创建、编辑、删除，同时为用户组绑定镜像。"
      type="info"
      show-icon>
    </el-alert>
    <div class="filter-container" style="margin-top: 10px;">
      <el-button type="slateblue" class="filter-item" @click.native="editGroup(1)">添加组</el-button>
      <el-button type="slateblue" class="filter-item" @click="deleteGroup">删除组</el-button>
      <el-input model="listQuery.userName" class="filter-item" style="width: 250px;"
                placeholder="请输入用户名、姓名、用户组名称"></el-input>
      <el-button type="slateblue" class="filter-item" icon="el-icon-search">查询</el-button>
      <el-button type="slateblue" class="filter-item" @click.native="editUser({})">添加用户</el-button>
      <el-button type="slateblue" class="filter-item" @click.native="deleteAction(2,{})">删除用户</el-button>
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
                  <el-button icon="el-icon-plus" size="mini" @click="editGroup(1)"></el-button>
                  <el-button icon="el-icon-edit" size="mini" @click="editGroup(2)"></el-button>
                  <el-button icon="el-icon-delete" size="mini" @click="deleteGroup"></el-button>
              </span>
            </p>
            <div style="clear: both"></div>
          </div>
          <el-tree :data="treeData" :props="defaultProps" class="group_tree" @current-change="currentChange" ref="tree"
                   show-checkbox default-expand-all node-key="groupid" check-strictly
                   :highlight-current="true"></el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content">
          <el-table :data="items" v-loading="listLoading" border fit highlight-current-row
                    @selection-change="handleSelectionChange" check-strictly
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
            <el-table-column align="center" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="editUser(scope.row)">编辑</el-button>
                <el-button type="text" @click="resetDShow(1,scope.row)">重置密码</el-button>
                <el-button type="text" @click="deleteAction(1,scope.row)">删除</el-button>
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
        <el-form-item label="管理员密码" prop="admin_pwd">
          <el-input v-model="resetQuery.admin_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="更新密码" prop="new_pwd">
          <el-input v-model="resetQuery.new_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="r_password">
          <el-input v-model="resetQuery.r_password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postActionReset">提 交</el-button>
        <el-button @click.native="resetQueryF" plain>关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500"
      :title="groupTitle"
      custom-class="groupDialog defineDialog"
      top="5vh"
      append-to-body
      :before-close="groupQueryF"
      :visible.sync="groupDialogShow">
      <el-form class="small-space" :model="groupQuery" label-position="left" :rules="group_rules" ref="groupQueryForm"
               label-width="100px">
        <el-form-item label="用户组名称" prop="name">
          <el-input v-model="groupQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="上级用户组" prop="parentid">
          <el-cascader
            :options="treeData"
            change-on-select
            clearable
            placeholder="请选择用户组"
            v-model="groupQuery.parentid"
            @change="handleChange"
            :props="props"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="绑定镜像" prop="image">
          <el-select v-model="groupQuery.image" style="width: 100%">
            <el-option :value="item.uuid" :key="item.uuid" :label="item.name" v-for="item in FileList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外设策略" prop="terminal" class="s_item">
          <span> (勾选表示启用，不勾选表示禁用)</span>
        </el-form-item>
        <el-form-item class="s_cgroup">
          <el-checkbox v-model="groupQuery.usb_HID" true-label="1" false-label="0">输入设备</el-checkbox>
          <el-checkbox v-model="groupQuery.usb_storage" true-label="1" false-label="0">存储设备</el-checkbox>
          <el-checkbox v-model="groupQuery.usb_camera" true-label="1" false-label="0">摄像设备</el-checkbox>
          <el-checkbox v-model="groupQuery.usb_office" true-label="1" false-label="0">办公设备</el-checkbox>
          <el-checkbox v-model="groupQuery.usb_audio" true-label="1" false-label="0">音频设备</el-checkbox>
          <el-checkbox v-model="groupQuery.usb_phone" true-label="1" false-label="0">手机</el-checkbox>
          <el-checkbox v-model="groupQuery.usb_other" true-label="1" false-label="0">其他设备</el-checkbox>
        </el-form-item>
        <el-form-item label="用户组描述" prop="desc">
          <el-input v-model="groupQuery.desc" type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button type="slateblue" @click.native="groupQueryF">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="500"
      :title="userTitle"
      custom-class="userDialog defineDialog"
      append-to-body
      top="5vh"
      :before-close="resetFUser"
      :visible.sync="userDialogShow">
      <el-form class="small-space" :model="userQuery" label-position="left" :rules="user_rules" ref="UserQueryForm"
               label-width="100px">
        <el-form-item label="用户名" prop="user">
          <el-input v-model="userQuery.user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!userQuery.userid">
          <el-input v-model="userQuery.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="员工编号" prop="sn">
          <el-input v-model="userQuery.sn"></el-input>
        </el-form-item>
        <el-form-item label="用户组" prop="groupid">
          <!--<el-tree :data="treeData" :props="defaultProps"-->
          <!--accordion node-key="id"-->
          <!--show-checkbox-->
          <!--:default-expanded-keys="[2, 3]"-->
          <!--:default-checked-keys="[5]"></el-tree>-->
          <el-cascader
            :options="treeData"
            change-on-select
            clearable
            placeholder="请选择用户组"
            v-model="userQuery.groupid"
            @change="handleChange"
            :props="props"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="手机号码" prop="tel" style="width:48%;display: inline-block">
          <el-input v-model="userQuery.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" style="width:48%;display: inline-block">
          <el-input v-model="userQuery.email"></el-input>
        </el-form-item>
        <el-form-item prop="has_clouddisk" style="margin-bottom: 0">
          <el-checkbox v-model="userQuery.has_clouddisk">是否需要配置个人云盘</el-checkbox>
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
    <el-dialog
      title="删除用户组"
      :visible.sync="groupDeledialogVisible"
      :before-close="resetDeleteGroupD"
      width="30%">
      <span>{{ showText }}，确认删除？此动作不能撤销。</span>
      <br>
      <span>若该用户组有子组或用户，如何处理？</span>
      <el-radio v-model="groupDeleteType" label="1">完全删除该用户组及子组和用户</el-radio>
      <br>
      <el-radio v-model="groupDeleteType" label="0">仅删除该用户组，子组和用户挂载到该用户组的父组下</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDeleteGroupD">取 消</el-button>
        <el-button type="primary" @click="postDeleAction">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import * as user from '@/api/user'
  import { getList } from '@/api/Image'
  import { validatAlphabetsAndNumber, vChineseOrEnglish, validateMobile, validateEmail } from '@/utils/validate'

  const chkPass = (rule, value, callback) => {
    if (value.length === 0) {
      callback(new Error('请输入密码'))
    } else {
      if (!validatAlphabetsAndNumber(value)) {
        callback(new Error('仅支持英文和数字'))
      } else {
        if (value.length > 20) {
          callback(new Error('密码长度不能超过20个字符'))
        }
      }
      callback()
    }
  }
  const chkName = (rule, value, callback) => {
    if (value.length === 0) {
      callback(new Error('请输入密码'))
    } else {
      if (!vChineseOrEnglish(value)) {
        callback(new Error('仅支持英文和数字'))
      } else {
        if (value.length > 20) {
          callback(new Error('密码长度不能超过20个字符'))
        }
      }
      callback()
    }
  }
  const chkPass2 = (rule, value, callback) => {
    if (value.length === 0) {
      callback(new Error('请再次输入密码'))
    } else {
      if (value !== this.resetQuery.new_pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
  }
  const chkPhone = (rule, value, callback) => {
    if (value.length === 0) {
      callback(new Error('请输入手机号码'))
    } else {
      if (!validateMobile(value)) {
        callback(new Error('号码格式不正确'))
      } else {
        callback()
      }
    }
  }
  const chkEmail = (rule, value, callback) => {
    if (value.length === 0) {
      callback(new Error('请输入电子邮箱'))
    } else {
      if (!validateEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
  }
  export default {
    data() {
      return {
        groupDeledialogVisible: false,
        resetQuery: {
          admin_pwd: '',
          new_pwd: '',
          r_password: ''
        },
        resetType: '',
        resetPasswordDialogShow: false,
        rules: {
          admin_pwd: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass
            }
          ],
          new_pwd: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass
            }
          ],
          r_password: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass2
            }
          ]
        },
        ExportShow: false,
        listLoading: false,
        groupTitle: '添加用户组',
        userTitle: '添加用户',
        groupDialogShow: false,
        userDialogShow: false,
        groupQuery: {},
        groupActionType: '',
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
        autoStart: false,
        attrs: {
          accept: 'image/*'
        },
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          userName: '',
          userId: ''
        },
        group_rules: {
          name: [
            { required: true, validator: chkName, trigger: 'blur' }
          ],
          parentid: [
            { required: true, message: '请选择上级组', trigger: 'change' }
          ],
          image: [
            { required: true, message: '请选择镜像', trigger: 'change' }
          ]
        },
        user_rules: {
          name: [
            { required: true, validator: chkName, trigger: 'blur' }
          ],
          user: [
            { required: true, validator: chkName, trigger: 'blur' }
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass
            }
          ],
          groupid: [
            { required: true, message: '请选择用户组', trigger: 'change' }
          ],
          tel: [
            { required: true, validator: chkPhone, trigger: 'change' }
          ],
          email: [
            { required: true, validator: chkEmail, trigger: 'change' }
          ],
          sn: [
            {
              required: true,
              trigger: 'blur',
              validator: chkPass
            }
          ]
        },
        items: [],
        total: 0,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        multipleSelection: [],
        groupDeleteArray: [],
        groupDeleteType: '',
        showText: '',
        props: {
          value: 'groupid',
          label: 'name',
          children: 'children'
        },
        FileList: []
      }
    },
    methods: {
      handleChange(value) {
        const len = value.length
        console.log(len)
        this.groupQuery.parentid = value[len - 1]
        console.log(this.groupQuery.parentid)
      },
      getImageFileList() {
        getList().then(res => {
          if (res.data.res === 0) {
            this.FileList = res.data.images
          }
        })
      },
      editGroup(v) {
        if (v === 1) {
          this.groupTitle = '添加用户组'
          this.groupActionType = 1
        } else {
          this.groupTitle = '编辑用户组'
        }
        this.getImageFileList()
        this.groupDialogShow = true
      },
      deleteAction(t, obj) {
        const userids = []
        let confirmText = ''
        if (t === 1) {
          confirmText = `确认删除用户名为${obj.user}的用户？此动作不能撤销。`
        } else {
          if (!this.multipleSelection.length) {
            this.$message({
              type: 'error',
              message: '请选择需要删除的用户!'
            })
            return
          }
          userids.push(obj.userid)
          confirmText = `您已选中${this.multipleSelection.length}个用户，确认删除？此动作不能撤销。`
          this.multipleSelection.forEach(m => {
            userids.push(m.userid)
          })
        }
        this.$confirm(confirmText, '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
      resetDShow(v, obj) {
        this.resetType = 2
        if (v === 1) {
          this.resetType = 1
          this.resetQuery = Object.assign({}, this.resetQuery, obj)
        } else {
          if (!this.multipleSelection.length) {
            this.$message({
              type: 'error',
              message: '请选择用户!'
            })
            return
          }
        }
        this.resetPasswordDialogShow = true
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
          this.resetDShow(2, {})
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
      postAction() {
        this.$refs.resetPasswordForm.validate(valid => {
          if (valid) {
            let _fn = user.postUserGroupAdd
            let ctext = `添加${this.groupQuery.name}`
            if (this.groupActionType !== 1) {
              _fn = user.postUserGroupEdit
              ctext = `编辑${this.groupQuery.name}`
            }
            this.$confirm(`确认${ctext}的用户组， 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _fn(this.groupQuery).then(res => {
                if (res.data.res === 0) {
                  this.$message({
                    type: 'success',
                    message: res.data.desc
                  })
                  this.groupQueryF()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.desc
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消操作!'
              })
            })
          }
        })
      },
      groupQueryF() {
        this.groupQuery = {}
        this.groupDialogShow = false
        this.$refs.groupQueryForm.resetFields()
      },
      postActionReset() {
        this.$refs.resetPasswordForm.validate(valid => {
          if (valid) {
            let confirmText = ''
            const uArr = []
            if (this.resetType === 1) {
              confirmText = `确定重置用户名为${this.resetQuery.user}用户的密码，确认重置？此动作不能撤销`
              uArr.push(this.resetQuery.userid)
            } else {
              confirmText = `您已选中${this.multipleSelection.length}个用户，确认重置？此动作不能撤销`
              this.multipleSelection.forEach(m => {
                uArr.push(m.userid)
              })
            }
            this.$confirm(`${confirmText}， 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const query = {
                userid: uArr,
                admin: this.$store.user.name,
                admin_pwd: this.resetQuery.admin_pwd,
                new_pwd: this.resetQuery.new_pwd
              }
              user.postUserReset(query).then(res => {
                if (res.data.res === 0) {
                  this.$message({
                    type: 'success',
                    message: res.data.desc
                  })
                  this.resetQueryF()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.desc
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消操作!'
              })
            })
          }
        })
      },
      resetQueryF() {
        this.resetQuery = {
          admin_pwd: '',
          new_pwd: '',
          r_password: ''
        }
        this.resetPasswordDialogShow = false
        this.$refs.resetPasswordForm.resetFields()
      },
      editUser(obj) {
        this.userQuery = Object.assign({}, obj)
        this.userTitle = '添加用户'
        if (this.userQuery.userid) this.userTitle = '编辑用户'
        this.userDialogShow = true
      },
      postActionUser() {
        this.$refs.userQueryForm.validate(valid => {
          if (valid) {
            let _fn = user.postUserAdd
            let ctext = `添加${this.userQuery.name}`
            if (this.groupActionType !== 1) {
              _fn = user.postUserEdit
              ctext = `编辑${this.userQuery.name}`
            }
            this.$confirm(`确认${ctext}的用户， 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _fn(this.groupQuery).then(res => {
                if (res.data.res === 0) {
                  this.$message({
                    type: 'success',
                    message: res.data.desc
                  })
                  this.resetFUser()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.desc
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消操作!'
              })
            })
          }
        })
      },
      resetFUser() {
        this.userQuery = {}
        this.userDialogShow = false
        this.$refs.userQueryForm.resetFields()
      },
      handleCurrentChange(v) {
        this.listQuery.pageNo = v
      },
      handleSizeChange(v) {
        this.listQuery.pageSize = v
      },
      resetDeleteGroupD() {
        this.groupDeleteArray = []
        this.groupDeleteType = ''
        this.groupDeledialogVisible = false
      },
      postDeleAction() {
        if (this.groupDeleteType === '') {
          this.$message({
            type: 'error',
            message: '请选择用户组下子组或者用户的处理方式!'
          })
          return
        }
        const query = {
          groupid: function() {
            const a = []
            this.groupDeleteArray.forEach(m => {
              a.push(m.groupid)
            })
            return a
          },
          del_children: this.groupDeleteType
        }
        user.postUserGroupDel(query).then(res => {
          if (res.data.res === 0) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.resetDeleteGroupD()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      },
      deleteGroup() {
        this.groupDeleteArray = this.getCheckedNodes()
        if (!this.groupDeleteArray.length) {
          this.$message({
            type: 'error',
            message: '请选择需要删除用户组!'
          })
          return
        }
        console.log(this.getCheckedNodes())
        if (this.groupDeleteArray.length === 1) {
          this.showText = `您已选中“${this.groupDeleteArray[0].name}”`
        } else {
          this.showText = `您已选中“${this.groupDeleteArray.length}个用户组”`
        }
        this.groupDeledialogVisible = true
      },
      getCheckedNodes() {
        return this.$refs.tree.getCheckedNodes()
      },
      // remove(node) {
      //   console.log(node)
      // },
      currentChange(node, obj) {
        console.log(node)
        console.log(obj)
        // if (obj.level === 0) return
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
        const asycArray = (a = []) => {
          a.map(r => {
            if (!r.children.length) {
              r.children = null
            } else {
              r.children = asycArray(r.children)
            }
            return r
          })
          return a
        }
        user.getUserGroupList().then(res => {
          if (res.data.res === 0) {
            const a = [res.data]
            this.treeData = a.map(v => {
              v.children = asycArray(v.children)
              return v
            })
            console.log(this.treeData)
          }
        })
      }
    },
    created() {
      this.getCompanyTree()
      // console.log(this.$store.state.user.name)
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
