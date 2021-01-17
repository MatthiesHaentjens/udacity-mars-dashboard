require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
// app.get('/rovers', async (req, res) => {
//     try {
//         let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
//             .then(res => res.json())
//         res.send({ image })
//     } catch (err) {
//         console.log('error:', err);
//     }
// })

const getRoverManifest = async (rover) => {
    try {
        const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1/manifests'
        const res = await fetch(`${baseUrl}/${rover}/?api_key=${process.env.API_KEY}`)
        const manifest = await res.json()
        return manifest
    } catch (error) {
        console.log('error:', error)
    }
}

const getRoverImages = async (rover) => {
    try {
        const manifest = await getRoverManifest(rover)
        const recentSol = manifest.photo_manifest.max_sol
        const baseUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers'
        const res = await fetch(`${baseUrl}/${rover}/photos?sol=${recentSol}&api_key=${process.env.API_KEY}`)
        const images = await res.json()
        return images 
    } catch (error) {
        console.log('error:', error)
    }
}

app.post('/rover', async (req, res) => {
    const rover = req.body.rover
    try {
        const manifest = await getRoverManifest(rover)
        const images = await getRoverImages(rover)
        res.send({rover: {images, manifest}})
    } catch (error) {
        console.log('error:', error)
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))