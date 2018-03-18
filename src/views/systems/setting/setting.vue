<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：设置系统时间、离线登录次数、个人云盘默认空间等。"
      type="info"
      show-icon>
    </el-alert>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-tree :data="settingTree" :props="defaultProps" default-expand-all
                 node-key="id" @current-change="currentChange"
                 :highlight-current="true"></el-tree>
      </el-col>
      <el-col :span="18">
        <template v-if="setDefault!==3">
          <component-b></component-b>
        </template>
        <template v-else>
          <component-a></component-a>
        </template>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import componentA from './offlineTimes'
  import componentB from './systemTime'

  export default {
    components: { componentA, componentB },
    data() {
      return {
        setDefault: 1,
        settingTree: [
          {
            id: 1,
            label: '设置列表',
            children: [
              {
                id: 2,
                label: '系统时间'
              },
              {
                id: 3,
                label: '离线登录次数'
              }
            ]
          }
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      currentChange(node, obj) {
        this.setDefault = node.id
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-tree {
    height: 570px;
    border: 1px #999 solid;
    overflow: hidden;
  }
</style>
