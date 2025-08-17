import React from "react";
import logo1 from "../../../assets/logo1.jpg";
import logo2 from "../../../assets/logo2.png";
const partners = [
  {
    name: "SafeGuard Insurance",
    logo: logo1,
    description: "Leading provider of home and auto insurance."
  },
  {
    name: "SafeGuard Insurance",
    logo: logo1,
    description: "Leading provider of home and auto insurance."
  },
  {
    name: "ShieldPro",
    logo: logo2,
    description: "Specialists in business and travel insurance."
  }
];

const TrustedPartners = () => (
  <section className="py-12 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">Trusted Partners</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {partners.map((partner, idx) => (
          <div key={idx} className="flex flex-col items-center p-6 bg-white rounded-xl shadow">
            <img src={partner.logo} alt={partner.name} className="h-16 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
            <p className="text-gray-600 text-center">{partner.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedPartners;

