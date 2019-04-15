<template>
  <g>
    <circulo sw="2" :radio="fuera"></circulo>
    <linea-rotada
      v-for="item in treceLunas"
      :key="item.angulo"
      sw="1"
      :offsetY="dentro"
      :largo="interior"
      :angulo="item.angulo"
    ></linea-rotada>
    <circulo sw="2" :radio="dentro"></circulo>
    <circulo sw="2" :radio="margen"></circulo>
  </g>
</template>

<script>
import * as d3 from 'd3';

import { store } from '../store.js';
import Circulo from './Circulo';
import LineaRotada from './LineaRotada';

export default {
  name: 'Lunas',
  props: ['luna'],
  data() {
    return {
      estaciones: [],
      iniciosLunas: store.iniciosLunas,
      cX: store.cX(),
      cY: store.cY(),
      ancho: (store.radios.lunas.ancho * store.dim.ancho) / 2,
      fuera: (store.radios.lunas.fuera * store.dim.ancho) / 2,
      dentro:
        ((store.radios.lunas.fuera - store.radios.lunas.ancho) *
          store.dim.ancho) /
        2,
      interior:
        (store.radios.dias.fuera - store.radios.lunas.fuera + store.radios.lunas.ancho) *
          store.dim.ancho / 2,
      margen:
        ((store.radios.lunas.fuera -
          store.radios.lunas.ancho -
          store.radios.lunas.margen) *
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
    treceLunas() {
      return d3.timeDay
        .range(this.fechaInicio, this.fechaFin)
        .reduce((nuevo, item) => {
          if (
            this.iniciosLunas.indexOf(
              JSON.stringify([item.getDate(), item.getMonth()]),
            ) > -1
          ) {
            const angulo = this.escala(item.getTime());
            if (0 <= angulo && angulo < 360) {
              nuevo.push({
                angulo,
              });
            }
          }
          return nuevo;
        }, []);
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
