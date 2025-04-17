
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Atlas from './pages/Atlas'
import Scribble from './pages/Scribble'
import Blog from './pages/Blog'
import MaintenanceOverlay from './components/MaintenceOverlay'
import Contact from './pages/Contact'


function App() {
  

  return (
    <>
      
       <MaintenanceOverlay/>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/atlas' element={<Atlas/>}/>
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/scribble' element={<Scribble/>}/>
        <Route path='/contact' element={<Contact/>}/>
      </Routes>
    </>
  )
}

export default App
