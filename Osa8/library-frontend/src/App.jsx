import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import SetBirthyear from "./components/Birthyear"
import LoginForm from "./components/LoginForm"
import { Routes, Route, Link } from 'react-router-dom'
import { useState } from "react"
import { useApolloClient } from "@apollo/client"


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to='/authors'>authors</Link>
        <Link style={padding} to='/books'>books</Link>
        {token && <Link style={padding} to='/add'>add</Link>}
        {token && <Link style={padding} to='/birthyear'>set birthyear</Link>}
        {!token && <Link style={padding} to='/login'>login</Link>}
      </div>

      <Routes>
        <Route path="/authors" element={<Authors />} />
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook token={token} />} />
        <Route path="/birthyear" element={<SetBirthyear token={token} />} />
        <Route path="/login" element={<LoginForm setToken={setToken} token={token} />} />
      </Routes>

      {token && <button onClick={logout}>logout</button>}
    </div>
  )
}

export default App
