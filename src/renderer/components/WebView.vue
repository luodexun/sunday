<template>
  <iframe id="myWebview" name="myWebview" class="view" ref="web"></iframe>
</template>

<script>
export default {
  name: 'WebView'
}
</script>

<style scoped>
.view{
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>