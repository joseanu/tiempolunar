<template>
  <g>
    <circulo sw="1" :radio="fuera"></circulo>
    <line
      v-for="n in dias"
      :key="n"
      :x1="cX"
      :y1="cY - dentro"
      :x2="cX"
      :y2="cY - fuera"
      :transform="rotaLinea(n)"
    ></line>
    <circulo sw="1" :radio="dentro"></circulo>
  </g>
</template>

<script>
import * as d3 from 'd3';

import { store } from '../store.js';
import Circulo from './Circulo';
import LineaRotada from './LineaRotada';

export default {
  name: 'Dias',
  props: ['luna'],
  data() {
    return {
      estaciones: [],
      cX: store.cX(),
      cY: store.cY(),
      ancho: (store.radios.dias.ancho * store.dim.ancho) / 2,
      fuera: (store.radios.dias.fuera * store.dim.ancho) / 2,
      dentro:
        ((store.radios.dias.fuera - store.radios.dias.ancho) *
          store.dim.ancho) /
        2,
    };
  },
  computed: {
    fechaInicio() {
      return d3.timeYear.offset(store.fechaCero, this.$props.luna - 1);
    },
    fechaFin() {
      return d3.timeYear.offset(this.fechaInicio, 1);
    },
    dias() {
      return d3.timeDay.count(this.fechaInicio, this.fechaFin);
    },
    escala() {
      return d3
        .scaleTime()
        .domain([this.fechaInicio, this.fechaFin])
        .range([0, 360]);
    },
  },
  methods: {
    rotaLinea(n) {
      return `rotate(${(n - 1) * (360 / this.dias)} ${this.cX} ${this.cY})`;
    },
  },
  components: {
    Circulo,
    LineaRotada,
  },
};
</script>

<style scoped>
line {
  fill: none;
  stroke: black;
}
</style>
