<template>
  <div class="container">
    <el-input placeholder="请输入内容" v-model="input" class="input-with-select" size="small">
      <template slot="prepend">
        <el-select v-model="select"  placeholder="请输入" style="width: 100px;">
          <el-option label="全部" value=""></el-option>
          <el-option  v-for="item in columnsActive" :label="item.label" :value="item.key" :key="item.key"></el-option>
        </el-select>
      </template>
      <template #append>
        <el-switch
            v-model="isBlur"
            :width="35"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
        </el-switch>
        <el-divider direction="vertical"></el-divider>
        <el-button icon="el-icon-search" circle @click="query" class="select-btn"/>
      </template>
    </el-input>
    <el-card>
      <el-table
          size="mini"
          height="100%"
          :data="tableData"
          style="width: 100%">
        <el-table-column v-for="item in columnsActive" :prop="item.key" :label="item.label" :width="item.width" align="center" :key="item.key" :formatter="item.formatter" show-overflow-tooltip>
          <template #header="{column}">
            <div class="header_col">
              {{ column.label }}
              <template v-if="item!==false">
                <svg-icon :name="String(item.sort)" :className="String(item.sort)"  @click="sort(item.key)"></svg-icon>
              </template>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <Loading v-if="loading"/>
          <strong style="color: #fb04ad" v-else>暂无数据！</strong>
        </template>
      </el-table>
    </el-card>
    <el-pagination
        background
        small
        layout="prev, pager, next,total"
        @current-change="query"
        :current-page.sync="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total">
    </el-pagination>
  </div>
</template>

<script>
import {ipcRenderer} from 'electron'
import Loading from '../components/Loading'
export default {
  data () {
    return {
      input: '',
      select: '',
      isBlur: true,
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      orderArr: [],
      columns: [
        {key: 'sellerRoleid', label: '游戏ID', sort: false, status: true, width: 120},
        {key: 'level', label: '人物等级', sort: false, status: true, width: 80},
        {key: 'sellerName', label: '游戏昵称', sort: false, status: true, width: 150},
        {key: 'playName', label: '角色名称', sort: false, status: true, width: 80},
        {key: 'areaName', label: '界服名称', sort: false, status: true, width: 80},
        {key: 'serverId', label: '服务器ID', sort: false, status: true, width: 80},
        {key: 'serverName', label: '服务器名称', sort: false, status: false, width: 120},
        {key: 'price', label: '售价', sort: 'asc', status: true, width: 80},
        {key: 'statusDesc', label: '出售状态', sort: false, status: true, width: 80},
        {key: 'cbgUrl', label: '藏宝阁链接地址', sort: false, status: false, width: 150},
        {key: 'gameChannel', label: '游戏渠道', sort: false, status: true, width: 80},
        {key: 'umupShort', label: '卖家描述', sort: false, status: false, width: 80},
        {key: 'xiaYu', label: '仙玉', sort: false, status: true, width: 80},
        {key: 'silver', label: '大话币(银两)', sort: false, status: true, width: 150},
        {key: 'hp', label: '人物气血值', sort: 'asc', status: true, width: 100},
        {key: 'mp', label: '人物法力值', sort: 'asc', status: true, width: 100},
        {key: 'ap', label: '人物攻击力', sort: 'asc', status: true, width: 100},
        {key: 'sp', label: '人物敏捷', sort: 'asc', status: true, width: 80},
        {key: 'factionLevel', label: '帮派修炼', sort: false, status: true, width: 80},
        {key: 'tianYanLevel', label: '天演策', sort: false, status: true, width: 80},
        {key: 'wuXingLevel', label: '五行等级', sort: false, status: true, width: 80},
        {key: 'fire', label: '火五行', sort: false, status: true, width: 80},
        {key: 'soil', label: '土五行', sort: false, status: true, width: 80},
        {key: 'water', label: '水五行', sort: false, status: true, width: 80},
        {key: 'wood', label: '木五行', sort: false, status: true, width: 80},
        {key: 'gold', label: '金五行', sort: false, status: true, width: 80},
        {key: 'suitLevel',
          label: '套装品阶',
          sort: false,
          status: true,
          width: 80,
          formatter: (row, column, cellValue, index) => {
            switch (cellValue) {
              case 1:return '把玩'
              case 2:return '珍藏'
              case 3:return '无价'
              default:return '未知'
            }
          }},
        {key: 'suitName', label: '套装', sort: false, status: true, width: 80},
        {key: 'status', label: '处理状态', sort: false, status: true, width: 80, formatter: (row, column, cellValue, index) => cellValue === '1' ? '处理成功' : '处理失败'},
        {key: 'statusCode', label: '返回状态编码', sort: false, status: true, width: 120},
        {key: 'createTime', label: '创建时间', sort: false, status: true, width: 150, formatter: (row, column, cellValue, index) => new Date(cellValue).toLocaleString()},
        {key: 'updateTime', label: '更新时间', sort: false, status: true, width: 150, formatter: (row, column, cellValue, index) => new Date(cellValue).toLocaleString()}
      ],
      tableData: []
    }
  },
  beforeMount () {
    this.orderArr = this.orderList.map(item => `${item.key} ${item.sort}`)
  },
  computed: {
    params () {
      if (this.select && this.input) {
        // eslint-disable-next-line standard/object-curly-even-spacing
        return {condition: {field: this.select, value: this.input, isBlur: this.isBlur }, pagination: this.pagination, order: this.orderArr}
      } else {
        return {pagination: this.pagination, order: this.orderArr}
      }
    },
    columnsActive () {
      return this.columns.filter(item => item.status)
    },
    orderList () {
      return this.columns.filter(item => item.status && item.sort !== false)
    }
  },
  components: {
    Loading
  },
  methods: {
    sort (field) {
      let column = this.columns.find(item => item.key === field)
      column.sort = column.sort === 'asc' ? 'desc' : 'asc'
      this.orderArr = []
      for (const item of this.orderList) {
        if (item.key === field) {
          this.orderArr.unshift(`${item.key} ${item.sort}`)
        } else {
          this.orderArr.push(`${item.key} ${item.sort}`)
        }
      }
      this.query()
    },
    query () {
      this.loading = true
      this.tableData = []
      let {code, data, msg, total} = ipcRenderer.sendSync('select', this.params)
      console.log(data)
      if (code === 0) {
        setTimeout(() => {
          this.tableData = data
          this.pagination.total = total
          this.loading = false
        }, 2000)
      } else {
        this.$message({type: 'error', message: msg})
      }
    }
  }
}
</script>

