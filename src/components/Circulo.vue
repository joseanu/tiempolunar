<template>
  <circle :style="{ strokeWidth: sw }" :cx="cX" :cy="cY" :r="radio"></circle>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'Circulo',
  props: ['radio', 'sw'],
  data() {
    return {
      cX: store.cX(),
      cY: store.cY(),
    };
  },
};
</script>

<style scoped>
circle {
  fill: none;
  stroke: black;
}
</style>
