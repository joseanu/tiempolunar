<template>
  <line
    :style="{ strokeWidth: sw }"
    :x1="cX"
    :y1="cY - offsetY"
    :x2="cX"
    :y2="cY - offsetY - largo"
    :transform="rotaAngulo(angulo)"
  ></line>
</template>

<script>
import { store } from '../store.js';

export default {
  name: 'LineaRotada',
  props: ['offsetY', 'largo', 'angulo', 'sw'],
  data() {
    return {
      cX: store.cX(),
      cY: store.cY(),
    };
  },
  methods: {
    rotaAngulo(angulo) {
      return `rotate(${angulo} ${this.cX} ${this.cY})`;
    },
  },
};
</script>

<style scoped>
line {
  fill: none;
  stroke: black;
}
</style>
