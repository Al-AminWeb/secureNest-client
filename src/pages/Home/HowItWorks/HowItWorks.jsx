import React from "react";

const steps = [
  {
    title: "Browse Policies",
    description: "Explore a wide range of insurance policies tailored to your needs."
  },
  {
    title: "Get a Quote",
    description: "Use our quote estimator to get instant insurance quotes."
  },
  {
    title: "Apply Online",
    description: "Fill out a simple online application for your chosen policy."
  },
  {
    title: "Make Payment",
    description: "Pay securely online with Stripe integration."
  },
  {
    title: "Manage & Download",
    description: "Track your policies, download PDFs, and manage claims easily."
  }
];

const HowItWorks = () => (
  <section className="py-12 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow">
            <div className="text-4xl font-bold text-accent mb-2">{idx + 1}</div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

