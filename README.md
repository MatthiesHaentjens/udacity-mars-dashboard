## Spying on the Moon

### What does this app do?

#### With this app you can actually see how life is on Mars 

We are using the Nasa Mars Rover Photos API to get images taken by three rovers:

- Curiosity
- Opportunity
- Spirit

You can select a rover by clicking on one of the buttons. When you click an API
request is made to Nasa to request some data about the rover and the most recent
photo's taken by the rover

### What tech do we use

Everything is JavaScript :)

All the logic is written as functional as possible we even use Immutable.js to make
part of the state variables immutable. For the backend we use Node.js

### Get it to work on you local machine

It is as simple as 1, 2, 3, 4

1. Clone the repo
2. yarn install
3. Go to https://api.nasa.gov/, get your API key and put it in a .env file
4. run yarn start in your terminal

And there it is running on localhost:3000
