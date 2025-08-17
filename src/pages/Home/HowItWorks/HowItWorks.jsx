import React from "react";
import {
  FiSearch,
  FiDollarSign,
  FiEdit,
  FiCreditCard,
  FiFileText
} from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: "Browse Policies",
      description: "Explore our comprehensive range of insurance policies tailored to your specific needs.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "Get a Quote",
      description: "Receive instant, personalized insurance quotes with our advanced estimator tool.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <FiEdit className="w-8 h-8" />,
      title: "Apply Online",
      description: "Complete your application in minutes with our streamlined digital process.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <FiCreditCard className="w-8 h-8" />,
      title: "Make Payment",
      description: "Securely pay your premium using our encrypted payment gateway.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: "Manage & Download",
      description: "Access your documents anytime through your personalized dashboard.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How <span className="text-primary">SecureNest</span> Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting insured has never been easier. Follow these simple steps to secure your coverage today.
            </p>
          </div>

          <div className="relative">
            {/* Progress line */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gray-200 mx-16"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, idx) => (
                  <div
                      key={idx}
                      className="relative group flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Progress dot (desktop only) */}
                    <div className="hidden md:block absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-primary group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                      <span className="font-semibold text-gray-700 group-hover:text-white">{idx + 1}</span>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
                      <div className={step.color}>
                        {step.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
              ))}
            </div>
          </div>


        </div>
      </section>
  );
};

export default HowItWorks;