import { Tablero, cartas, intentos, retardoCartas, tablero } from "./model";
import {
  asignarIndiceCartasVolteadas,
  barajarCartas,
  comprobarNumeroCartasVolteadas,
  esPartidaCompleta,
  parejaEncontrada,
  parejaNoEncontrada,
  resetTablero,
  sePuedeVoltearCarta,
  sonPareja,
  sumarIntentos,
} from "./motor";

const esElementoDiv = (elemento: HTMLElement | Element | null): elemento is HTMLDivElement => {
  return elemento !== null && elemento instanceof HTMLDivElement;
};

const esElementoImagen = (elemento: HTMLElement | Element | null): elemento is HTMLImageElement => {
  return elemento !== null && elemento instanceof HTMLImageElement;
};

const cambioDisplaysPartidaCompleta = () => {
  const divWinner = document.getElementById("winner");
  const divImagenes = document.querySelectorAll(".div-carta");
  divImagenes.forEach((divImagen) => {
    if (esElementoDiv(divImagen)) divImagen.style.display = "none";
  });
  if (esElementoDiv(divWinner)) divWinner.style.display = "inline";
};

const cambioDisplaysPartidaIniciada = () => {
  const divWinner = document.getElementById("winner");
  const divImagenes = document.querySelectorAll(".div-carta");
  divImagenes.forEach((divImagen) => {
    if (esElementoDiv(divImagen)) divImagen.style.display = "flex";
  });
  if (esElementoDiv(divWinner)) divWinner.style.display = "none";
};

export const mensajePartida = (tablero: Tablero) => {
  const divMensajePartida = document.getElementById("mensaje-partida");
  const estadoPartida = tablero.estadoPartida;
  if (esElementoDiv(divMensajePartida)) {
    switch (estadoPartida) {
      case "PartidaIniciada":
        divMensajePartida.textContent = "!!EMPIEZA EL JUEGO!!";
        cambioDisplaysPartidaIniciada();
        setTimeout(() => {
          divMensajePartida.textContent = "";
        }, 3000);
        break;
      case "PartidaCompleta":
        setTimeout(() => {
          divMensajePartida.textContent = "!!🏆PARTIDA COMPLETADA🏆!!";
          cambioDisplaysPartidaCompleta();
        }, 1300);
        break;
      default:
        console.error("error al mostrar mensaje partida");
    }
  }
};

const mensajeErrorCarta = (okSePuedeVoltear: boolean) => {
  if (!okSePuedeVoltear) alert("⚠️NO ES POSIBLE VOLTEAR CARTA⚠️");
};

export const mostrarIntentos = (intentos: number): void => {
  const divIntentos = document.getElementById("intentos");
  if (esElementoDiv(divIntentos)) divIntentos.textContent = `Intentos: ${intentos}`;
};

const voltearCarta = (tablero: Tablero, indice: number): void => {
  const cartaParaVoltear = { ...tablero.cartas[indice], estaVuelta: true };
  const imagenCarta = document.getElementById(`imagen-${indice}`);
  const divCarta = document.getElementById(`div-${indice}`);
  if (esElementoImagen(imagenCarta) && esElementoDiv(divCarta)) {
    tablero.cartas[indice] = cartaParaVoltear;
    imagenCarta.src = cartaParaVoltear.imagen;
    divCarta.style.backgroundColor = "#747bff";
    tablero.estadoPartida = "PartidaEnCurso";
  }
};

export const atenuarCartas = (indiceA: number, indiceB: number) => {
  const divCartaA = document.getElementById(`div-${indiceA}`);
  const divCartaB = document.getElementById(`div-${indiceB}`);
  if (esElementoDiv(divCartaA) && esElementoDiv(divCartaB)) {
    setTimeout(() => {
      divCartaA.style.opacity = "0.7";
      divCartaB.style.opacity = "0.7";
    }, retardoCartas);
  }
};

export const cartasBocaAbajo = (indiceA: number, indiceB: number): void => {
  setTimeout(() => {
    const imagenCartaA = document.getElementById(`imagen-${indiceA}`);
    const divCartaA = document.getElementById(`div-${indiceA}`);
    if (esElementoImagen(imagenCartaA) && esElementoDiv(divCartaA)) {
      imagenCartaA.src = "";
      divCartaA.style.backgroundColor = "skyblue";
    }
    const imagenCartaB = document.getElementById(`imagen-${indiceB}`);
    const divCartaB = document.getElementById(`div-${indiceB}`);
    if (esElementoImagen(imagenCartaB) && esElementoDiv(divCartaB)) {
      imagenCartaB.src = "";
      divCartaB.style.backgroundColor = "skyblue";
    }
  }, 500);
};

const resetDivsCartas = (tablero: Tablero): void => {
  tablero.cartas.forEach((carta, indice) => {
    const imgCartas = document.getElementById(`imagen-${indice}`);
    const divCartas = document.getElementById(`div-${indice}`);
    if (carta && esElementoImagen(imgCartas) && esElementoDiv(divCartas)) {
      imgCartas.src = "";
      divCartas.style.backgroundColor = "skyblue";
      divCartas.style.opacity = "1";
    }
  });
};

const gestionCartasVolteadas = (tablero: Tablero): void => {
  const indiceCartaA = tablero.indiceCartaVolteadaA;
  const indiceCartaB = tablero.indiceCartaVolteadaB;
  const okSonPareja = sonPareja(tablero);
  if (okSonPareja && indiceCartaA !== undefined && indiceCartaB !== undefined) {
    parejaEncontrada(tablero);
    atenuarCartas(indiceCartaA, indiceCartaB);
    esPartidaCompleta(tablero);
    mensajePartida(tablero);
  } else if (indiceCartaA !== undefined && indiceCartaB !== undefined) {
    parejaNoEncontrada(tablero);
    cartasBocaAbajo(indiceCartaA, indiceCartaB);
  }
};

const efectoGiroCarta = (indice: number) => {
  const divCarta = document.getElementById(`div-${indice}`);
  if (esElementoDiv(divCarta)) {
    const transformValue = divCarta.style.transform;
    divCarta.style.transform = transformValue.includes("180deg") ? "" : "rotateY(180deg)";
  }
};

const handleInicio = () => {
  resetTablero(tablero);
  resetDivsCartas(tablero);
  barajarCartas(cartas);
  mensajePartida(tablero);
  mostrarIntentos(intentos);
};

const handleCarta = (tablero: Tablero, indice: number) => {
  const okSePuedeVoltear = sePuedeVoltearCarta(tablero, indice);
  mensajeErrorCarta(okSePuedeVoltear);
  if (okSePuedeVoltear && tablero.estadoPartida !== "PartidaNoIniciada") {
    efectoGiroCarta(indice);
    voltearCarta(tablero, indice);
    asignarIndiceCartasVolteadas(tablero, indice);
    const okDosCartasLevantadas = comprobarNumeroCartasVolteadas(tablero);
    if (okDosCartasLevantadas) {
      sumarIntentos();
      mostrarIntentos(intentos);
      gestionCartasVolteadas(tablero);
    }
  }
};

export const eventos = () => {
  const botonInicio = document.getElementById("boton-inicio");
  if (botonInicio && botonInicio instanceof HTMLButtonElement) {
    botonInicio.addEventListener("click", handleInicio);
  }
  for (let indice = 0; indice <= cartas.length; indice++) {
    const divCarta = document.getElementById(`div-${indice}`);
    if (esElementoDiv(divCarta)) {
      divCarta.addEventListener("click", () => handleCarta(tablero, indice));
    }
  }
};
