<template>
  <div>
    <el-form :label-position="labelPosition" :model="offlineTimes" label-width="200px">
      <el-form-item label="允许终端离线启动最大次数:">
        <el-select v-model="offlineTimes.time"></el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        labelPosition: 'right',
        offlineTimes: {
          time: ''
        }
      }
    }
  }
</script>
