import { BrowserRouter as  Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './components/Landingpage';
import Loginpage from './components/Loginpage';
import Registerpage from './components/Registerpage';
import Dashboard from './components/UserComponents/Dashboard';
import Profile from './components/UserComponents/UserProfile';
import { ToastContainer } from 'react-toastify';
import ComingSoon from './components/UserComponents/Comingsoon';
import AIStart from './components/UserComponents/AIStart';
import BizFormation from './components/UserComponents/BizFormation';
import BizWeb from './components/UserComponents/Bizweb';
import Logoai from './components/UserComponents/Logoai/LogoHistory';
import Task from './components/UserComponents/Task';
import WebForm from './components/UserComponents/BizWeb/WebForm';
import Logorequest from './components/UserComponents/Logoai/Logorequest';
import ContactUs from './components/UserComponents/Contactus';
import BusinessChatAdvisor from './components/UserComponents/BizwizPlan/BusinessChatAdvisor';
import ForgotPasswordPage from './components/Forgotpasswordpage';
import ResetPasswordPage from './components/ResetPasswordPage';
import CreditPurchase from './components/UserComponents/CreditPurchase';
import Pricingplan from './components/UserComponents/Pricingplan';
import SubscriptionManagement from './components/UserComponents/SubscriptionManagement';
import VerifyEmail from './components/VerifyEmail';
import AssistanceForm from './components/layout/AssistanceForm';
import AboutPage from './components/layout/AboutPage';
import Services from './components/layout/Services';



function App() {
  return (
  <>
    <Routes>
      
      <Route path='/userlogin' element={<Loginpage/>}/>
      <Route path='/userregister' element={<Registerpage/>}/>
      <Route path='/UserDashboard' element={<Dashboard/>}/>
      <Route path='/UserProfile' element={<Profile/>}/>
      <Route path='/Comingsoon' element={<ComingSoon/>}/>
      <Route path='/AIStart' element={<AIStart/>}/>
      <Route path='/BizFormation' element={<BizFormation/>}/>
      <Route path='/BizzPlan' element={<BusinessChatAdvisor/>}/>
      <Route path='/Bizweb' element={<BizWeb/>}/>
      <Route path='/Logoai' element={<Logoai/>}/>
      <Route path='/Task' element={<Task/>}/>
      <Route path='/WebForm' element={<WebForm/>}/>
      <Route path='/logorequest' element={<Logorequest/>}/>
      <Route path='/contactus' element={<ContactUs/>}/>
      <Route path='/forgotpassword' element={<ForgotPasswordPage/>}/>
      <Route path='/resetpassword' element={<ResetPasswordPage/>}/>
      <Route path='/creditpurchase' element={<CreditPurchase/>}/>
      <Route path='/manageplan' element={<SubscriptionManagement/>}/>
      <Route path='/verify-email' element={<VerifyEmail/>}/>
      <Route path='/pricingplan' element={<Pricingplan/>}/>

      {/* landing page routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path='/AssistanceForm' element={<AssistanceForm/>}/>
      <Route path='/About' element={<AboutPage/>}/>
      <Route path='/Services' element={<Services/>}/>

      

      


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
