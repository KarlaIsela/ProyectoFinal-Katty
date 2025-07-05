/* Agregando sonidos */

const sonidoPelotita = new Audio('media/ping.mp3');          // rebote contra paletas
const sonidoChoque = new Audio('media/choque.mp3');   // rebote contra arriba/abajo
const sonidoGanar = new Audio('media/ganar.mp3');          // cuando gana Katty
const sonidoPerder = new Audio('media/perder.mp3');        // cuando gana el enemigo
const sonidoClick = new Audio('media/click.mp3');          // al hacer clic en botones

const lienzo = document.getElementById("juego");
const pincel = lienzo.getContext("2d");

const ancho = lienzo.width;
const alto = lienzo.height;

const katty = {
  x: 20,
  y: alto / 2 - 50,
  ancho: 15,
  alto: 100,
  color: "#ff69b4",
  velocidad: 7,
  direccion: 0
};

const enemigo = {
  x: ancho - 35,
  y: alto / 2 - 50,
  ancho: 15,
  alto: 100,
  color: "#ba68c8",
  velocidad: 4
};

const pelotita = {
  x: ancho / 2,
  y: alto / 2,
  radio: 10,
  velocidadX: 5,
  velocidadY: 5,
  color: "#ab47bc"
};

let puntosKatty = 0;
let puntosEnemigo = 0;
let enPausa = false;

function dibujarRectangulo(obj) {
  pincel.fillStyle = obj.color;
  pincel.fillRect(obj.x, obj.y, obj.ancho, obj.alto);
}

function dibujarCirculo(obj) {
  pincel.fillStyle = obj.color;
  pincel.beginPath();
  pincel.arc(obj.x, obj.y, obj.radio, 0, Math.PI * 2);
  pincel.fill();
}

function dibujarTexto() {
  pincel.fillStyle = "#d63384";
  pincel.font = "24px Comic Sans MS";
  pincel.fillText(`Katty ${puntosKatty}`, 50, 30);
  pincel.fillText(`Rey Ratón ${puntosEnemigo}`, ancho - 200, 30);
}

function moverKatty() {
  katty.y += katty.direccion * katty.velocidad;
  if (katty.y < 0) katty.y = 0;
  if (katty.y + katty.alto > alto) katty.y = alto - katty.alto;
}

function moverEnemigo() {
  const centro = enemigo.y + enemigo.alto / 2;
  if (pelotita.y < centro - 10) enemigo.y -= enemigo.velocidad;
  else if (pelotita.y > centro + 10) enemigo.y += enemigo.velocidad;
}

function moverpelotita() {
  pelotita.x += pelotita.velocidadX;
  pelotita.y += pelotita.velocidadY;

  if (pelotita.y - pelotita.radio < 0 || pelotita.y + pelotita.radio > alto) {
    pelotita.velocidadY *= -1;
  }

  if (colisiona(pelotita, katty)) {    
    sonidoPelotita.currentTime = 0;
    sonidoPelotita.play();
    pelotita.velocidadX *= -1;
    pelotita.x = katty.x + katty.ancho + pelotita.radio;
  }

  if (colisiona(pelotita, enemigo)) {
    sonidoPelotita.currentTime = 0;
    sonidoPelotita.play();
    pelotita.velocidadX *= -1;
    pelotita.x = enemigo.x - pelotita.radio;
  }

  if (pelotita.x - pelotita.radio < 0) {
    sonidoChoque.currentTime = 0;
    sonidoChoque.play(); 
    puntosEnemigo++;
    reiniciarpelotita();
  } else if (pelotita.x + pelotita.radio > ancho) {
    sonidoChoque.currentTime = 0;
    sonidoChoque.play(); 
    puntosKatty++;
    reiniciarpelotita();
  }

  
  if (puntosKatty >= 5) {
    sonidoGanar.play();
    mostrarVentana("¡Katty ha ganado! 🐾ฅ^>⩊<^ ฅ");
  } else if (puntosEnemigo >= 5) {
    sonidoPerder.play();
    mostrarVentana("Oh no... ¡el rey ratón ganó! 🐭");
  }

}

function colisiona(p, r) {
  return (
    p.x - p.radio < r.x + r.ancho &&
    p.x + p.radio > r.x &&
    p.y + p.radio > r.y &&
    p.y - p.radio < r.y + r.alto
  );
}

function reiniciarpelotita() {
  pelotita.x = ancho / 2;
  pelotita.y = alto / 2;
  pelotita.velocidadX *= -1;
  pelotita.velocidadY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function actualizarBotonesEstado() {
  const btnPausa = document.querySelector(".btn-pausa");
  const btnReanudar = document.querySelector(".btn-reanudar");
  const btnReiniciar = document.querySelector(".btn-reiniciar");

  if (enPausa) {
    btnPausa.classList.add("active");
    btnReiniciar.disabled = true; // Reanudar también deshabilitado.
  } else {
    btnPausa.classList.remove("active");
    btnReiniciar.disabled = false; // Reanudar habilitado.
  }
}

function pausarJuego() {
  enPausa = true;
  actualizarBotonesEstado();
}

function reanudarJuego() {
  enPausa = false;
  actualizarBotonesEstado();
}

function reiniciarJuego() {
  cerrarVentana();
  puntosKatty = 0;
  puntosEnemigo = 0;
  pelotita.x = ancho / 2;
  pelotita.y = alto / 2;
  pelotita.velocidadX = 5 * (Math.random() > 0.5 ? 1 : -1);
  pelotita.velocidadY = 5 * (Math.random() > 0.5 ? 1 : -1);
  enPausa = false;
}

function dibujarTodo() {
  pincel.clearRect(0, 0, ancho, alto);
  dibujarRectangulo(katty);
  dibujarRectangulo(enemigo);
  dibujarCirculo(pelotita);
  dibujarTexto();
}

function mostrarVentana(mensaje) {
  document.getElementById("mensaje-ventana").textContent = mensaje;
  document.getElementById("ventana").classList.remove("oculto");
  enPausa = true;
}

function cerrarVentana() {
  document.getElementById("ventana").classList.add("oculto");
}

function actualizar() {
  if (!enPausa) {
    moverKatty();
    moverEnemigo();
    moverpelotita();
    dibujarTodo();
  }
  requestAnimationFrame(actualizar);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") katty.direccion = -1;
  else if (e.key === "ArrowDown") katty.direccion = 1;
});

document.addEventListener("keyup", () => {
  katty.direccion = 0;
});

document.querySelectorAll("button").forEach(boton => {
  boton.addEventListener("click", () => {
    sonidoClick.currentTime = 0;
    sonidoClick.play();

    setTimeout(() => {
      sonidoClick.pause();
      sonidoClick.currentTime = 0; // Reiniciar para futuros clics
    }, 300); // 300 ms = 0.3 segundos
  });
});

actualizar();
