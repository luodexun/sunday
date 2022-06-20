<template>
  <svg :class="svgClass" aria-hidden="true" @click="$emit('click')">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.name}`
    },
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 0.9em;
  height: 0.9em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>