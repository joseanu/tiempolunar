import Vue from 'vue';
import App from './App.vue';

import Parse from 'parse/dist/parse.js';
import * as d3 from 'd3';

Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  'U3qVQ5eByTF3SMvNlu73kNeEH85zYhjzD1Vwfc6Y', // This is your Application ID
  'Wpj09eJV4XTot6Ketbivxm1m5JxaH4qhgFYM4oWI', // This is your Javascript key
);

const locale = {
  dateTime: '%x, %X',
  date: '%d/%m/%Y',
  time: '%-I:%M:%S %p',
  periods: ['AM', 'PM'],
  days: [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ],
  shortDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  months: [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ],
  shortMonths: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
};
d3.timeFormatDefaultLocale(locale);

//Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
