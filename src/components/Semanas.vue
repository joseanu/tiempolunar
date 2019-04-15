<template>
  <g>
    <circulo sw="1" :radio="fuera"></circulo>
    <linea-rotada
      v-for="item in weeks"
      :key="item.angulo"
      sw="1"
      :offsetY="dentro"
      :largo="interior"
      :angulo="item.angulo"
    ></linea-rotada>
    <circulo sw="2" :radio="dentro"></circulo>
  </g>
</template>

<script>
import * as d3 from 'd3';

import { store } from '../store.js';
import Circulo from './Circulo';
import LineaRotada from './LineaRotada';

export default {
  name: 'Semanas',
  props: ['luna'],
  data() {
    return {
      iniciosLunas: store.iniciosLunas,
      cX: store.cX(),
      cY: store.cY(),
      ancho: (store.radios.semanas.ancho * store.dim.ancho) / 2,
      fuera: (store.radios.semanas.fuera * store.dim.ancho) / 2,
      dentro:
        ((store.radios.semanas.fuera - store.radios.semanas.ancho) *
          store.dim.ancho) /
        2,
      interior:
        ((store.radios.fases.fuera -
          store.radios.semanas.fuera +
          store.radios.semanas.ancho) *
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
    escala() {
      return d3
        .scaleTime()
        .domain([this.fechaInicio, this.fechaFin])
        .range([0, 360]);
    },
    weeks() {
      const vm = this;
      return d3.timeDay
        .range(this.fechaInicio, this.fechaFin)
        .reduce((nuevo, item) => {
          if (
            this.iniciosLunas.indexOf(
              JSON.stringify([item.getDate(), item.getMonth()]),
            ) > -1
          ) {
            [1, 2, 3].forEach(function(n) {
              const angulo = vm.escala(
                d3.timeDay.offset(item, 7 * n).getTime(),
              );
              if (0 <= angulo && angulo < 360) {
                nuevo.push({
                  angulo,
                });
              }
            });
          }
          return nuevo;
        }, []);
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
