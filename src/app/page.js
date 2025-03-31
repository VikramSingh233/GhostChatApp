"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";

export default function App() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(null);

  const features = {
    "Invisible Presence": {
      icon: '👤',
      content: (
        <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Invisible Presence</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• No online/offline status visibility</li>
            <li>• Hidden typing indicators</li>
            <li>• No read receipts</li>
          </ul>
        </div>
      )
    },
    "Auto-Disappearing Messages": {
      icon: '⏳',
      content: (
        <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Auto-Disappearing Messages</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• 24-hour message lifespan</li>
            <li>• No conversation history</li>
            <li>• Daily fresh start</li>
          </ul>
        </div>
      )
    },
    "End-to-End Encryption": {
      icon: '🔒',
      content: (
        <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">End-to-End Encryption</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Military-grade encryption</li>
            <li>• Zero message storage</li>
            <li>• Complete data protection</li>
          </ul>
        </div>
      )
    },
    "Anonymous Mode": {
      icon: '🎭',
      content: (
        <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Anonymous Mode</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Optional read notifications</li>
            <li>• No identity tracking</li>
            <li>• Complete interaction privacy</li>
          </ul>
        </div>
      )
    }
  };

  useEffect(()=>{
    if(activeFeature){
      setTimeout(() => {
        setActiveFeature(null);
      },10000);
    }
  },  [activeFeature])
  const handleAuth = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="bg-blue-900 shadow-lg">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className=" w-24 md:w-12 h-12 relative">
              <Image
                src="/logo.png"
                alt="ConvoNest Logo"
                layout="fill"
                objectFit="contain"
                className=" filter brightness-0 invert"
              />
            </div>
            <h1 className=" hidden md:block text-2xl font-bold text-white">ConvoNest</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handleAuth('/login')}
              className="px-3 py-2 w-20 rounded-lg bg-white text-blue-900 font-medium hover:bg-blue-50 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleAuth('/register')}
              className="px-3 py-2 w-32 rounded-lg bg-blue-800 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
      
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Secure Conversations, 
            <span className="text-blue-600"> Built for Privacy</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience messaging that truly respects your privacy
          </p>
        </section>

        
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(features).map(([title, { icon }]) => (
            <div
              key={title}
              onMouseEnter={() => setActiveFeature(title)}
              onMouseLeave={() => setActiveFeature(null)}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>
            </div>
          ))}
        </section>

        
        {activeFeature && (
          <div className="animate-fade-in">
            {features[activeFeature].content}
          </div>
        )}

    <h2 className='text-2xl font-bold text-gray-900 mb-4'>How to use ConvoNest</h2>
    <h3>Video Under Making ! Explore By yourself and If any issue then please Contact us.</h3>
{/* <video  className=" w-[80%] m-auto" width="640" height="360" controls muted poster="/thumbnail.jpg">
  <source src="/video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video> */}


      </main>

      <footer className="bg-gray-900 text-white py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
        {/* About Me Section */}
        <div className="md:w-1/3">
          <h2 className="text-xl font-bold text-blue-400">About Me</h2>
          <p className="text-gray-300 mt-2 text-sm">
            I am a passionate developer focused on building user-friendly and secure applications. I love working with modern web technologies to create impactful solutions.
          </p>
        </div>

        {/* Contact Me Section */}
        <div className="md:w-1/3">
          <h2 className="text-xl font-bold text-blue-400">Contact Me</h2>
          <ul className="mt-2 space-y-2">
            <li>
              📧 Email:{" "}
              <a href="mailto:dnsingh655@gmail.com" className="text-blue-300 hover:underline">
                dnsingh655@gmail.com
              </a>
            </li>
            <li>
              📞 Phone:{" "}
              <a href="tel:+7607928008" className="text-blue-300 hover:underline">
                +91 7607928008
              </a>
            </li>
            <li>
              🌐 Website:{" "}
              <Link href="https://vikramsingh.vercel.app" className="text-blue-300 hover:underline">
                VikramSingh
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Vikram Singh. All rights reserved.
      </div>
    </footer>

      
      
    </div>
  );
}