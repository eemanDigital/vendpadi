import { Link } from "react-router-dom";
import { FiCheck, FiZap, FiCalendar, FiPercent } from "react-icons/fi";
import { useState } from "react";
import { PLAN_DETAILS } from "../../data/planConstants";
import ScrollReveal from "./ScrollReveal";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section id="pricing" className="py-20 lg:py-28 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-padi-green font-semibold text-sm mb-3 tracking-wider uppercase">
              Simple Pricing
            </span>
            <h2 className="font-sora font-bold text-3xl sm:text-4xl lg:text-5xl text-navy mb-6">
              Choose your <span className="text-padi-green">plan</span>
            </h2>
            <p className="text-gray-500 text-lg">
              Start free. Upgrade when you start getting orders.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white rounded-full p-1.5 shadow-lg border border-gray-100">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-padi-green text-white shadow-lg shadow-padi-green/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-padi-green text-white shadow-lg shadow-padi-green/30"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                <FiCalendar size={16} />
                Yearly
                {billingCycle === "yearly" && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    Save ~17%
                  </span>
                )}
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Object.entries(PLAN_DETAILS).map(([planKey, plan]) => {
            const displayPrice = billingCycle === "yearly" ? plan.yearlyPrice : plan.price;
            const period = plan.price === 0 ? billingCycle === "yearly" ? "/year" : "forever" : billingCycle === "yearly" ? "/year" : "/month";
            const isBusiness = planKey === "business";
            const isPremium = planKey === "premium";
            const cardTextColor = isBusiness ? "text-white" : "text-navy";
            const cardSubtextColor = isBusiness ? "text-gray-300" : "text-gray-500";
            const cardSecondaryTextColor = isBusiness ? "text-gray-200" : "text-gray-600";
            const iconColor = isBusiness ? "text-white" : isPremium ? "text-amber-600" : "text-padi-green";

            return (
              <ScrollReveal key={planKey} delay={Object.keys(PLAN_DETAILS).indexOf(planKey) * 75}>
                <div className={`relative flex flex-col rounded-3xl transition-all duration-500 hover:-translate-y-2 ${
                  isBusiness
                    ? "bg-gradient-to-br from-navy to-navy-light text-white ring-2 ring-padi-green shadow-2xl shadow-padi-green/20 scale-[1.02]"
                    : planKey === "premium"
                      ? "bg-white border-2 border-gray-200 hover:border-padi-green/30 hover:shadow-xl"
                      : "bg-white border border-gray-200 hover:border-padi-green/30 hover:shadow-xl"
                }`}>
                  {plan.popular && !isBusiness && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg z-10 bg-gradient-to-r from-padi-green to-padi-green-dark text-white">
                      Most Popular
                    </div>
                  )}
                  {planKey === "premium" && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      {billingCycle === "yearly" ? "Save 17%" : "Try Free 7 Days"}
                    </div>
                  )}
                  {" "} {billingCycle === "yearly" && plan.price > 0 && planKey !== "premium" && (
                    <div className="absolute -top-4 right-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      Save 17%
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                      isBusiness ? "bg-white/20" : isPremium ? "bg-amber-100" : "bg-gradient-to-br from-padi-green/10 to-padi-green/5"
                    }`}>
                      <span className={`text-3xl ${iconColor}`}>{plan.icon}</span>
                    </div>
                    <h3 className={`font-sora font-bold text-2xl mb-1 ${cardTextColor}`}>{plan.name}</h3>
                    {planKey === "premium" && (
                      <div className="mt-2 mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600">
                        <FiZap size={12} />7 DAYS FREE
                      </div>
                    )}
                    <div className="mt-4 mb-1">
                      <span className={`text-5xl font-bold ${cardTextColor}`}>
                        {displayPrice === 0 ? "₦0" : `₦${displayPrice.toLocaleString()}`}
                      </span>
                      <span className={`text-sm ml-1 ${cardSubtextColor}`}>{period}</span>
                    </div>
                    {billingCycle === "yearly" && plan.price > 0 && (
                      <p className={`text-sm font-semibold mb-2 ${isBusiness ? "text-green-400" : "text-green-600"}`}>
                        Save ₦{(plan.price * 12 - plan.yearlyPrice).toLocaleString()}/year
                      </p>
                    )}
                    <p className={`text-sm mb-6 ${cardSubtextColor}`}>{plan.tagline}</p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.filter((f) => f.included).map((f, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isBusiness ? "bg-white/20" : "bg-padi-green/10"}`}>
                            <FiCheck className="text-padi-green" size={12} />
                          </div>
                          <span className={cardSecondaryTextColor}>{f.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className={`block text-center py-4 px-6 rounded-2xl font-bold transition-all mt-auto ${
                      planKey === "premium"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30"
                        : isBusiness
                          ? "bg-padi-green text-white hover:bg-padi-green-dark shadow-xl shadow-padi-green/30"
                          : "bg-navy text-white hover:bg-navy-light"
                    }`}>
                      {planKey === "free" || planKey === "premium" ? "Start for Free" : "Upgrade"}
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={400}>
          <div className="mt-12 space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-2xl text-sm font-medium">
                <FiZap className="text-amber-600" size={20} />
                <span><strong>Premium comes with 7 DAYS FREE TRIAL.</strong> No credit card required.</span>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl text-sm font-medium">
                <FiPercent className="text-green-600" size={20} />
                <span><strong>Yearly plans save you up to 17%!</strong></span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PricingSection;