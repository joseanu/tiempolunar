<template>
  <g>
    <circulo sw="2" :radio="fuera"></circulo>
    <linea-rotada
      v-for="item in ingresos"
      :key="item.signo"
      sw="1"
      :offsetY="dentro"
      :largo="ancho"
      :angulo="item.angulo"
    ></linea-rotada>
    <text
      v-for="item in ingreSignos"
      :key="item.signo"
      class="signos"
      :x="cX"
      :y="cY - dentro - (ancho) / 2"
      :transform="rotaAngulo(item.angulo)"
    >{{ item.signo }}</text>
    <circulo sw="2" :radio="dentro"></circulo>
  </g>
</template>

<script>
import Parse from 'parse/dist/parse.js';
import * as d3 from 'd3';

import { store } from '../store.js';
import Circulo from './Circulo';
import LineaRotada from './LineaRotada';

const charSignos = {
  ar: '\u2648\uFE0E',
  ta: '\u2649\uFE0E',
  ge: '\u264A\uFE0E',
  ca: '\u264B\uFE0E',
  le: '\u264C\uFE0E',
  vi: '\u264D\uFE0E',
  li: '\u264E\uFE0E',
  es: '\u264F\uFE0E',
  sa: '\u2650\uFE0E',
  cp: '\u2651\uFE0E',
  ac: '\u2652\uFE0E',
  pi: '\u2653\uFE0E',
};

export default {
  name: 'Signos',
  props: ['luna'],
  data() {
    return {
      signos: [],
      cX: store.cX(),
      cY: store.cY(),
      ancho: store.radios.signos.ancho * store.dim.ancho / 2,
      fuera: (store.radios.signos.fuera * store.dim.ancho) / 2,
      dentro:
        ((store.radios.signos.fuera - store.radios.signos.ancho) *
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
    ingresos() {
      return this.signos.reduce((nuevo, item) => {
        const angulo = this.escala(item.timestamp);
        if (0 <= angulo && angulo < 360) {
          if (nuevo.length < 1020) {
            nuevo.push({
              angulo: this.escala(item.timestamp),
              signo: item.signo,
            });
          }
        }
        return nuevo;
      }, []);
    },
    ingreSignos() {
      const result = [];
      for (let i = 0, len = this.ingresos.length; i < len; i++) {
        if (i < this.ingresos.length - 1) {
          result.push({
            angulo:
              this.ingresos[i].angulo +
              (this.ingresos[i + 1].angulo - this.ingresos[i].angulo) / 2,
            signo: charSignos[this.ingresos[i].signo],
          });
        } else if ((i = this.ingresos.length - 1)) {
          result.push({
            angulo:
              this.ingresos[i].angulo +
              (360 - this.ingresos[i].angulo + this.ingresos[0].angulo) / 2,
            signo: charSignos[this.ingresos[i].signo],
          });
        }
      }
      return result;
    },
  },
  watch: {
    luna(val) {
      this.getSignos();
    },
  },
  methods: {
    rotaAngulo(angulo) {
      return `rotate(${angulo} ${this.cX} ${this.cY})`;
    },
    async getSignos() {
      const vm = this;
      const signos = Parse.Object.extend('signos');
      const query = new Parse.Query(signos);
      query.equalTo('planeta', 's');
      query.greaterThanOrEqualTo('timestamp', this.fechaInicio.getTime());
      query.lessThanOrEqualTo('timestamp', this.fechaFin.getTime());
      query.ascending('timestamp');
      const results = await query.find();
      this.signos = results.map(obj => {
        return {
          timestamp: new Date(obj.get('timestamp')),
          signo: obj.get('signo'),
        };
      });
    },
  },
  created() {
    this.getSignos();
  },
  components: {
    Circulo,
    LineaRotada,
  },
};
</script>

<style scoped>
text {
  text-anchor: middle;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
.signos {
  font-size: 48px;
}
</style>