<style>
.input-with-select {
  border: 1px solid #f4075a;
  border-radius: 7px;
  font-size: 12px;
  background-color: rgba(0, 0, 51, .55);
}

.el-input-group__append, .el-input-group--append .el-input__inner, .el-input-group__prepend {
  position: relative;
  color: #fb04ad;
  border: none;
}

.el-input-group__append::before {
  content: "";
  width: 2px;
  position: absolute;
  top: 8px;
  bottom: 8px;
  background-color: #5daf34;
  left: -1px;
}

.el-input__inner::-webkit-input-placeholder {
  color: rebeccapurple;
}

.el-input-group__prepend::after {
  content: "";
  width: 2px;
  position: absolute;
  top: 8px;
  bottom: 8px;
  background-color: #5daf34;
  right: -1px;
}
.select-btn{
  color: #f67105 !important;
  width: 20px !important;
  height: 20px !important;
  padding: 0 !important;
  margin: 0 !important;
  transform: translateY(1px) !important;
}
.select-btn:hover{
  background-color: #f67105 !important;
  color: white !important;
}

.el-card {
  height: 100%;
  background-color: rgba(0, 0, 51, 0.55);
  border-radius: 7px;
  border: 1px solid #46ded9;
  margin: 2rem 0 1rem;
  z-index: 2;
}

.el-card {
  background-color: rgba(0, 0, 51, 0.55);
  border-radius: 7px;
  border: 1px solid #46ded9;
}
.el-card__body{
  height: 100%;
  box-sizing: border-box;
}

.el-table {
  color: #f67105;
}

.el-table::before {
  height: 0;
}

.el-table thead {
  color: #5daf34;
  font-weight: 600;
}

.container {
  width: 100%;
  height: 100%;
  padding: 4rem 10% 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.el-table tr, .el-table th.el-table__cell, .el-table, .el-input__inner, .el-input-group__prepend, .el-input-group__append {
  overflow: hidden;
  background-color: transparent;
}

.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
  border-bottom: transparent;
}

.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: transparent;
}

.el-table--enable-row-hover .el-table__body tr:hover {
  color: #46ded9;
  transform: scale(1.02);
}
.el-pagination{
  text-align: end;
  z-index: 2;
}
.el-pagination.is-background .el-pager li {
  background-color: rgba(0, 0, 51, .55);
  border: 1px solid #00ffcf;
  color: #fb04ad;
  border-radius: 5px;
  font-weight: 500;
}

.el-pagination.is-background .el-pager li.active {
  border: none;
}

.el-pagination .btn-next, .el-pagination .btn-prev {
  background-color: rgba(0, 0, 51, .55) !important;
  cursor: pointer;
  border: 1px solid #00ffcf;
  color: #08ec1b !important;
  border-radius: 5px !important;
  font-weight: 500;
}
.el-pagination__total{
  color: #f67105;
}

/**
 tu
 */
.header_col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.order {
  display: inline-block;
  margin-left: 3px;
  margin-top: 1px;
  width: 8px;
  height: 8px;
}

.asc {
  color: #f4075a;
  margin-top: 0.1rem;
}

.desc {
  color: #0299f5;
  margin-top: 0.1rem;
}
/**
dialog
 */
.el-dialog__wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dialog{
  border-radius: 7px;
  border: 1px solid #f67105;
}
.el-dialog__header{
  display: none;
}

.label{
  color: #6c2894;
  font-weight: bold;
  display: flex;
  justify-content: flex-end;
}
</style>
