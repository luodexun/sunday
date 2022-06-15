<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="18" :offset="3"><el-input placeholder="请输入内容" v-model="input" size="small" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input></el-col>
      </el-row>
      <el-row>
        <el-col  :span="18" :offset="3">
          <div class="infinite-list-wrapper" style="overflow:auto">
            <ul
                class="list"
                v-infinite-scroll="load"
                infinite-scroll-disabled="disabled">
              <li v-for="i in count" class="list-item">{{ i }}</li>
            </ul>
            <p v-if="loading">加载中...</p>
            <p v-if="noMore">没有更多了</p>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      input: '',
      count: 10,
      loading: false
    }
  },
  computed: {
    noMore () {
      return this.count >= 20
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    load () {
      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    }
  }
}
</script>

<style scoped>
.list{
  height: 200px;
  overflow: scroll;
}
</style>
