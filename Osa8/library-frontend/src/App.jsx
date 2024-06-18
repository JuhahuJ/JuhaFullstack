import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import SetBirthyear from "./components/Birthyear"
import { Routes, Route, Link } from 'react-router-dom'
import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "./queries"

const App = () => {
  const result = useQuery(ALL_AUTHORS)

  let authors

  if (result.loading) {
    return <div>loading...</div>
  } else {
    authors = result.data.allAuthors
  }

  return (
    <div>
      <div>
        <Link to='/authors'>authors</Link>||
        <Link to='/books'>books</Link>||
        <Link to='/add'>add</Link>||
        <Link to='/birthyear'>set birthyear</Link>
      </div>

      <Routes>
        <Route path="/authors" element={<Authors authors={authors} />} />
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/birthyear" element={<SetBirthyear authors={authors} />} />
      </Routes>
    </div>
  )
}

export default App
