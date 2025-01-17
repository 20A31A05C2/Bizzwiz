import {Routes,Route} from 'react-router-dom'
import './App.css'
import LandingPage from './components/Landingpage';
import Loginpage from './components/Loginpage';
import Registerpage from './components/Registerpage';
import Dashboard from './components/UserComponents/Dashboard';
import Profile from './components/UserComponents/UserProfile';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
  <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/userlogin' element={<Loginpage/>}/>
      <Route path='/userregister' element={<Registerpage/>}/>
      <Route path='/UserDashboard' element={<Dashboard/>}/>
      <Route path='/UserProfile' element={<Profile/>}/>
    </Routes>
    
    
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  /></>
  )
}

export default App
