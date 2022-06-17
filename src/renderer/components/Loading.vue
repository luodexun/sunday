<template>
  <div class="wrapper">
     <span v-for="item in span" :style="{animationDelay:`${item * 0.1}s`}" :key="item" class="item"/>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      span: [0, 1, 2, 3, 4]
    }
  }
}
</script>

<style scoped>
 .wrapper{
    display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 70px;
 }
 @keyframes grow{
  0%,100%{height: 0.8rem}
   50%{height: 2.5rem}
 }
 .item{
   background-color: rgb(210,54,105);
   border-radius: 4px;
   width: 4px;
   height: 10px;
   margin-right: 4px;
   animation: grow 1s infinite 0s;
 }
</style>
