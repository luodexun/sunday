<template>
 <div style="width: 100%;height: 100%">
   <el-button @click="send" style="margin-top: 300px">send</el-button>
 </div>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    send () {
      axios({
        method: 'put',
        url: '/api/private/v1/users/1',
        data: {
          email: 'service@vpaimai.com',
          mobile: '13756777653',
          password: '12345678 '
        }
      })
    }
  }
}
</script>

<style scoped>

</style>