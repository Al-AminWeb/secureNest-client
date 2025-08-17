import React from "react";
import logo1 from "../../../assets/logo1.jpg";
import logo2 from "../../../assets/logo2.png";

const TrustedPartners = () => {
  const partners = [
    {
      name: "SafeGuard Insurance",
      logo: logo1,
      description: "Leading provider of home and auto insurance with 98% customer satisfaction.",
      website: "https://www.safeguarduk.co.uk/"
    },
    {
      name: "ShieldPro",
      logo: logo2,
      description: "Specialists in business and travel insurance with global coverage.",
      website: "https://pfimegalife.co.id/product-mega-ultima-shield-pro"
    },
    {
      name: "Fortress Health",
      logo: logo1, // You might want to add a third unique logo
      description: "Comprehensive health insurance solutions for individuals and families.",
      website: "https://fortresshealth.com/"
    }
  ];

  return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-primary">Trusted</span> Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We collaborate with industry leaders to bring you the best insurance solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, idx) => (
                <div
                    key={idx}
                    className="group relative bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    {/* Logo with container */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center p-4 border border-gray-100">
                      <img
                          src={partner.logo}
                          alt={partner.name}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-partner-logo.png";
                          }}
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{partner.name}</h3>
                    <p className="text-gray-600 text-center mb-4">{partner.description}</p>

                    {/* Learn more link */}
                    <div className="text-center">
                      <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                      >
                        Visit website
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Interested in becoming a partner?
            </p>
            <button className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
              Partner With Us
            </button>
          </div>
        </div>
      </section>
  );
};

export default TrustedPartners;