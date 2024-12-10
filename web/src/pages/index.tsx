import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <>
      <Head>
        <title>The Pass App - Education Staffing in Delaware</title>
        <meta name="description" content="Connect with educational institutions across Delaware" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold text-blue-600">ThePassApp</div>
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="px-4 py-2 text-blue-600 hover:text-blue-700"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </nav>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Hero Section */}
            <div className="flex-1 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find Your Perfect Teaching Position in Delaware
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with educational institutions across Delaware using our innovative matching platform.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Get Started
                </button>
                <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                  Learn More
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Smart Matching',
                  description: 'Find positions that match your qualifications and preferences',
                  icon: '🎯'
                },
                {
                  title: 'Quick Apply',
                  description: 'Apply to positions with just one tap',
                  icon: '⚡'
                },
                {
                  title: 'Real-time Updates',
                  description: 'Get instant notifications about your applications',
                  icon: '🔔'
                },
                {
                  title: 'Secure Platform',
                  description: 'Your data is protected with enterprise-grade security',
                  icon: '🔒'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
