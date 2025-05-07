
import Footer from "./layout/Footer";
import Header from "./layout/Header"
import HeroSection from "./layout/HeroSection"

import FAQ from "./layout/FAQ";
import ServicesCarousel from "./layout/ServicesCarousel";
import Question from "./layout/Question";
import BizzWizUI from "./layout/BizzWizUI";

function Landingpage() {
  return (
    <div>
      
      <Header />
      <HeroSection />
      <ServicesCarousel/>
      <Question/>
      <BizzWizUI/>
      <FAQ/>
      <Footer/>
      
    </div>
  );
}


export default Landingpage