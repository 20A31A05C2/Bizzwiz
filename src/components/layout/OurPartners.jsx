import p1 from "../../assets/partners/acene.png";
import p2 from "../../assets/partners/outside.png";
import p3 from "../../assets/partners/apex.png";
import p4 from "../../assets/partners/celestial.png";
import p5 from "../../assets/partners/echo.png";
import p6 from "../../assets/partners/pulse.png";
import p7 from "../../assets/partners/quantum.png";
import p8 from "../../assets/partners/teice.png";
import useScrollAnimation from "./useScrollanimation";

function OurPartners() {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation();

  const partners = [
    { id: 1, name: "Acme Corp", logo: p1 },
    { id: 2, name: "Echo Valley", logo: p5 },
    { id: 3, name: "Quantum", logo: p7 },
    { id: 4, name: "PULSE", logo: p6 },
    { id: 5, name: "Outside", logo: p2 },
    { id: 6, name: "APEX", logo: p3 },
    { id: 7, name: "Celestial", logo: p4 },
    { id: 8, name: "2TWICE", logo: p8 },
  ];

  return (
    <section className="relative flex flex-col items-center overflow-hidden overflow-x-hidden text-white bg-transparent">
      <h2
        ref={headerRef}
        className={`text-4xl font-bold tracking-wide mt-2 md:p-12 p-6 mb-5 text-center transform transition-all duration-700 ${
          headerVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        Our Partners
      </h2>
      <div
        ref={gridRef}
        className="grid w-full grid-cols-2 gap-8 px-4 sm:grid-cols-3 md:grid-cols-4 max-w-7xl"
      >
        {partners.map((partner, index) => (
          <div
            key={partner.id}
            className={`flex flex-col items-center justify-center bg-transparent border border-gray-800 
              rounded-lg p-6 shadow-lg transition-all duration-700 transform
              hover:shadow-2xl hover:-translate-y-2 hover:border-purple-600/50
              ${gridVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="object-contain w-auto h-16 transition-transform duration-300 transform hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurPartners;