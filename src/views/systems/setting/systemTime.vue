<template>
  <div>
    <el-form :label-position="labelPosition" :model="systemTime" label-width="180px">
      <el-form-item label="服务端系统时间:">
        <span>{{ systemTime.time }}</span>
        <el-button type="primary" size="mini">刷新</el-button>
      </el-form-item>
      <el-form-item label="时间设置方式:">
        <el-radio-group v-model="systemTime.type" @change="confirmAction">
          <el-radio :label="1">从网络NTP服务同步</el-radio>
          <el-radio :label="2">手动设置</el-radio>
          <el-radio :label="3">同步本地时间</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="NTP服务IP或URL地址:">
        <el-select v-model="systemTime.url"></el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        systemTime: {
          time: '2018-02-02 00:00:00',
          type: 2,
          url: ''
        },
        labelPosition: 'right'
      }
    },
    methods: {
      confirmAction() {}
    }
  }
</script>
