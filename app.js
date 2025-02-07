const express = require('express') // require -> commonJS
const crypto = require('node:crypto')
const cors = require('cors')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

app.disable('x-powered-by') // disable x-powered-by header

app.use(express.json()) // parse json body
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://movies.com'
      // Add more origins
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}
))

// All Resources movies
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))

    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const id = req.params.id
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: result.error.errors })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  // This isn't a REST, because we are saving the movie in the memory
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  if (result.error) {
    return res.status(400).json({ error: result.error.errors })
  }

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies[movieIndex] = updateMovie

  res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  res.json({ message: 'Movie deleted' })
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
