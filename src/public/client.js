let state = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
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
        <header></header>
        <main>
            ${Greeting(state.user.name)}
            <section>
                <h3>Select a rover for some cool pictures</h3>
                <ul id='rover-buttons'>${roverButtons(state)}</ul>
                
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

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Why does this return null for the target and a pending promise
// const x = (rover) => {
//     const target = document.getElementById('rover-buttons')
//     const listitem = document.createElement('li')
//     const roverButton = document.createElement('button')
//     const list = target.appendChild(listitem)
//     list.appendChild(list)
//     roverButton.innerHTML = rover
//     roverButton.onclick = function() {
//         alert('Click Click')
//     }
// }

// Why doesn't this work incomibination with .map or .forEach
// const y = (rover) => {
//     return `<ul><button>${rover}</button><ul>`
// }

const getData = (rover) => {
    const roverName = rover.innerHTML
    alert('Click')
}

const roverButtons = (state) => {
    const { rovers } = state
    if(rovers.length > 0) { 
        return rovers.map(rover => {
            // Why can't I return this directly but do I need a const as intermediate step?
            const button = `<li><button id='${rover}' onclick='getData(${rover})'>${rover}</button></li>`
            return button
        }).join(' ')
    } else {
        `<h3>Sorry no rovers here</h3>`
    }

    // Why does does it only shows a [object HMTL...] in the DOM and no the ul content
    // const ul = document.createElement('ul')
    // const roverButtons = rovers.map(rover => {
    //     const li = document.createElement('li')
    //     const button = document.createElement('button')
    //     button.innerHTML = rover
    //     button.onclick = function() {
    //         alert('Click Click')
    //     }
    //     li.appendChild(button)
    //     ul.appendChild(li)
    // })
    // return ul
    

    // Why does this not work?
    // rovers.length > 0 
    //     ? rovers.forEach(function(rover) {
    //         console.log(rover)
    //         x(rover)
            // return `<button>${rover}</button>`
        // })
        // : `<h3>Sorry no rovers here</h3>`
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

const updateUi = async (rover) => {
    const data = await getRoverData(rover)

}

// const showRoverImages = ()

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(state, { apod }))

    return data
}

const getRoverData = async (rover) => {
    const res = await fetch(`http://localhost:3000/rover`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rover),
    })
    try {
        const data = await res.json();
        return data
    } catch (error) {
        console.log("error:", error);
    }
}
