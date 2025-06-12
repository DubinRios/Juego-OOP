class Game {
  constructor() {
    this.container = document.getElementById("game-container");
    this.puntosElement = document.getElementById("puntos");
    this.personaje = null;
    this.monedas = [];
    this.puntuacion = 0;

    //Agregar musica de fondo//
    this.backgroundMusic = new Audio(`./Sonidos/FONDOMUSICAL.mp3`);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.1;  
    this.backgroundMusic.play();

    this.aplauso = new Audio(`./Sonidos/aplausos.mp3`);
    
    this.crearEscenario();
    this.agregarEventos();
  }

  crearEscenario() {
    this.personaje = new Personaje();
    this.container.appendChild(this.personaje.element);

    for (let i = 0; i < 5; i++) {
      const moneda = new Moneda(imagenesMonedas[i]);
      this.monedas.push(moneda);
      this.container.appendChild(moneda.element);
    }
  }

  agregarEventos() {
    window.addEventListener("keydown", (e) => this.personaje.mover(e));
    this.checkColisiones();
  }

  checkColisiones() {
    const sonidoMordida = document.getElementById("Mordida");
    setInterval(() => {
      this.monedas.forEach((moneda, index) => {
        if (this.personaje.colisionaCon(moneda)) {
          this.container.removeChild(moneda.element);
          this.monedas.splice(index, 1);
          this.actualizarPuntuacion(10);
          sonidoMordida.play();
          if (this.monedas.length === 0) {
            this.personaje.cambiarEstadoAGordo();
          }
        }
      });
    }, 100);
  }

  actualizarPuntuacion(puntos) {
    this.puntuacion += puntos;
    this.puntosElement.textContent = `Puntos: ${this.puntuacion}`;
  }
}

class Personaje {
  constructor() {
    this.x = 80;
    this.y = 180;
    this.width = 100;
    this.height = 150;
    this.velocidad = 10;
    this.saltando = false;
    this.element = document.createElement("img");
    this.element.src = "https://i.ibb.co/gLtpq69d/Flaco.png"
    this.element.classList.add("personaje");
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.actualizarPosicion();
  }

  mover(evento) {
    const contenedor = document.getElementById("game-container");
         const limiteDerecho = contenedor.offsetWidth - this.width; // Agregada variable para aplicar limites a lo ancho.
    if (evento.key === "ArrowRight") {
      this.x += this.velocidad;
      if (this.x > limiteDerecho) this.x = limiteDerecho; // Para que choque al llegar al limite derecho.
    } else if (evento.key === "ArrowLeft") {
      this.x -= this.velocidad;
      if (this.x < 0) this.x = 0; // Para que detenga su movimiento al llegar al limite izquierdo.
    } else if (evento.key === "ArrowUp" && !this.saltando) {
      this.saltar();
    }

    this.actualizarPosicion();
  }

  saltar() {
    this.saltando = true;
    let alturaMaxima = this.y - 180;

    const salto = setInterval(() => {
      if (this.y > alturaMaxima) {
        this.y -= 20;
      } else {
        clearInterval(salto);
        this.caer();
      }
      this.actualizarPosicion();
    }, 20);
    const sonidoSalto = document.getElementById("salto");
    sonidoSalto.play();
  }

  caer() {
    const gravedad = setInterval(() => {
      if (this.y < 180) {
        this.y += 10;
      } else {
        clearInterval(gravedad);
        this.saltando = false;
      }
      this.actualizarPosicion();
    }, 20);
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  colisionaCon(objeto) {
    return (
      this.x < objeto.x + objeto.width &&
      this.x + this.width > objeto.x &&
      this.y < objeto.y + objeto.height &&
      this.y + this.height > objeto.y
    );
  }
// agregué un estado de flaco a gordo //

  cambiarEstadoAGordo() {
    this.estado = "gordo";
    this.element.src = "https://i.ibb.co/3YyyVMxD/Gordito.png";
    alert("Que ricooo!! Ahora eres Gordito, dale aceptar y verás");
    this.aplauso.play();
  } 
  
}


class Moneda {
  constructor(imagenSrc) {
    this.x = Math.random() * 700 + 50;
    this.y = Math.random() * 250 + 50;
    this.width = 60;
    this.height = 60;
    this.element = document.createElement("img");
    this.element.src = imagenSrc;
     this.element.style.position = "absolute";
     this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.element.style.width = `${this.width}px`; // Establece el ancho
    this.element.style.height = `${this.height}px`; // Establece el alto

    this.actualizarPosicion();
  }

  actualizarPosicion() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}



const imagenesMonedas = [
  "https://img.icons8.com/?size=200&id=uf15GPjIxkW2&format=png",
  "https://img.icons8.com/?size=200&id=RTFOTVPzEAwT&format=png",
  "https://img.icons8.com/?size=200&id=IrLeaYkDsDWy&format=png",
  "https://img.icons8.com/?size=200&id=nTahoEqeZiES&format=png",
  "https://img.icons8.com/?size=200&id=6az0FPCNHm1Y&format=png",
];

//Musica de fondoo y Boton//
const musica = document.getElementById("musica-fondo"); // Creo una variable llamando al ID del HTML.
const botonMusica = document.getElementById("boton"); // Lo mismo pero con el ID del botón.

// Aquí creo el evento para que al hacer click se reproduzca la música.
document.addEventListener("click", () => {
  if (musica.paused) {
    musica.play();
  }
}, { once: true });

// Y aquí creo el evento para pausar o reproducir la música.
botonMusica.addEventListener("click", () => {
  if (musica.paused) {
    musica.play();
    botonMusica.textContent = "Música";
  } else {
    musica.pause();
    botonMusica.textContent = "Mute";
  }
});

const juego = new Game();