<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：管理和维护终端。"
      type="info"
      show-icon>
    </el-alert>
    <div class="filter-container" style="margin-top: 10px;">
      <el-input v-model="listQuery.searchCode" class="filter-item" style="width: 260px;"
                placeholder="请输入绑定用户名/终端名称/终端IP"></el-input>
      <el-button type="slateblue" class="filter-item" icon="el-icon-search" :disabled="!listQuery.searchCode">查询
      </el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="deleteAll" icon="el-icon-delete">删除</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="closeTerminal" icon="el-icon-close">关机
      </el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="restart" icon="el-icon-news">重启</el-button>
    </div>
    <el-table :data="items" v-loading="listLoading" border fit highlight-current-row
              @selection-change="handleSelectionChange"
              style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="终端名称" width="100" prop="name">
      </el-table-column>
      <el-table-column align="center" label="终端类型" width="100" prop="terminalType">
        <template slot-scope="scope">
          <span>{{ scope.row.terminalType | filterType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="绑定用户名" width="100" prop="user">
      </el-table-column>
      <el-table-column align="center" label="终端镜像" width="150" prop="image">
      </el-table-column>
      <el-table-column align="center" label="终端IP" min-width="150" prop="ip">
      </el-table-column>
      <el-table-column align="center" label="虚机IP" min-width="120" prop="vip">
      </el-table-column>
      <el-table-column align="center" label="终端状态" width="120" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status | fiterStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="MAC地址" min-width="180" prop="mac">
      </el-table-column>
      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <el-button type="text" @click="terminalDialogShow=true">编辑</el-button>
          <el-button type="text">还原</el-button>
          <el-button type="text" @click="IPDialogShow=true">设置IP</el-button>
          <el-button type="text" @click="updateDialogShow=true">更新镜像</el-button>
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
      title="编辑终端"
      custom-class="terminalDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="terminalDialogShow">
      <el-form class="small-space" :model="terminalQuery" label-position="left" :rules="terminal_rules"
               ref="terminalQueryForm"
               label-width="100px">
        <el-form-item label="终端类型" prop="type">
          <el-select v-model="terminalQuery.type" style="width: 100%">
            <el-option value="1" label="单用户"></el-option>
            <el-option value="2" label="多用户"></el-option>
            <el-option value="3" label="公用机"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定用户" prop="user">
          <el-cascader
            filterable
            :options="options"
            change-on-select
            clearable
            placeholder="请选择用户"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="终端名称" prop="name">
          <span> 张三</span>
        </el-form-item>
        <el-form-item label="绑定镜像" prop="image">
          <span> Windows7_64.vdi</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500"
      title="更新镜像"
      custom-class="updateDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="updateDialogShow">
      <el-form class="small-space" :model="updateQuery" label-position="left" :rules="update_rules"
               ref="updateQueryForm"
               label-width="100px">
        <span style="color:#f00">点击确定后，会更新服务器上镜像。请输入镜像的更新信息：</span>
        <el-form-item label="镜像名称" prop="type">
          <el-input v-model="updateQuery.name" style="width: 100%" placeholder="请输入镜像名称，不超过25个字符"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="system">
          <el-select v-model="updateQuery.type" style="width: 100%">
            <el-option value="1" label="Windows 7 64位"></el-option>
            <el-option value="2" label="Windows 7 32位"></el-option>
            <el-option value="3" label="Windows 10"></el-option>
            <el-option value="4" label="Windows XP"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统" prop="system">
          <el-select v-model="updateQuery.type" style="width: 100%">
            <el-option value="1" label="还原"></el-option>
            <el-option value="2" label="个性化"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-alert
        title="更新镜像前要求该终端必须先关机，是否关机？"
        type="warning"
        show-icon>
      </el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">确定</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="80%"
      title="设置IP"
      custom-class="IPDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="IPDialogShow">
      <el-form class="small-space" :model="IPQuery" label-position="left" :rules="IP_rules"
               ref="IPQueryForm"
               label-width="100px">
        <div class="fl" style="width: 49%;border: 1px solid #409EFF;height:500px;padding: 10px;border-radius: 5px;">
          <span style="font-size: 16px;color:#409EFF">配置终端网络IP</span><br>
          <el-radio-group v-model="IPQuery.ipAddr">
            <el-radio :label="1">自动获取IP地址</el-radio>
            <br>
            <el-radio :label="2">使用下面的IP地址</el-radio>
          </el-radio-group>
          <el-form-item label="IP地址：" prop="type">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="子网掩码：" prop="type">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="默认网关：" prop="type">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-radio-group v-model="IPQuery.ipAddr">
            <el-radio :label="1">自动获取DNS服务器地址</el-radio>
            <br>
            <el-radio :label="2">使用下面的DNS服务器地址</el-radio>
          </el-radio-group>
          <el-form-item label="首选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="备选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
        </div>
        <div class="fr" style="width: 49%;border: 1px solid #409EFF;height:500px;padding: 10px;border-radius: 5px;">
          <span style="font-size: 16px;color:#409EFF">配置虚机网络IP</span><br>
          <el-radio-group v-model="IPQuery.ipAddr">
            <el-radio :label="1">自动获取IP地址</el-radio>
            <br>
            <el-radio :label="2">使用下面的IP地址</el-radio>
          </el-radio-group>
          <el-form-item label="IP地址：" prop="type">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="子网掩码：" prop="type">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="默认网关：" prop="type">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-radio-group v-model="IPQuery.ipAddr">
            <el-radio :label="1">自动获取DNS服务器地址</el-radio>
            <br>
            <el-radio :label="2">使用下面的DNS服务器地址</el-radio>
          </el-radio-group>
          <el-form-item label="首选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="备选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.type" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
        </div>
        <div style="clear: both"></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
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
        terminalDialogShow: false,
        updateDialogShow: false,
        IPDialogShow: false,
        update_rules: {},
        IP_rules: {},
        terminal_rules: {},
        terminalQuery: {
          terminalTitle: '编辑终端'
        },
        updateQuery: {},
        IPQuery: {
          ipAddr: 1
        },
        listLoading: false,
        total: 0,
        listQuery: {
          searchCode: '',
          pageNo: 1,
          pageSize: 10
        },
        multipleSelection: [],
        items: [
          {
            id: 1,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          },
          {
            id: 2,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          },
          {
            id: 3,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          },
          {
            id: 4,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          },
          {
            id: 5,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          },
          {
            id: 6,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          },
          {
            id: 7,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          },
          {
            id: 8,
            name: 'zhangsan',
            terminalType: 0,
            user: 'zhangsan',
            image: 'Windows7_64.vdi',
            ip: '192.168.100.40',
            vip: '192.168.100.10',
            status: 1,
            mac: '00:30:18:0A:CB:64'
          }
        ]
      }
    },
    methods: {
      postAction() {},
      resetF() {
        this.$refs.terminalQueryForm.resetFields()
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
      refresh() {},
      deleteAll() {},
      restart() {},
      closeTerminal() {}
    },
    filters: {
      filterType(t) {
        const map = {
          1: '单用户',
          2: '公用机',
          0: '多用户'
        }
        return map[t]
      },
      fiterStatus(v) {
        const map = {
          1: '已登录',
          2: '在线未登录',
          0: '离线'
        }
        return map[v]
      }
    }
  }
</script>
