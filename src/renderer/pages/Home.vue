<template>
  <div class="container">
    <el-input placeholder="请输入内容" v-model="input" class="input-with-select" size="small">
      <template slot="prepend">
        <el-select v-model="select"  placeholder="请输入" style="width: 100px;">
          <el-option label="全部" value=""></el-option>
          <el-option  v-for="item in fields" :label="item.label" :value="item.key" :key="item.key"></el-option>
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
        <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="价格" align="center">
          <template #header="{column}">
            <div class="header_col" @click="sort('price')">
              {{ column.label }}
              <svg-icon :name="order.price" :className="order.price"></svg-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" align="center">
          <template #header="{column}">
            <div class="header_col" @click="sort('stock')">
              {{ column.label }}
              <svg-icon :name="order.stock" :className="order.stock"></svg-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="author"
            align="center"
            label="作者">
        </el-table-column>
        <el-table-column
            prop="texture"
            align="center"
            label="材质">
        </el-table-column>
        <el-table-column
            prop="size"
            align="center"
            label="尺寸">
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
      order: {
        price: 'asc',
        stock: 'asc'
      },
      orderArr: ['price asc', 'stock desc'],
      form: {
        host: '',
        port: '',
        user: '',
        password: '',
        database: ''
      },
      fields: [
        {key: 'title', label: '标题'},
        {key: 'price', label: '价格'},
        {key: 'stock', label: '库存'},
        {key: 'author', label: '作者'},
        {key: 'texture', label: '材质'},
        {key: 'size', label: '尺寸'}
      ],
      tableData: []
    }
  },
  computed: {
    params () {
      if (this.select && this.input) {
        // eslint-disable-next-line standard/object-curly-even-spacing
        return {condition: {field: this.select, value: this.input, isBlur: this.isBlur }, pagination: this.pagination, order: this.orderArr}
      } else {
        return {pagination: this.pagination, order: this.orderArr}
      }
    }
  },
  components: {
    Loading
  },
  methods: {
    sort (field) {
      this.order[field] = this.order[field] === 'asc' ? 'desc' : 'asc'
      this.orderArr = []
      for (const [key, vaue] of Object.entries(this.order)) {
        if (key === field) {
          this.orderArr.unshift(`${key} ${vaue}`)
        } else {
          this.orderArr.push(`${key} ${vaue}`)
        }
      }
      this.query()
    },
    query () {
      this.loading = true
      this.tableData = []
      let {code, data, msg, total} = ipcRenderer.sendSync('select', this.params)
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
