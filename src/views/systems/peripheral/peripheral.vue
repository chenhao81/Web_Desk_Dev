<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：查看和维护全局的USB外设策略。"
      type="info"
      show-icon>
    </el-alert>
    <el-table
      :data="items"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}({{ scope.row.desc }})</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        label="操作">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.status" @change="confirmAction(scope.row)">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        items: [
          {
            id: 1,
            name: '输入设备',
            desc: '除键鼠外的输入设备，如手写板等，需要用户自行归类或添加',
            status: 1
          },
          {
            id: 2,
            name: '存储设备',
            desc: 'U盘、光驱、移动硬盘等存储设备',
            status: 0
          },
          {
            id: 3,
            name: '输入设备',
            desc: '人机接口设备',
            status: 1
          },
          {
            id: 4,
            name: '摄像设备',
            desc: 'USB摄像头、高拍仪等设备',
            status: 0
          },
          {
            id: 5,
            name: '音频设备',
            desc: 'USB耳机、USB麦克风等音频设备',
            status: 1
          },
          {
            id: 6,
            name: '办公设备',
            desc: 'USB打印机设备，其他办公设备需要用户自行归类或添加',
            status: 0
          },
          {
            id: 7,
            name: '手机',
            desc: '自定义设备，需要用户自行归类或添加',
            status: 1
          }
        ]
      }
    },
    methods: {
      confirmAction(obj) {
        const str = obj.status === 1 ? '启用' : '禁用'
        this.$confirm(`${str} ${obj.name}， 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: `${str}成功！`
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作!'
          })
          obj.status = obj.status === 1 ? '0' : 1
        })
      }
    }
  }
</script>
