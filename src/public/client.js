// import immutable js
// import { List } from 'immutable';

// state
let state = {
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateState = (state, newState) => {
    state = Object.assign(state, newState)
    render(root, state)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header><img class='logo' src='./assets/nasa_logo_animation.gif'/></header>
        <main>
            <section>
                <h3 class='title'>Select a rover for some cool pictures</h3>
                <ul class='rover-buttons'>${roverButtons(rovers)}</ul>
                <hr>
                <div class='rover-card'>${apod === '' ? '' : addRover(apod)}</div>
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, state)
})

// ------------------------------------------------------  COMPONENTS

// Adds buttons to the DOM for each rover that is present in state
const roverButtons = (rovers) => {
    if(rovers.length > 0) { 
        return rovers.map(rover => {
            const button = `<li><button id='${rover}' class='rover-button' onclick='getRoverData(${rover})'>${rover}</button></li>`
            return button
        }).join(' ')
    } else {
        `<h3>Sorry no rovers here</h3>`
    }
}

//
const addRover = async(data) => {
    // try {
    const details = roverData(data)
    const images = await roverImages(data)
    const DOMelem = `${details.concat(images)}`
    console.log(DOMelem)
    return DOMelem
    // } catch (error) {
    //     return customError()
    // }
}

// Adds a number of div's to the DOM with the descriptive data for the selected rover
const roverData = (data) => {
    return (`
        <div id='rover-data'>
            <div class='rover-name'>Rover: ${data.rover.manifest.photo_manifest.name} - Facts:</div>
            <div class='rover-facts'>
                <div class='rover-fact'>Launch date: ${data.rover.manifest.photo_manifest.launch_date}</div>
                <div class='rover-fact'>Landing date: ${data.rover.manifest.photo_manifest.landing_date}</div>
                <div class='rover-fact' >Date last image: ${data.rover.manifest.photo_manifest.max_date}</div>
                <div class='rover-fact'>Status: ${data.rover.manifest.photo_manifest.status}</div>
            </div>
        </div>
    `)
}

// Adds most recent images of the selected rover to the DOM
const roverImages = async(data) => {
    const src = await imageSelector(data, getImageOfTheDay, filterImages)
    const src1 = src.map(img => `<img class='rover-image' src='${img}'/>`)
    src1.unshift(`<div id='rover-images'>`)
    src1.push(`</div>`)
    const src2 = src1.join('')
    return src2
}

// Higher-order function with 3 scenarios for image selection
const imageSelector = async(data, callback1, callback2) => {
    const images = data.rover.images.photos
    if(images.length === 0) {
        const image = await callback1()
        const src = image.image.hdurl
        return src
    } else if(images.length <= 10) {
        const src = images.map(img => aimg.img_src)
        return src
    } else {
        const src = callback2(images)
        return src
    }
}

// For days with a lot of images select 10 random images
const filterImages = (images) => {
    const shuffeld = images.map(img => img.img_src).sort(() => 0.5 - Math.random())
    let selected = shuffeld.slice(0, 11)
    return selected
}

const customError = () => {
    return (`
        <h3>Sorry we couldn't find the data you requested, we did find a nice image</h3>
        <img src='./assets/cute-alien-character.jpg' />
        <h3>But feel free to try again to find what you are looking for</h3>
    `)
}

// ------------------------------------------------------  API CALLS

// Fallback API call if there are no recent pictures
const getImageOfTheDay = () => {
    return fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(data => data)
        .catch(error => console.log(error))
}

// API call to NASA for data (images and manifest) for the rover selected by the user
const getRoverData = async (event) => {
    const rover = {rover: event.innerHTML}
    const res = await fetch(`http://localhost:3000/rover`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rover),
    })
    try {
        const apod = await res.json();
        updateState(state, { apod })
    } catch (error) {
        console.log("error:", error);
    }
}
