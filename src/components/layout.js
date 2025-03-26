import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Account Settings</title>
        <meta name="description" content="User account management" />
      </Head>
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/home" className='text-white bg-gray-700 px-4 py-2 rounded font-semibold'>
            Back to Home
          </Link>


        </div>
      </nav>

      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
}