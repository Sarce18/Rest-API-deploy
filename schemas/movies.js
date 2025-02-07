const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie Title must be a string',
    required_error: 'Movie Title is required'
  }),
  genre: z.array(
    z.enum(['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'romance', 'Thriller', 'western', 'Adventure', 'Animation', 'Biography', 'Crime', 'Documentary', 'Family', 'History', 'Mystery', 'Sport', 'War', 'Musical', 'Music', 'Short', 'Film-Noir', 'News', 'Reality-TV', 'Talk-Show', 'Game-Show', 'Adult'])),
  year: z.number().int().min(1888).max(new Date().getFullYear()),
  director: z.string().nonempty(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).optional(),
  poster: z.string().url()
})

function validateMovie (input) {
  return movieSchema.safeParse(input)
}

function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
