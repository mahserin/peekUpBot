import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Main from './pages/Main'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Main />} ></Route>
        <Route path='/*' element={<Home />} ></Route>
      </Routes>
    </>
  )
}

export default App
