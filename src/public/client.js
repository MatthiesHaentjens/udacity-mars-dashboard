// state
let state = {
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateState = (state, newState) => {
    state= Object.assign(state, newState)
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
                <div class='rover-card'>
                    <div id='rover-data'>${apod === '' ? '' : roverData(apod)}</div>
                    <div id='rover-images'>${apod === '' ? '' : roverImages(apod)}</div>
                </div>
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


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    console.log(apod)
    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// Adds a number of div's to the DOM with the descriptive data for the selected rover
const roverData = (data) => {
    return (`
        <div class='rover-name'>Rover: ${data.rover.manifest.photo_manifest.name} - Facts:</div>
        <div class='rover-facts'>
            <div class='rover-fact'>Launch date: ${data.rover.manifest.photo_manifest.launch_date}</div>
            <div class='rover-fact'>Landing date: ${data.rover.manifest.photo_manifest.landing_date}</div>
            <div class='rover-fact' >Date last image: ${data.rover.manifest.photo_manifest.max_date}</div>
            <div class='rover-fact'>Status: ${data.rover.manifest.photo_manifest.status}</div>
        </div>
    `)
}

// Adds most recent images of the selected rover to the DOM
const roverImages = (data) => {
    const images = data.rover.images.photos
    const src = images.map(img => img.img_src)
    const srcSet = src.slice(1,11)
    return srcSet.map(img => {
        const image = `<img class='rover-image' src='${img}'/>`
        return image
    }).join('')
}

const customError = () => {
    return (`
        <h3>Sorry we couldn't find any data, feel free to try again</h3>
        <img src='./assets/cute-alien-character.jpg' />
    `)
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateState(state, { apod }))

    return data
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
