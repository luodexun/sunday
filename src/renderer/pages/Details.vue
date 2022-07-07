<template>
 <div style="width: 100%;height: 100%;position: absolute;z-index: 3;display: flex">
   <ul style="width: 25%;list-style: none;overflow: hidden;display: flex;flex-direction: column;justify-content: end;color: #f67105">
     <li style="padding: 4px 0"><b>游戏ID:</b><span>{{$route.query.sellerRoleid}}</span></li>
     <li style="padding: 4px 0"><b>人物等级:</b><span>{{$route.query.level}}</span></li>
     <li style="padding: 4px 0"><b>游戏昵称:</b><span>{{$route.query.sellerName}}</span></li>
     <li style="padding: 4px 0"><b>角色名称:</b><span>{{$route.query.playName}}</span></li>
     <li style="padding: 4px 0"><b>界服名称:</b><span>{{$route.query.areaName}}</span></li>
     <li style="padding: 4px 0"><b>服务器ID:</b><span>{{$route.query.serverId}}</span></li>
     <li style="padding: 4px 0"><b>售价:</b><span>{{$route.query.price}}</span></li>
     <li style="padding: 4px 0"><b>出售状态:</b><span>{{$route.query.statusDesc}}</span></li>
     <li style="padding: 4px 0"><b>藏宝阁链接地址:</b><span>{{$route.query.cbgUrl}}</span></li>
     <li style="padding: 4px 0"><b>游戏渠道:</b><span>{{$route.query.gameChannel}}</span></li>
     <li style="padding: 4px 0"><b>卖家描述:</b><span>{{$route.query.umupShort}}</span></li>
   </ul>
   <div style="width: 50%">
     <Echart :option="this.option"></Echart>
     <el-radio-group v-model="tabPosition" style="position: absolute;bottom: 10px;right: 50%;transform: translateX(50%)" size="mini">
       <el-radio-button label="top">五行</el-radio-button>
       <el-radio-button label="bottom">属性</el-radio-button>
     </el-radio-group>
     <el-button style="position: absolute;bottom: 10px;right: 20px" icon="el-icon-arrow-left" size="mini" @click="$router.back()"></el-button>
   </div>
   <ul style="width: 25%;list-style: none;color: #6c2894">
     <li style="padding: 4px 0"><b>仙玉:</b><span>{{$route.query.xiaYu}}</span></li>
     <li style="padding: 4px 0"><b>大话币(银两):</b><span>{{$route.query.silver}}</span></li>
     <li style="padding: 4px 0"><b>帮派修炼:</b><span>{{$route.query.factionLevel}}</span></li>
     <li style="padding: 4px 0"><b>天演策:</b><span>{{$route.query.tianYanLevel}}</span></li>
     <li style="padding: 4px 0"><b>五行等级:</b><span>{{$route.query.wuXingLevel}}</span></li>
     <li style="padding: 4px 0"><b>套装品阶:</b><span>{{$route.query.suitLevel}}</span></li>
     <li style="padding: 4px 0"><b>套装:</b><span>{{$route.query.suitName}}</span></li>
     <li style="padding: 4px 0"><b>处理状态:</b><span>{{$route.query.status}}</span></li>
     <li style="padding: 4px 0"><b>返回状态编码:</b><span>{{$route.query.statusCode}}</span></li>
     <li style="padding: 4px 0"><b>创建时间:</b><span>{{$route.query.createTime}}</span></li>
     <li style="padding: 4px 0"><b>更新时间:</b><span>{{$route.query.updateTime}}</span></li>
   </ul>
 </div>
</template>

<script>
import axios from 'axios'
import Echart from '../components/Echart'
export default {
  data () {
    return {
      tabPosition: 'top'
    }
  },
  components: {
    Echart
  },
  computed: {
    option () {
      if (this.tabPosition === 'top') {
        const max = Math.max(Number(this.$route.query.gold), Number(this.$route.query.wood), Number(this.$route.query.water), Number(this.$route.query.fire), Number(this.$route.query.soil)) * 1.1
        return {
          color: ['#67F9D8'],
          radar: {
            // shape: 'circle',
            indicator: [
              { name: '金', max: max },
              { name: '木', max: max },
              { name: '水', max: max },
              { name: '火', max: max },
              { name: '土', max: max }
            ],
            center: ['50%', '50%'],
            shape: 'circle',
            axisName: {
              color: '#23e20d'
            }
          },
          series: [
            {
              name: 'Budget vs spending',
              type: 'radar',
              data: [
                {
                  value: [this.$route.query.gold, this.$route.query.wood, this.$route.query.water, this.$route.query.fire, this.$route.query.soil]
                }
              ]
            }
          ]
        }
      } else {
        const max = Math.max(Number(this.$route.query.hp), Number(this.$route.query.mp), Number(this.$route.query.ap), Number(this.$route.query.sp)) * 1.2
        return {
          color: ['#fa3e77'],
          radar: {
            // shape: 'circle',
            indicator: [
              { name: 'hp', max: max },
              { name: 'mp', max: max },
              { name: 'ap', max: max },
              { name: 'sp', max: max }
            ],
            center: ['50%', '50%'],
            shape: 'circle',
            axisName: {
              color: '#6c160c'
            }
          },
          series: [
            {
              name: 'Budget vs spending',
              type: 'radar',
              data: [
                {
                  value: [this.$route.query.hp, this.$route.query.mp, this.$route.query.ap, this.$route.query.sp]
                }
              ]
            }
          ]
        }
      }
    }
  },
  mounted () {
    console.log(this.$route)
  },
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