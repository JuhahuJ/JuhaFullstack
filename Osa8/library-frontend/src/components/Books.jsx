import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ME } from "../queries"
import { useState } from "react"

const Books = () => {
  const [genre, setGenre] = useState(null)

  const result = useQuery(ALL_BOOKS)
  const result2 = useQuery(ME)
  result2.refetch()

  let books
  let user

  if (result.loading || result2.loading) {
    return <div>loading...</div>
  } else {
    books = result.data.allBooks
    user = result2.data.me
  }

  const allGenres = books.flatMap((book) => book.genres)
  const uniqueGenres = Array.from(new Set(allGenres))

  const filteredBooks = genre
    ? books.filter((book) => book.genres.includes(genre))
    : books;

  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <b>{genre}</b></p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
      {user && <button onClick={() => setGenre(user.favoriteGenre)}>your favorite genre</button>}
    </div>
  )
}

export default Books
