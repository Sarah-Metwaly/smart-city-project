import fire from '../assets/images/Fire/fire.jfif';
import FireLiveEvents from '../features/fire-department/components/FireliveEvents';
import AirQuality from '../features/fire-department/components/AirQuality';
import FireIncidents from '../features/fire-department/components/FireIncidentTable';

const FirePage = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1a1f] to-[#1e3a46] border border-white/5 shadow-2xl relative">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '280px' }}
      >
        {/* Background image */}
        <img
          src={fire}
          alt="Fire Background"
          className="absolute inset-0 object-cover object-center w-full h-full scale-110"
          style={{ filter: 'brightness(0.35) saturate(1.4)' }}
        />

        {/* Fire color overlay — red/orange gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(180,30,10,0.55) 0%, rgba(220,80,10,0.3) 40%, rgba(10,10,10,0.7) 100%)',
          }}
        />

        {/* Animated ember particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${3 + (i % 4)}px`,
                height: `${3 + (i % 4)}px`,
                left: `${(i * 23 + 7) % 100}%`,
                bottom: '-10px',
                background:
                  i % 3 === 0 ? '#ff6a00' : i % 3 === 1 ? '#ff3300' : '#ffaa44',
                opacity: 0.7,
                animation: `riseEmber ${2.5 + (i % 5) * 0.6}s ease-in ${
                  (i * 0.3) % 2.5
                }s infinite`,
              }}
            />
          ))}
        </div>

        {/* Bottom fire glow line */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '3px',
            background:
              'linear-gradient(90deg, transparent, #d63a10, #ff6a00, #d63a10, transparent)',
            boxShadow: '0 0 18px 4px rgba(214,58,16,0.7)',
            animation: 'glowPulse 2s ease-in-out infinite alternate',
          }}
        />

        {/*Vignette*/}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        <header className="relative z-10 flex items-end justify-between h-full px-10 pb-8">
          <div className="flex flex-col gap-4">
            {/* Live badge */}
            <div
              className="flex items-center gap-2 w-fit px-3 py-1 rounded-full backdrop-blur-md"
              style={{
                background: 'rgba(214,58,16,0.18)',
                border: '1px solid rgba(214,58,16,0.4)',
              }}
            >
              <div className="relative flex w-2 h-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: '#ff5533' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: '#ff5533' }}
                />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-[2px]"
                style={{ color: '#ff7755' }}
              >
                Real-time Monitoring & Incident Response
              </span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-4">
              {/* Flame icon */}
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: '52px',
                  height: '52px',
                  background: 'linear-gradient(135deg, #d63a10, #ff6a00)',
                  boxShadow: '0 0 24px rgba(214,58,16,0.6)',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 2 7 7 7 13C7 15.76 9.24 18 12 18C14.76 18 17 15.76 17 13C17 10.5 15.5 8.5 14 7C14 7 14 9 12 9C10 9 9 7.5 9 6C9 4 12 2 12 2Z"
                    fill="white"
                    opacity="0.9"
                  />
                  <path
                    d="M12 14C12 14 10 13 10 11.5C10 10.5 10.8 10 11.5 10.5C11.5 10.5 11 12 12 12.5C13 13 13.5 11.5 13.5 11.5C14 12 14 13 12 14Z"
                    fill="#ffcc88"
                  />
                </svg>
              </div>

              <div>
                <h1
                  className="font-bold leading-tight tracking-tight"
                  style={{
                    fontSize: '38px',
                    color: '#fff',
                    textShadow: '0 2px 20px rgba(214,58,16,0.5)',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Fire Command Center
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{
                    color: 'rgba(255,180,150,0.7)',
                    letterSpacing: '0.3px',
                  }}
                >
                  Smart City Fire Intelligence — AI-Powered Detection
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* Keyframes injected inline */}
        <style>{`
    @keyframes riseEmber {
      0%   { transform: translateY(0) scale(1);   opacity: 0.7; }
      60%  { opacity: 0.5; }
      100% { transform: translateY(-280px) scale(0.4); opacity: 0; }
    }
    @keyframes glowPulse {
      from { opacity: 0.6; }
      to   { opacity: 1; }
    }
  `}</style>
      </div>

      <main className="p-6 md:px-30">
        <FireLiveEvents/>
        <FireIncidents/>
        <AirQuality/>
        {/* <div className="grid grid-cols-2 gap-5 bg-aman-teal mt-7">
         <CitySurveillanceMap/>
         <CitySurveillanceMap/>
        </div> */}
        
       
      </main>
    </div>
  );
};

export default FirePage;
