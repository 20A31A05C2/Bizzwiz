import TestimonialSection from "./layout/Client";
import BusinessCreationUI from "./layout/BusinessCreationUI";
import Footer from "./layout/Footer";
import Header from "./layout/Header"
import HeroSection from "./layout/HeroSection"
import KeyAdvantagesSection from "./layout/KeyAdvantagesSection";
import TaskIntegrationSection from "./layout/TaskIntegrationSection";
import Advertisement from "./layout/Advertisement";
import WZCToken from "./layout/WZCToken";
import CommunityJoin from "./layout/CommunityJoin";

function Landingpage() {
  return (
    <div>
      
      <Header />
      <HeroSection />
      <KeyAdvantagesSection/>
      <TaskIntegrationSection/>
      <Advertisement/>
      <WZCToken/>
      <TestimonialSection/>
      <CommunityJoin/>
      <BusinessCreationUI/>
      <Footer/>
      
    </div>
  );
}


export default Landingpage