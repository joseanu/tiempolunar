export const store = {
  fechaCero: new Date(2019, 1, 1),
  dim: {
    ancho: 1285,
    alto: 1285,
    margen: 5,
    borde: 10,
    signos: 118,
    planetas: 32,
    fechas: 64,
    lunas: 64,
    radioInterno: 60,
    textoFechas: 12,
  },
  radios: {
    signos: {
      fuera: 0.985768969,
      ancho: 0.180777096,
    },
    sabbats: {
      fuera: 0.804991872,
      ancho: 0.01639138,
    },
    dias: {
      fuera: 0.788600493,
      ancho: 0.037984374,
    },
    fases: {
      fuera: 0.750616119,
      ancho: 0.083058046,
    },
    semanas: {
      fuera: 0.667558072,
      ancho: 0.036809816,
    },
    lunas: {
      fuera: 0.630748257,
      ancho: 0.262503277,
      margen: 0.012951602,
    },
  },
  iniciosLunas: JSON.stringify([
    [16,4],
    [13,5],
    [11,6],
    [8,7],
    [6,8],
    [4,9],
    [1,10],
    [29,10],
    [27,11],
    [24,0],
    [21,1],
    [21,2],
    [18,3],
  ]),
  sabbatsMenores: JSON.stringify([
    [1,1],
    [1,4],
    [1,7],
    [1,10],
  ]),
  cX() {
    return this.dim.ancho / 2;
  },
  cY() {
    return this.dim.alto / 2;
  },
  radioBorde() {
    return Math.min(this.dim.ancho, this.dim.alto) / 2 - 2;
  },
  radioExterno() {
    return (
      Math.min(this.dim.ancho, this.dim.alto) / 2 -
      this.dim.margen -
      this.dim.borde
    );
  },
  radioSignos() {
    return this.radioExterno() - this.dim.signos;
  },
  radioPlanetas() {
    return this.radioSignos() - this.dim.planetas;
  },
  radioFechas() {
    return this.radioPlanetas() - this.dim.fechas;
  },
  radioLunas() {
    return this.radioFechas() - this.dim.lunas;
  },
};
