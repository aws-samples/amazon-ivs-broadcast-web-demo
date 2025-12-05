// pages/index.js
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/providers/AuthContext';
import AuthForm from '@/components/Auth/AuthForm';
import Spinner from '@/components/Spinner';

export default function Home() {
  const [mode, setMode] = useState('login');
  const { isAuthenticated, loading, userType, checkAuthState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect based on user type
      if (userType === 'broadcaster') {
        router.replace('/broadcast');
      } else {
        router.replace('/dashboard');
      }
    }
    // only react to auth changes
  }, [isAuthenticated, loading, userType, router]);

  const handleAuthSuccess = () => {
    checkAuthState();
    // redirect handled by the effect above
  };

  // Show full-screen spinner while auth initializes or redirecting
  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nyu-neutral-100">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>NYU Sports Live — Sign In</title>
        <meta
          name="description"
          content="NYU Sports Live — Watch and broadcast NYU sports events"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-nyu-primary-600 via-nyu-primary-500 to-nyu-secondary-700 flex items-center justify-center p-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Hero / Marketing */}
            <div className="lg:col-span-7 px-6 lg:px-12">
              <div className="text-white max-w-2xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 drop-shadow-sm">
                  NYU Sports Live
                </h1>
                <p className="text-lg sm:text-xl text-white/90 mb-6">
                  Watch, chat, and broadcast live NYU sports events — built for students,
                  alumni and fans. Join as a viewer or share the action as a broadcaster.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold">Low-latency streams</h4>
                    <p className="text-white/90 text-sm mt-1">High-quality live video with minimal delay.</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold">Secure sign-in</h4>
                    <p className="text-white/90 text-sm mt-1">Cognito handles authentication & sessions.</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold">Live chat</h4>
                    <p className="text-white/90 text-sm mt-1">Engage with viewers and broadcasters in real time.</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold">Campus-first</h4>
                    <p className="text-white/90 text-sm mt-1">Built for NYU community needs and workflows.</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <a
                    href="#auth"
                    onClick={(e) => { e.preventDefault(); document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-2 bg-white text-nyu-primary-600 font-semibold px-4 py-2 rounded-lg shadow hover:opacity-95 transition"
                    aria-label="Get started — sign up or login"
                  >
                    Get started
                  </a>

                  <a
                    href="/about"
                    className="inline-flex items-center gap-2 text-white/95 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
                  >
                    Learn more
                  </a>
                </div>

                <p className="text-sm text-white/70 mt-8">
                  © {new Date().getFullYear()} NYU Sports Live — For NYU students and community.
                </p>
              </div>
            </div>

            {/* Right: Auth card */}
            <div className="lg:col-span-5 px-6 lg:px-0">
              <div
                id="auth"
                className="mx-auto max-w-md rounded-2xl shadow-2xl p-8 md:p-10 transform transition duration-500 ease-out"
                style={{ animation: 'fadeScale 350ms ease' }}
              >

                <AuthForm
                  key={mode}
                  mode={mode}
                  onSwitchMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  onSuccess={handleAuthSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeScale {
          0% { opacity: 0; transform: translateY(6px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
