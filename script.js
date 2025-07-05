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
    pelotita.velocidadX *= -1;
    pelotita.x = katty.x + katty.ancho + pelotita.radio;
  }

  if (colisiona(pelotita, enemigo)) {
    pelotita.velocidadX *= -1;
    pelotita.x = enemigo.x - pelotita.radio;
  }

  if (pelotita.x - pelotita.radio < 0) {
    puntosEnemigo++;
    reiniciarpelotita();
  } else if (pelotita.x + pelotita.radio > ancho) {
    puntosKatty++;
    reiniciarpelotita();
  }

  
  if (puntosKatty >= 5) {
    mostrarVentana("¡Katty ha ganado! 🐾ฅ^>⩊<^ ฅ");
  } else if (puntosEnemigo >= 5) {
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

function pausarJuego() {
  enPausa = true;
}

function reanudarJuego() {
  enPausa = false;
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

actualizar();
