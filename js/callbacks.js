/* Ignorar es parte de las clases y no de juego wwwww kusa */
const API_URL = 'https://swapi.dev/api/'
const PEOPLE_URL = 'people/:id'

const options = { crossDomain: true }

const onPeopleResponse = function (person) {
    console.log(`Hola, yo soy ${person.name}`)
}

function obtenerPersonaje(id) {
    return new Promise( (resolve, reject) => {
        const url = `${API_URL}${PEOPLE_URL.replace(':id', id)}`
        $.get(url, options, function (data) {
            resolve(data)
        })
        .fail(() => reject(id))
    })
}

function onError(id) {
    console.log('Sucedió un error al obtener el personaje: ',id)
}

async function obtenerPersonajes() {
    let ids = [1, 2, 3, 4, 5, 6]
    let promesas = ids.map((id)=>obtenerPersonaje(id))

    try {
        let personajes = await Promise.all(promesas)
        console.log(personajes)
    } catch (id) {
        onError(id)
    }
    /* Promise
        .all(promesas)
        .then((personajes) => console.log(personajes))
        .catch(onError) */
}

obtenerPersonajes()

/* 
obtenerPersonaje(1)
    .then((personaje) => {
        console.log(`Hola, yo soy ${personaje.name}`)
        return obtenerPersonaje(2)
    })
    .then((personaje) => {
        console.log(`Hola, yo soy ${personaje.name}`)
        return obtenerPersonaje(3)
    })
    .then((personaje) => {
        console.log(`Hola, yo soy ${personaje.name}`)
        return obtenerPersonaje(4)
    })
    .then((personaje) => {
        console.log(`Hola, yo soy ${personaje.name}`)
        return obtenerPersonaje(5)
    })
    .then((personaje) => {
        console.log(`Hola, yo soy ${personaje.name}`)
        return obtenerPersonaje(6)
    })
    .catch(onError) */