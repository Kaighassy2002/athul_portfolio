
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing'
import Atlas from './pages/Atlas'
import Scribble from './pages/Scribble'
import Blog from './pages/Blog'
import MaintenanceOverlay from './components/MaintenceOverlay'


function App() {
  

  return (
    <>
      
       <MaintenanceOverlay/>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/atlas' element={<Atlas/>}/>
        <Route path='/blog' element={<Blog/>}/>
        <Route path='/scribble' element={<Scribble/>}/>
        
      </Routes>
    </>
  )
}

export default App
