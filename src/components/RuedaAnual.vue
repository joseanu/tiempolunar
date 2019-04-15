<template>
  <div id="ruedaAnual">
    <p>{{ this.fechaInicio }}</p>
    <p>{{ this.fechaFin }}</p>
    <p>{{ this.dias }}</p>

    <input type="range" min="1" max="33" step="1" v-model="luna">
    {{ luna }}
    <svg
      :width="dim.ancho / 2"
      :height="dim.alto / 2"
      viewBox="0 0 1285 1285"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path id="curvaFechas" :d="curvaFechas"></path>
      </defs>
      <g>
        <g>
          <circulo sw="2" :radio="radioBorde"></circulo>
          <signos :luna="luna"></signos>
          <dias :luna="luna"></dias>
          <sabbats :luna="luna"></sabbats>
          <fases :luna="luna"></fases>
          <semanas :luna="luna"></semanas>
          <lunas :luna="luna"></lunas>
        </g>
        <g>
          <line class="linea-hoy" :x1="cX" :y1="cY" :x2="cX" :y2="0" :transform="rotaAngulo(hoy)"></line>
          <line
            v-for="item in doceMeses"
            :key="item.angulo"
            class="linea"
            :x1="cX"
            :y1="cY - radioExterno"
            :x2="cX"
            :y2="cY - radioExterno - dim.borde"
            :transform="rotaAngulo(item.angulo)"
          ></line>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import Parse from 'parse/dist/parse.js';
import * as d3 from 'd3';

import { store } from '../store';
import Circulo from './Circulo';
import LineaRotada from './LineaRotada';
import Signos from './Signos';
import Sabbats from './Sabbats';
import Dias from './Dias';
import Fases from './Fases';
import Semanas from './Semanas';
import Lunas from './Lunas';

const charPlanetas = {
  s: '\u2609\uFE0E',
  me: '\u263F\uFE0E',
  ve: '\u2640\uFE0E',
  ma: '\u2642\uFE0E',
  ju: '\u2643\uFE0E',
  sa: '\u2644\uFE0E',
  ur: '\u2645\uFE0E',
  ne: '\u2646\uFE0E',
  pl: '\u2647\uFE0E',
};

export default {
  name: 'RuedaAnual',
  data() {
    return {
      luna: 1,
      fechaCero: store.fechaCero,
      fases: [],
      estaciones: [],
      planetas: [],
      posiciones: [],
      dim: store.dim,
      cX: store.cX(),
      cY: store.cY(),
      radioBorde: store.radioBorde(),
      radioExterno: store.radioExterno(),
      radioSignos: store.radioSignos(),
      radioPlanetas: store.radioPlanetas(),
      radioFechas: store.radioFechas(),
      radioLunas: store.radioLunas(),
    };
  },
  computed: {
    fechaInicio() {
      return d3.timeYear.offset(this.fechaCero, this.luna - 1);
    },
    fechaFin() {
      return d3.timeYear.offset(this.fechaInicio, 1);
    },
    dias() {
      return d3.timeDay.count(this.fechaInicio, this.fechaFin);
    },
    curvaFechas() {
      const deltaX = Math.sin(Math.PI / this.dias);
      const deltaY = Math.sin(((90 - 180 / this.dias) * Math.PI) / 180);
      const radio =
        this.radioFechas + (this.dim.fechas - this.dim.textoFechas) / 1.5;
      return `M${this.cX - deltaX * radio},${this.cY - deltaY * radio}
          A${radio},${radio} 0 0 1 ${this.cX + deltaX * radio},${this.cY -
        deltaY * radio}`;
    },
    escala() {
      return d3
        .scaleTime()
        .domain([this.fechaInicio, this.fechaFin])
        .range([0, 360]);
    },
    hoy() {
      return this.escala(Date.now());
    },
    doceMeses() {
      return d3.timeDay
        .range(this.fechaInicio, this.fechaFin)
        .reduce((nuevo, item) => {
          if (item.getDate() === 1) {
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
    ingrePlanetas() {
      return this.planetas.reduce((nuevo, item) => {
        const angulo = this.escala(item.timestamp);
        if (0 <= angulo && angulo < 360) {
          nuevo.push({
            angulo:
              this.escala(d3.timeDay.floor(item.timestamp)) + 180 / this.dias,
            evento:
              charPlanetas[item.planeta] +
              '→' +
              charSignos[item.signo] +
              (Boolean(item.r) ? '\u211E' : ''),
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
    rotaTexto(n) {
      return `rotate(${(n - 0.5) * (360 / this.dias)} ${this.cX} ${this.cY})`;
    },
    rotaAngulo(angulo) {
      return `rotate(${angulo} ${this.cX} ${this.cY})`;
    },
    getFecha(n) {
      const fecha = d3.timeDay.offset(
        this.fechaInicio,
        n - 1 + (this.luna - 1) * this.dias,
      );
      return d3.timeFormat('%a %d %b')(fecha);
    },
  },
  components: {
    Circulo,
    LineaRotada,
    Signos,
    Sabbats,
    Dias,
    Fases,
    Semanas,
    Lunas,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
svg {
  display: block;
}
.linea {
  fill: none;
  stroke: black;
}
.linea2 {
  fill: none;
  stroke: black;
  stroke-width: 2;
}
.linea-hoy {
  fill: none;
  stroke: red;
  stroke-width: 3;
}
text {
  text-anchor: middle;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}
.numeros {
  font-size: 14px;
}
.ingrePlanetas {
  font-size: 12px;
}
</style>
