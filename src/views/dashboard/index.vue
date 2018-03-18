<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <!--<div class="tips" flex="dir:left box:justify cross:center;">-->
      <div>
        <!--<el-alert-->
        <!--title="友情提示："-->
        <!--type="info"-->
        <!--description="查看服务器使用、存储使用、虚机运行、License使用等整体概况。"-->
        <!--show-icon>-->
        <!--</el-alert>-->
        <el-alert
          title="功能介绍：查看服务器使用、存储使用、虚机运行、License使用等整体概况。"
          type="info"
          show-icon>
        </el-alert>
        <!--<div flex="cross:center main:center" class="gthimg"><img src="../../assets/images/gth.png" alt=""></div>-->
        <!--<p flex="cross:center main:left"> 提示：查看服务器使用、存储使用、虚机运行、License使用等整体概况。</p>-->
        <!--<div flex="cross:center main:center" class="close"><img src="../../assets/images/close.png" alt=""></div>-->
      </div>
      <!--搜索-->
      <div class="serach-con">
        <div class="search-inp" flex="main:center cross:center">
          <input type="text" placeholder="请输入终端用户/终端名称/IP地址">
          <button class="search-btn">查找终端</button>
        </div>
      </div>
      <!--服务器-->
      <div class="server-wrapper" flex="">
        <div flex-box="0" class="server-left">
          <h1>服务器</h1>
          <p>运行状态：运行中</p>
          <p>IP地址：{{ serviceInfo.ip }}</p>
          <p>授权详情：查看详情</p>
          <p>是否加入区域：待加入</p>
          <div class="operation" flex="box:mean">
            <div class="operation-btn" style="cursor: pointer">重启</div>
            <div class="operation-btn" style="cursor: pointer">关机</div>
            <br>
            <div class="operation-btn" style="cursor: pointer" @click="jionRegion">加入区域</div>
          </div>
        </div>
        <div flex-box="1" class="server-right" flex="main:center box:mean cross:center">
          <div class="server-con">
            <div flex="main:center">
              <!--<img src="../../assets/images/img.png" alt="">-->
              <el-progress type="circle" :percentage="Number(serviceInfo.cpu)"></el-progress>
            </div>
            <p>CPU使用率</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.mem)"></el-progress>
            </div>
            <p>内存使用率</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.image.rate)"></el-progress>
            </div>
            <p>镜像空间({{ serviceInfo.image.used }}/{{ serviceInfo.image.total }})</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.clouddisk.rate)"></el-progress>
            </div>
            <p>云盘空间({{ serviceInfo.clouddisk.used }}/{{ serviceInfo.clouddisk.total }})</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.recv)"></el-progress>
            </div>
            <p>接受带宽</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.send)"></el-progress>
            </div>
            <p>发送带宽</p>
          </div>
        </div>
      </div>
      <!--云终端-->
      <div flex="" class="cloud-terminal">
        <div class="cloud-container" flex="box:mean">
          <div class="cloud-container-left" flex="">
            <div flex-box="0" class="cloud-terminal-left">
              <h1>云终端：{{terminalInfo.total}}</h1>
              <p>已登录终端数：<span>{{ terminalInfo.logon }}</span></p>
              <p>在线未登录终端数：<span>{{ terminalInfo.online }}</span></p>
              <p>离线终端数：<span>{{ terminalInfo.offline }}</span></p>
            </div>
            <div flex-box="1" class="cloud-terminal-right" flex="">
              <pie-chart></pie-chart>
              <!--<div flex-box="0" flex="" class="cloud-con-img">-->
              <!--<div flex="main:center cross:center">-->
              <!--<div><img src="../../assets/images/tp.png" alt=""></div>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div flex-box="1" flex="main:center dir:top">-->
              <!--<p><img src="../../assets/images/reddian.png" alt="">在线75.00%</p>-->
              <!--<p><img src="../../assets/images/graydian.png" alt="">离线25.00%</p>-->
              <!--</div>-->
            </div>
          </div>
          <div class="cloud-container-right">
            <div flex="">
              <div flex-box="0" class="quick-operation-left" flex="cross:center main:center">快捷操作</div>
              <div flex-box="1" class="quick-operation-right">
                <div flex="box:mean">
                  <div @click="goToImage"><img src="../../assets/images/1.png" alt=""></div>
                  <div><img src="../../assets/images/2.png" alt=""></div>
                </div>
                <div flex="box:mean">
                  <div><img src="../../assets/images/3.png" alt=""></div>
                  <div><img src="../../assets/images/4.png" alt=""></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--图表-->
      <div class="chart-con" flex="box:mean">
        <div class="chart-con-left" flex="cross:center">
          <div flex-box="0" class="chart-title">上机次数</div>
          <div flex-box="1">
            <div class="canvas-filter-container filter-container">
              <el-date-picker
                clearable
                class="filter-item"
                v-model="dataValue"
                type="daterange"
                style="width: 260px"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
              <el-button type="slateblue" class="filter-item" @click="_search">查询
              </el-button>
              <el-button type="slateblue" class="filter-item" @click="exportExcel">导出
              </el-button>
            </div>
            <line-chart :chart-data="lineChartData.shoppings"></line-chart>
          </div>
        </div>
        <div class="chart-con-right" flex="cross:center">
          <div flex-box="0" class="chart-title">上机时长</div>
          <div flex-box="1">
            <div class="canvas-filter-container filter-container">
              <el-date-picker
                clearable
                class="filter-item"
                v-model="dataValue"
                type="daterange"
                style="width: 260px"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
              <el-button type="slateblue" class="filter-item" @click="_search">查询
              </el-button>
              <el-button type="slateblue" class="filter-item" @click="exportExcel">导出
              </el-button>
            </div>
            <line-chart :chart-data="lineChartData.purchases"></line-chart>
          </div>
        </div>
      </div>
      <!--图表-->
      <div class="chart-con" flex="box:mean">
        <div class="chart-con-left" flex="cross:center">
          <div flex-box="0" class="chart-title">最受欢迎应用</div>
          <div flex-box="1">
            <div class="canvas-filter-container filter-container">
              <el-date-picker
                clearable
                class="filter-item"
                v-model="dataValue"
                type="daterange"
                style="width: 260px"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
              <el-button type="slateblue" class="filter-item" @click="_search">查询
              </el-button>
              <el-button type="slateblue" class="filter-item" @click="exportExcel">导出
              </el-button>
            </div>
            <bar-chart></bar-chart>
          </div>
        </div>
        <div class="chart-con-right" flex="cross:center">
          <div flex-box="0" class="chart-title">终端使用率</div>
          <div flex-box="1">
            <div class="canvas-filter-container filter-container">
              <el-date-picker
                clearable
                class="filter-item"
                v-model="dataValue"
                type="daterange"
                style="width: 260px"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
              <el-button type="slateblue" class="filter-item" @click="_search">查询
              </el-button>
              <el-button type="slateblue" class="filter-item" @click="exportExcel">导出
              </el-button>
            </div>
            <line-chart :chart-data="lineChartData.messages"></line-chart>
          </div>
        </div>
      </div>

      <!--
      <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData"></line-chart>
      </el-row>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <raddar-chart></raddar-chart>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart></pie-chart>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart></bar-chart>
          </div>
        </el-col>
      </el-row>-->
    </div>
    <el-dialog
      width="500"
      title="加入区域"
      custom-class="regionDialog defineDialog"
      append-to-body
      top="5vh"
      :visible.sync="regionDialogShow">
      <el-form class="small-space" :model="regionQuery" label-position="left" :rules="region_rules"
               ref="regionQueryForm"
               label-width="150px">
        <el-form-item label="区域服务器IP" prop="userName">
          <el-input v-model="regionQuery.userName"></el-input>
        </el-form-item>
        <el-form-item label="本地服务器名称" prop="password">
          <el-input v-model="regionQuery.password"></el-input>
        </el-form-item>
        <el-form-item label="本地服务器地址" prop="password">
          <baidu-map
            class="map"
            :scroll-wheel-zoom="true"
            :center="center"
            :zoom="zoom"
            @moving="syncCenterAndZoom"
            @moveend="syncCenterAndZoom"
            @zoomend="syncCenterAndZoom">
          </baidu-map>
        </el-form-item>
        <el-form-item label="本地服务器备注" prop="desc">
          <el-input v-model="regionQuery.name" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">确 定</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import LineChart from './components/LineChart'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'
  import * as DashBoard from '@/api/Dashboard'
  import { mapActions } from 'vuex'

  export default {
    name: 'dashboard-admin',
    components: {
      LineChart,
      PieChart,
      BarChart
    },
    data() {
      return {
        center: {
          lng: 116.404,
          lat: 39.915
        },
        zoom: 15,
        regionQuery: {},
        regionDialogShow: false,
        region_rules: {},
        dataValue: [],
        lineChartData: {
          messages: {
            expectedData: [200, 192, 120, 144, 160, 130, 140],
            actualData: [180, 160, 151, 106, 145, 150, 130]
          },
          purchases: {
            expectedData: [80, 100, 121, 104, 105, 90, 100],
            actualData: [120, 90, 100, 138, 142, 130, 130]
          },
          shoppings: {
            expectedData: [130, 140, 141, 142, 145, 150, 160],
            actualData: [120, 82, 91, 154, 162, 140, 130]
          }
        },
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        serviceInfo: {
          ip: 0,
          cpu: 0,
          mem: 0,
          image: {
            used: 0,
            total: 0,
            rate: 0
          },
          clouddisk: {
            used: 0,
            total: 0,
            rate: ''
          },
          recv: 0,
          send: 0
        },
        terminalInfo: {
          total: 0,
          logon: 0,
          offline: 0,
          online: 0
        }
      }
    },
    created() {
      this.getServiceInfo()
      this.getTerminalInfo()
      this._getData()
    },
    methods: {
      goToImage() {
        this.$router.push(
          {
            path: '/images/images',
            query: { userId: 123 }
          }
        )
      },
      _search() {
        this._getData()
      },
      _getData() {},
      getServiceInfo() {
        DashBoard.getServerStatus().then(res => {
          if (res.data.res === 0) {
            this.serviceInfo = Object.assign({}, res.data)
            // console.log(this.serviceInfo)
          } else {
            this.$message({
              type: 'error',
              message: '获取服务器信息失败!'
            })
          }
        })
      },
      getTerminalInfo() {
        DashBoard.getTerminalInfo().then(res => {
          if (res.data.res === 0) {
            // console.log(res.data)
            this.terminalInfo = Object.assign({}, res.data)
            const info = [
              { value: this.terminalInfo.logon, name: '已登录' },
              { value: this.terminalInfo.online, name: '在线未登录' },
              { value: this.terminalInfo.offline, name: '未登录' }
            ]
            this.setTerminalInfo(info)
          } else {
            this.$message({
              type: 'error',
              message: '获取云终端信息失败!'
            })
          }
        })
      },
      syncCenterAndZoom(e) {
        const { lng, lat } = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      },
      postAction() {},
      resetF() {},
      jionRegion() {
        this.regionDialogShow = true
      },
      exportExcel() {},
      // handleSetLineChartData(type) {
      //   this.lineChartData = lineChartData[type]
      // }
      ...mapActions([
        'setTerminalInfo'
      ])
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "flex.css";

  .map {
    width: 100%;
    height: 200px;
  }

  .dashboard-editor-container {
    background: #f3f3f3;
    .tips {
      background: #fff;
      width: 100%;
      color: #2483ba;
      font-size: 15px;
      height: 55px;
      margin: 6px 0;
      p {
        margin-left: 20px;
      }
      .gthimg {
        margin-left: 20px;
      }
      .close {
        margin-right: 50px;
      }
    }
    .serach-con {
      margin-bottom: 6px;
      background: white;
      .search-inp {
        width: 100%;
        padding: 20px 0;
        input {
          width: 30%;
          height: 50px;
          line-height: 50px;
          border: 1px solid #6cb7e3;
          text-indent: 35px;
          background: url("../../assets/images/search.png") no-repeat center left 10px;

        }
        .search-btn {
          width: 162px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #2795d5;
          outline: 0;
          padding: 0;
          border: none;
          font-size: 21px;
          color: white;
          margin-left: 17px;
        }
      }
    }
    .server-wrapper {
      width: 100%;
      height: 306px;
      background: white;
      margin-bottom: 30px;
      margin-top: 20px;
      .server-left {
        width: 204px;
        background: #2795d5;
        color: white;
        h1 {
          font-size: 21px;
          font-weight: normal;
          text-align: left;
          margin-left: 18px;
          margin-top: 28px;
          margin-bottom: 48px;
        }
        p {
          font-size: 13px;
          margin-bottom: 20px;
          margin-left: 18px;
        }
        .operation {
          font-size: 13px;
          color: white;
          margin-left: 6px;
          margin-top: 36px;
          .operation-btn {
            width: auto;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid white;
            margin-right: 5px;
          }
        }
      }
      .server-right {
        width: 100%;
        color: #3c3c3c;
        font-size: 16px;
        .server-con {
          p {
            text-align: center;
          }
        }
      }
    }
    .cloud-terminal {
      width: 100%;
      .cloud-container {
        width: 100%;
        height: 305px;
        .cloud-container-left {
          margin-right: 35px;
          background: #2795d5;
          color: white;
          padding-left: 18px;
          .cloud-terminal-left {
            width: 186px;
            h1 {
              font-size: 21px;
              font-weight: normal;
              margin-top: 30px;
              margin-bottom: 43px;
            }
            p {
              font-size: 13px;
              margin-bottom: 41px;
              span {
                font-size: 25px;
              }
            }
          }
          .cloud-terminal-right {
            background: white;
            color: #3c3c3c;
            font-size: 19px;
            .cloud-con-img {
              img {
                margin-right: 30px;
                margin-left: 30px;
              }
            }
          }
        }
        .cloud-container-right {
          background: white;
          border-left: 19px solid #2795d5;
          box-sizing: border-box;
          .quick-operation-left {
            margin: 0 20px 0 40px;
            color: #2795d5;
            font-size: 21px;
          }
          .quick-operation-right {
            margin-top: 35px;
          }
        }
      }
    }
    .chart-con {
      margin-top: 22px;
      height: 305px;
      .chart-con-left {
        text-align: center;
        margin-right: 37px;
        background: white;
        border-left: 19px solid #2795d5;
        box-sizing: border-box;
        .chart-title {
          width: 135px;
          font-size: 21px;
          color: #2795d5;
          text-align: center;
        }
      }
      .chart-con-right {
        text-align: center;
        background: white;
        border-left: 19px solid #2795d5;
        box-sizing: border-box;
        .chart-title {
          width: 187px;
          font-size: 21px;
          color: #2795d5;
          text-align: center;
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 10px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
