const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const inputPlayer = document.getElementById('player')
const inputPunt = document.getElementById('punt')
const inputMaxPunt = document.getElementById('maxPunt')
const inputDifficulty = document.getElementById('difficulty')
let cantidadNiveles = 12

class Juego {
    constructor() {
        this.inicializar()
        this.generarSecuencia()
        setTimeout(this.siguienteNivel, 500);
    }

    inicializar() {
        //declaramos que elegir color le pertenezca a la clase Juego, caso contrario le pertenecerá a HTML
        this.elegirColor = this.elegirColor.bind(this)
        this.siguienteNivel = this.siguienteNivel.bind(this)
        btnEmpezar.classList.toggle('disabled')
        this.nivel = 1
        this.puntos = 0
        this.colores = {
            celeste,
            violeta,
            naranja,
            verde
        }
    }

    generarSecuencia() {
        this.secuencia = new Array(cantidadNiveles).fill(0).map(cero => Math.floor(Math.random() * 4))
    }

    transformarNumeroToColor(numero) {
        switch (numero) {
            case 0:
                return 'celeste'
            case 1:
                return 'naranja'
            case 2:
                return 'violeta'
            case 3:
                return 'verde'
            default:
                return 'celeste'
        }
    }

    transformarColorToNumero(color) {
        switch (color) {
            case 'celeste':
                return 0
            case 'naranja':
                return 1
            case 'violeta':
                return 2
            case 'verde':
                return 3
            default:
                return 0
        }
    }

    iluminarColor(color) {
        this.colores[color].classList.add('light')
        setTimeout(() => {
            this.apagarColor(color)
        }, 350);
    }

    apagarColor(color) {
        this.colores[color].classList.remove('light')
    }

    agregarEventosClick() {
        //recordar hacer un bind() a elegirColor, dado que el metodo addEventListener que es un event handler
        //ará referencia a una etiqueta HTML, haciendo que el valor/referencia de this que antes era de Juego 
        //ahora pase a ser de HTML 
        this.colores.celeste.addEventListener('click', this.elegirColor)
        this.colores.violeta.addEventListener('click', this.elegirColor)
        this.colores.verde.addEventListener('click', this.elegirColor)
        this.colores.naranja.addEventListener('click', this.elegirColor)
        this.colores.naranja.style.cursor = "url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto";
        this.colores.verde.style.cursor = "url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto";
        this.colores.violeta.style.cursor = "url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto";
        this.colores.celeste.style.cursor = "url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto";
    }

    eliminarEventosClick() {
        //recordar hacer un bind()
        this.colores.celeste.removeEventListener('click', this.elegirColor)
        this.colores.violeta.removeEventListener('click', this.elegirColor)
        this.colores.verde.removeEventListener('click', this.elegirColor)
        this.colores.naranja.removeEventListener('click', this.elegirColor)
        this.colores.naranja.style.cursor = 'initial'
        this.colores.verde.style.cursor = 'initial'
        this.colores.violeta.style.cursor = 'initial'
        this.colores.celeste.style.cursor = 'initial'
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    iluminarSecuencia() {
        for (let i = 0; i < this.nivel; i++) {
            const COLOR = this.transformarNumeroToColor(this.secuencia[i])
            this.sleep(1000 * i).then(() => { this.iluminarColor(COLOR) });
            /* setTimeout(() => {
                this.iluminarColor(COLOR)
            }, 1000 * i); */
        }
    }

    siguienteNivel() {
        this.subnivel = 0
        this.iluminarSecuencia()
        this.sleep(1000*this.nivel).then(() => {
            this.agregarEventosClick()
        });
        //this.agregarEventosClick()
    }

    ganoElJuego() {
        inputPunt.value = 0
        inputMaxPunt.value = `${inputPlayer.value} ${this.puntos}`
        swal.fire(
            'Simon Dijo',
            'Felicitaciones, ganaste el juego!',
            'success'
        ).then(() => {
            this.inicializar()
        })
    }

    perdioElJuego() {
        inputPunt.value = 0
        inputMaxPunt.value = `${inputPlayer.value} ${this.puntos}`
        swal.fire(
            'Simon Dijo',
            'Mas suerte para la próxima!',
            'error'
        ).then(() => {
            this.eliminarEventosClick()
            this.inicializar()
        })
    }

    elegirColor(event) {
        console.log(event.target)
        const NOMBRE_COLOR = event.target.dataset.color
        const NUMERO_COLOR = this.transformarColorToNumero(NOMBRE_COLOR)
        this.iluminarColor(NOMBRE_COLOR)
        if (NUMERO_COLOR === this.secuencia[this.subnivel]) {
            this.subnivel++
            this.puntos += 50
            inputPunt.value = this.puntos
            if (this.subnivel === this.nivel) {
                this.nivel++
                this.eliminarEventosClick()
                if (this.nivel === (cantidadNiveles + 1)) {
                    this.ganoElJuego()
                } else {
                    setTimeout(this.siguienteNivel, 1250);
                }
            }
        } else {
            this.perdioElJuego()
        }
    }
}

async function empezarJuego() {
    const { value: player } = await Swal.fire({
        title: 'Introduce nombre de jugador',
        input: 'text',
        inputValue: inputPlayer.value || '',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Es necesario escribir algo!'
            }
        }
    })

    if (player) {
        inputPlayer.value = player
        const { value: dificultad } = await Swal.fire({
            title: 'Seleccione la dificultad',
            input: 'radio',
            inputOptions: {
                'facil': 'Fácil',
                'medio': 'Medio',
                'dificil': 'Difícil'
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'Necesitas escoger alguna opción!'
                }
            }
        })

        if (dificultad) {
            inputDifficulty.value = dificultad
            cantidadNiveles = dificultad === 'dificil' ? 12 : dificultad === 'medio' ? 8 : 4
            console.log(cantidadNiveles)
            window.juego = new Juego()
        }
    }
}
