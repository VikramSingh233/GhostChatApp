"use client";
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [Name, setName] = useState('');
  const [MobileNumber, setMobile] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 const router = useRouter();
  const validateForm = () => {
    const errors = [];
    
    if (!Name || !Password || !MobileNumber) {
      errors.push('All fields are required');
    }
    if (MobileNumber.length !== 10 || isNaN(MobileNumber)) {
      errors.push('Invalid mobile number');
    }
    if (Password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    setError(errors.join('\n'));
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/register', {
        Name,
        MobileNumber,
        Password
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        router.push("/login")
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setName('');
      setMobile('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={64}
            height={64}
            className="filter brightness-0 invert"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Vikram Singh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={MobileNumber}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="7607928008"
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <span className="mr-2">Already have an account?</span>
          <Link 
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>


      </div>
    </div>
  );
}