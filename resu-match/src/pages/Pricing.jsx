import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiZap, FiStar, FiTarget, FiArrowRight } from 'react-icons/fi';

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'
    const [userType, setUserType] = useState('jobseeker'); // 'jobseeker' or 'employer'

    const jobSeekerPlans = [
        {
            id: 'free',
            name: 'Free',
            price: { monthly: 0, annual: 0 },
            description: 'Perfect for getting started',
            icon: '🚀',
            features: [
                { text: 'Browse unlimited jobs', included: true },
                { text: 'Apply to 10 jobs/month', included: true },
                { text: 'Basic profile', included: true },
                { text: 'Resume upload', included: true },
                { text: 'Email job alerts', included: true },
                { text: 'AI resume parsing', included: false },
                { text: 'Priority support', included: false },
                { text: 'Featured applications', included: false }
            ],
            cta: 'Get Started',
            ctaLink: '/register',
            popular: false
        },
        {
            id: 'premium',
            name: 'Premium',
            price: { monthly: 999, annual: 9990 }, // PKR
            description: 'For serious job seekers',
            icon: '⭐',
            features: [
                { text: 'Browse unlimited jobs', included: true },
                { text: 'Apply to unlimited jobs', included: true },
                { text: 'Enhanced profile visibility', included: true },
                { text: 'AI resume parsing & suggestions', included: true },
                { text: 'Daily job alerts', included: true },
                { text: 'Featured applications', included: true },
                { text: 'Priority support', included: true },
                { text: 'Resume templates', included: true }
            ],
            cta: 'Upgrade Now',
            ctaLink: '/register',
            popular: true
        },
        {
            id: 'career',
            name: 'Career Plus',
            price: { monthly: 1999, annual: 19990 },
            description: 'Maximum career acceleration',
            icon: '🎯',
            features: [
                { text: 'Everything in Premium', included: true },
                { text: 'Personal career coach (1 session/month)', included: true },
                { text: 'Interview preparation guide', included: true },
                { text: 'Salary negotiation tips', included: true },
                { text: 'LinkedIn profile optimization', included: true },
                { text: 'Job application tracking & analytics', included: true },
                { text: '24/7 priority support', included: true },
                { text: 'Certificate courses access', included: true }
            ],
            cta: 'Go Pro',
            ctaLink: '/register',
            popular: false
        }
    ];

    const employerPlans = [
        {
            id: 'starter',
            name: 'Starter',
            price: { monthly: 4999, annual: 49990 },
            description: 'For small businesses',
            icon: '🏢',
            features: [
                { text: 'Post 5 jobs/month', included: true },
                { text: 'Basic candidate search', included: true },
                { text: 'Company profile page', included: true },
                { text: 'Email support', included: true },
                { text: 'Advanced filtering', included: false },
                { text: 'Applicant tracking system', included: false },
                { text: 'Featured job postings', included: false },
                { text: 'Analytics dashboard', included: false }
            ],
            cta: 'Start Hiring',
            ctaLink: '/register',
            popular: false
        },
        {
            id: 'business',
            name: 'Business',
            price: { monthly: 9999, annual: 99990 },
            description: 'For growing companies',
            icon: '💼',
            features: [
                { text: 'Post 20 jobs/month', included: true },
                { text: 'Advanced candidate search', included: true },
                { text: 'Applicant tracking system', included: true },
                { text: 'Analytics dashboard', included: true },
                { text: 'Featured job postings (5/month)', included: true },
                { text: 'Resume database access', included: true },
                { text: 'Priority support', included: true },
                { text: 'Team collaboration tools', included: true }
            ],
            cta: 'Choose Business',
            ctaLink: '/register',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: { monthly: null, annual: null }, // Custom pricing
            description: 'For large organizations',
            icon: '🏆',
            features: [
                { text: 'Unlimited job postings', included: true },
                { text: 'Dedicated account manager', included: true },
                { text: 'Custom integrations', included: true },
                { text: 'White-label branding', included: true },
                { text: 'Advanced analytics & reporting', included: true },
                { text: 'API access', included: true },
                { text: '24/7 premium support', included: true },
                { text: 'Custom contract terms', included: true }
            ],
            cta: 'Contact Sales',
            ctaLink: '/contact',
            popular: false
        }
    ];

    const currentPlans = userType === 'jobseeker' ? jobSeekerPlans : employerPlans;

    const getPrice = (plan) => {
        if (plan.price[billingCycle] === null) {
            return 'Custom';
        }
        if (plan.price[billingCycle] === 0) {
            return 'Free';
        }
        return `PKR ${plan.price[billingCycle].toLocaleString()}`;
    };

    const getSavings = () => {
        if (billingCycle === 'annual') {
            return '17% savings';
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Simple, <span className="text-blue-600">Transparent</span> Pricing
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Choose the plan that's right for you. No hidden fees, cancel anytime.
                    </p>

                    {/* User Type Toggle */}
                    <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => setUserType('jobseeker')}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                                userType === 'jobseeker'
                                    ? 'bg-white text-blue-600 shadow-md'
                                    : 'text-gray-600'
                            }`}
                        >
                            For Job Seekers
                        </button>
                        <button
                            onClick={() => setUserType('employer')}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                                userType === 'employer'
                                    ? 'bg-white text-blue-600 shadow-md'
                                    : 'text-gray-600'
                            }`}
                        >
                            For Employers
                        </button>
                    </div>

                    {/* Billing Cycle Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                            className="relative w-14 h-7 bg-gray-300 rounded-full transition-colors focus:outline-none"
                            style={{ backgroundColor: billingCycle === 'annual' ? '#3B82F6' : '#D1D5DB' }}
                        >
                            <span
                                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform"
                                style={{ transform: billingCycle === 'annual' ? 'translateX(28px)' : 'translateX(0)' }}
                            />
                        </button>
                        <span className={`font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                            Annual
                        </span>
                        {getSavings() && (
                            <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                {getSavings()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                    {currentPlans.map(plan => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 transition-all hover:scale-105 ${
                                plan.popular
                                    ? 'border-blue-600 shadow-2xl'
                                    : 'border-gray-200'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-1">
                                        <FiStar size={14} />
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Icon */}
                            <div className="text-5xl mb-4">{plan.icon}</div>

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <p className="text-gray-600 mb-6">{plan.description}</p>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {getPrice(plan)}
                                    </span>
                                    {plan.price[billingCycle] !== null && plan.price[billingCycle] > 0 && (
                                        <span className="text-gray-600">
                                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                        </span>
                                    )}
                                </div>
                                {billingCycle === 'annual' && plan.price.annual > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Billed annually
                                    </p>
                                )}
                            </div>

                            {/* CTA Button */}
                            <Link
                                to={plan.ctaLink}
                                className={`block w-full py-3 rounded-lg font-semibold text-center transition-all mb-6 ${
                                    plan.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                }`}
                            >
                                {plan.cta}
                            </Link>

                            {/* Features */}
                            <div className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        {feature.included ? (
                                            <FiCheck className="text-green-600 flex-shrink-0 mt-1" size={18} />
                                        ) : (
                                            <FiX className="text-gray-300 flex-shrink-0 mt-1" size={18} />
                                        )}
                                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-2">Can I change my plan later?</h3>
                            <p className="text-gray-600">
                                Yes! You can upgrade, downgrade, or cancel your plan at any time from your account settings.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, debit cards, and mobile wallets like EasyPaisa and JazzCash.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-2">Is there a money-back guarantee?</h3>
                            <p className="text-gray-600">
                                Yes! We offer a 30-day money-back guarantee on all paid plans. No questions asked.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-900 mb-2">Do you offer discounts for students or non-profits?</h3>
                            <p className="text-gray-600">
                                Absolutely! Contact our support team with valid documentation for special pricing.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-center text-white">
                    <FiZap className="mx-auto mb-4" size={48} />
                    <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Our team is here to help you find the perfect plan for your needs
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg inline-flex items-center gap-2">
                            Contact Sales
                            <FiArrowRight />
                        </button>
                        <Link
                            to="/advice"
                            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-white"
                        >
                            View Resources
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
