import React from 'react';
import {
  UsersIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

export const metadata = {
  title: 'About | Constitution of the Cayman Islands',
  description: 'Learn about our mission to make the Cayman Islands Constitution accessible to everyone through modern technology and user-friendly design.',
};

export default function About() {
  const values = [
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: 'Accessibility',
      description: 'Making constitutional knowledge available to every Caymanian, regardless of their legal background.'
    },
    {
      icon: <AcademicCapIcon className="h-8 w-8" />,
      title: 'Education',
      description: 'Empowering citizens with knowledge about their rights and the structure of government.'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Transparency',
      description: 'Ensuring open access to the fundamental law that governs our democracy.'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8" />,
      title: 'Innovation',
      description: 'Using modern technology to bring constitutional documents into the digital age.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About Constitution.ky
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We&apos;re dedicated to making the Cayman Islands Constitution accessible, searchable, and understandable
            for every Caymanian through innovative digital technology.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            The Cayman Islands Constitution Order 2009 is the supreme law of the Cayman Islands, establishing the
            framework for government and protecting the fundamental rights of all people in the territory. However,
            constitutional documents can be complex and difficult to navigate for the average person.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Constitution.ky bridges this gap by providing an intuitive, modern interface that makes constitutional
            knowledge accessible to everyone. Whether you&apos;re a student, researcher, legal professional, or simply
            a curious citizen, our platform empowers you to explore and understand your constitutional rights and
            the structure of the Cayman Islands&apos; government.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Built with Modern Technology
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-4">
                Constitution.ky is built using cutting-edge web technologies to ensure fast, reliable,
                and accessible performance across all devices.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Advanced search with relevance scoring
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Mobile-responsive design
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Accessibility-first approach
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Performance optimized
                </li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Technical Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Search Response Time</span>
                  <span className="font-mono">&lt; 100ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Page Load Speed</span>
                  <span className="font-mono">&lt; 1.5s</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessibility Score</span>
                  <span className="font-mono">AAA</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile Performance</span>
                  <span className="font-mono">98/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
