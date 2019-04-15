<template>
  <g>
    <circulo sw="1" :radio="fuera"></circulo>
    <linea-rotada
      v-for="item in fasesLuna"
      :key="item.angulo"
      sw="2"
      :offsetY="fuera"
      :largo="15"
      :angulo="item.angulo"
    ></linea-rotada>
    <text
      v-for="item in fasesLuna"
      :key="`t${item.angulo}`"
      class="fases"
      :x="cX"
      :y="cY - dentro - 12"
      :transform="rotaAngulo(item.angulo)"
    >{{ item.fase }}</text>
    <circulo sw="1" :radio="dentro"></circulo>
  </g>
</template>

<script>
import Parse from 'parse/dist/parse.js';
import * as d3 from 'd3';

import { store } from '../store.js';
import Circulo from './Circulo';
import LineaRotada from './LineaRotada';

export default {
  name: 'Fases',
  props: ['luna'],
  data() {
    return {
      fases: [],
      cX: store.cX(),
      cY: store.cY(),
      ancho: (store.radios.fases.ancho * store.dim.ancho) / 2,
      fuera: (store.radios.fases.fuera * store.dim.ancho) / 2,
      dentro:
        ((store.radios.fases.fuera - store.radios.fases.ancho) *
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
    fasesLuna() {
      const chars = {
        m: '🌗',
        n: '🌑',
        c: '🌓',
        l: '🌕',
      };
      return this.fases.reduce((nuevo, item) => {
        const angulo = this.escala(item.timestamp);
        if (0 <= angulo && angulo < 360) {
          nuevo.push({
            angulo: this.escala(d3.timeDay.round(item.timestamp)),
            fase: chars[item.fase],
          });
        }
        return nuevo;
      }, []);
    },
  },
  watch: {
    luna(val) {
      this.getFases();
    },
  },
  methods: {
    rotaAngulo(angulo) {
      return `rotate(${angulo} ${this.cX} ${this.cY})`;
    },
    async getFases() {
      const vm = this;
      const fases = Parse.Object.extend('fases');
      const query = new Parse.Query(fases);
      query.greaterThanOrEqualTo('timestamp', this.fechaInicio.getTime());
      query.lessThanOrEqualTo('timestamp', this.fechaFin.getTime());
      query.ascending('timestamp');
      const results = await query.find();
      this.fases = results.map(obj => {
        return {
          timestamp: new Date(obj.get('timestamp')),
          fase: obj.get('fase'),
        };
      });
    },
  },
  created() {
    this.getFases();
  },
  components: {
    Circulo,
    LineaRotada,
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'color-emoji';
  src: local('Apple Color Emoji'), local('Segoe UI Emoji'),
    local('Segoe UI Symbol'), local('Noto Color Emoji');
}
.fases {
  text-anchor: middle;
  font-size: 36px;
  font-family: 'color-emoji';
}
</style>
