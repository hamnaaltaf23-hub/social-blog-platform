import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroScene from '../components/HeroScene';

const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    window.location.href = '/feed';
    return null;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Hero - full screen with instant background color */}
      <div className="absolute inset-0 z-0 bg-[#5A6EBA]">
        <HeroScene />
      </div>

      {/* Overlay Content - no glass card, direct text and buttons */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4">
            Connect & Share
          </h1>
          <p className="text-2xl text-white/90 drop-shadow-md mb-10">
            a modern social blogging platform
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/register"
              className="bg-[#1E2A5A] text-white px-8 py-3 rounded-lg hover:bg-[#2E3E7A] transition-all transform hover:scale-105 font-semibold shadow-lg floating-btn"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-[#1E2A5A] text-white px-8 py-3 rounded-lg hover:bg-[#2E3E7A] transition-all transform hover:scale-105 font-semibold shadow-lg floating-btn"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Floating animation CSS */}
      <style>{`
        .floating-btn {
          animation: float 3s ease-in-out infinite;
        }
        .floating-btn:nth-child(2) {
          animation-delay: 0.5s;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;