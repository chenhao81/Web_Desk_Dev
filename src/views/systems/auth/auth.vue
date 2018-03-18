<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：查看申请码，输入授权码。"
      type="info"
      show-icon>
    </el-alert>
    <div
      class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium">
      <div class="el-table__body-wrapper is-scroll-left">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width:100%">
          <tbody>
          <tr class="el-table__row">
            <td>
              <div class="cell">
                <span>系统授权状态</span>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-button size="mini" type="slateblue">--</el-button>
              </div>
            </td>
            <td>
              <div class="cell">
                <span>版本号</span>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-button size="mini" type="slateblue">--</el-button>
              </div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td>
              <div class="cell">
                <span>授权版本</span>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-button size="mini" type="slateblue">--</el-button>
              </div>
            </td>
            <td>
              <div class="cell">
                <span>授权数量</span>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-button size="mini" type="slateblue">--</el-button>
              </div>
            </td>
          </tr>
          <tr class="el-table__row">
            <td>
              <div class="cell">
                <span>可用天数</span>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-button size="mini" type="slateblue">--</el-button>
              </div>
            </td>
            <td>
              <div class="cell">
                <span>到期时间</span>
              </div>
            </td>
            <td>
              <div class="cell">
                <el-button size="mini" type="slateblue">--</el-button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" :offset="10">
          <div class="grid-content bg-purple" style="padding: 10px">
            <el-button type="success" @click.native="updateAuth">更新授权</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    methods: {
      updateAuth() {
        this.$prompt('授权验证码', '更新授权验证码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '授权码格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      }
    }
  }
</script>
