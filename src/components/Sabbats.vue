<template>
  <g>
    <symbol id="marcador" overflow="visible">
      <path
        class="simbolo"
        d="M4.4 1.1h31.2c1.8 0 3.3 1.5 3.3 3.3v8.2c0 1.8-1.5 3.3-3.3 3.3H4.4c-1.8 0-3.3-1.5-3.3-3.3V4.4c0-1.8 1.5-3.3 3.3-3.3z"
        transform="translate(-30,-12.675) scale(1.5)"
      />
    </symbol>
    <circulo sw="2" :radio="fuera"></circulo>
    <circulo sw="2" :radio="dentro"></circulo>
    <use
      xlink:href="#marcador"
      v-for="item in fechasSabbats"
      width="100%"
      height="100%"
      :key="item.estaciones"
      :x="cX"
      :y="cY - dentro - (ancho / 2)"
      :transform="rotaAngulo(item.angulo) + ''"
    />
    <linea-rotada
      v-for="item in fechasSabbats"
      :key="item.estaciones"
      sw="1"
      :offsetY="dentro"
      :largo="ancho"
      :angulo="item.angulo"
    ></linea-rotada>
    <use
      xlink:href="#marcador"
      v-for="item in imbolc"
      width="100%"
      height="100%"
      :key="item.angulo"
      :x="cX"
      :y="cY - dentro - (ancho / 2)"
      :transform="rotaAngulo(item.angulo) + ''"
    />
  </g>
</template>

<script>
import Parse from 'parse/dist/parse.js';
import * as d3 from 'd3';

import { store } from '../store.js';
import Circulo from './Circulo';
import LineaRotada from './LineaRotada';

export default {
  name: 'Sabbats',
  props: ['luna'],
  data() {
    return {
      estaciones: [],
      sabbatsMenores: store.sabbatsMenores,
      cX: store.cX(),
      cY: store.cY(),
      ancho: (store.radios.sabbats.ancho * store.dim.ancho) / 2,
      fuera: (store.radios.sabbats.fuera * store.dim.ancho) / 2,
      dentro:
        ((store.radios.sabbats.fuera - store.radios.sabbats.ancho) *
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
    fechasSabbats() {
      return this.estaciones.reduce((nuevo, item) => {
        const angulo = this.escala(item.timestamp);
        if (0 <= angulo && angulo < 360) {
          if (nuevo.length < 10) {
            nuevo.push({
              angulo: this.escala(item.timestamp),
              estacion: item.estacion,
            });
          }
        }
        return nuevo;
      }, []);
    },
    imbolc() {
      return d3.timeDay
        .range(this.fechaInicio, this.fechaFin)
        .reduce((nuevo, item) => {
          if (
            this.sabbatsMenores.indexOf(
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
  watch: {
    luna() {
      this.getEstaciones();
    },
  },
  methods: {
    rotaAngulo(angulo) {
      return `rotate(${angulo} ${this.cX} ${this.cY})`;
    },
    async getEstaciones() {
      const vm = this;
      const estaciones = Parse.Object.extend('estaciones');
      const query = new Parse.Query(estaciones);
      query.greaterThanOrEqualTo('timestamp', vm.fechaInicio.getTime());
      query.lessThanOrEqualTo('timestamp', vm.fechaFin.getTime());
      query.ascending('timestamp');
      const results = await query.find();
      vm.estaciones = results.map(obj => {
        return {
          timestamp: new Date(obj.get('timestamp')),
          estacion: obj.get('estacion'),
        };
      });
    },
  },
  created() {
    this.getEstaciones();
  },
  components: {
    Circulo,
    LineaRotada,
  },
};
</script>

<style scoped>
.simbolo {
  fill: #f7f7f7;
  stroke: #000000;
}
</style>
