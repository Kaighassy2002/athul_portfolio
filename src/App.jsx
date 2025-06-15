
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Atlas from './pages/Atlas'
import Scribble from './pages/Scribble'
import Blog from './pages/Blog'
import MaintenanceOverlay from './components/MaintenceOverlay'
import Contact from './pages/Contact'
import BlogDetails from './pages/BlogDetails'
import { useEffect } from 'react'
import { initGA, sendPageView } from './utils/GA'
import ScribbleDetails from './pages/ScribbleDetails'

function App() {
  const location = useLocation()

  useEffect(() => {
    initGA()
  }, [])

  useEffect(() => {
    sendPageView(location.pathname)
  }, [location])


  return (
    <>
      
       <MaintenanceOverlay/>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/atlas' element={<Atlas/>}/>
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/scribble' element={<Scribble/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/blog/:id' element={<BlogDetails/>}/>
        <Route path='/scribble/:id' element={<ScribbleDetails/>}/>
      </Routes>
    </>
  )
}

export default App
