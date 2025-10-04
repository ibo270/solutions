import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-b from-sky-900 via-sky-800 to-sky-900 text-white">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(transparent_1px,rgba(0,0,0,0)_1px)] [background-size:3px_3px] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(white_0.5px,transparent_0.5px)] [background-size:4px_4px] opacity-10" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">404 — Маршрут не найден</h1>
        <p className="mt-4 text-sky-100/90 text-lg md:text-xl">
          Похоже, этот рейс сняли с расписания. Давай подберём другой?
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link to="/" className="rounded-xl bg-white text-sky-900 px-5 py-2.5 font-semibold shadow hover:bg-slate-100">
            На главную
          </Link>
          <Link to="/search" className="rounded-xl border border-white/40 px-5 py-2.5 font-semibold hover:bg-white/10">
            К поиску рейсов
          </Link>
        </div>
      </div>

      <Cloud className="left-[-15%] top-20 animate-cloudFast" scale={1.1} opacity={0.35} />
      <Cloud className="left-[10%] top-44 animate-cloudSlow" scale={0.9} opacity={0.25} />
      <Cloud className="left-[35%] top-12 animate-cloud" scale={1.3} opacity={0.3} />
      <Cloud className="left-[65%] top-36 animate-cloudSlow" scale={1.1} opacity={0.28} />

      <FlightPath />
    </div>
  );
}

function Cloud({ className = "", scale = 1, opacity = 0.3 }:
  { className?: string; scale?: number; opacity?: number; }) {
  return (
    <svg aria-hidden className={`pointer-events-none absolute w-[480px] ${className}`}
         viewBox="0 0 640 320" fill="none" style={{ transform: `scale(${scale})`, opacity }}>
      <defs>
        <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <path fill="url(#cg)"
            d="M120 220c-40 0-72-24-72-54 0-23 17-43 40-51 2-44 51-77 103-61 24-33 77-38 110-10 43-28 106-3 116 45 32 0 58 24 58 54 0 30-26 54-58 54H120Z" />
    </svg>
  );
}

function FlightPath() {
  return (
    <svg className="absolute inset-x-0 bottom-[-30px] md:bottom-[-10px] mx-auto w-[1100px] max-w-none"
         viewBox="0 0 1100 360" fill="none">
      <path d="M60 300 C 260 200, 420 340, 600 230 S 940 160, 1040 260"
            stroke="rgba(255,255,255,0.35)" strokeWidth="3"
            strokeDasharray="8 10" strokeLinecap="round" />
      <circle cx="60" cy="300" r="6" fill="#fff" />
      <circle cx="1040" cy="260" r="6" fill="#fff" />
      <g className="animate-plane">
        <ellipse cx="0" cy="0" rx="38" ry="10" fill="black" opacity="0.25"
                 className="translate-x-[--x] translate-y-[calc(var(--y)+18px)] blur-[2px]" />
        <g className="translate-x-[--x] translate-y-[--y]">
          <PlaneIcon />
        </g>
      </g>
    </svg>
  );
}
function PlaneIcon() {
  return (
    <svg aria-label="plane" width="64" height="64" viewBox="0 0 64 64"
         className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
      <defs>
        <linearGradient id="pg" x1="0" x2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path d="M6 37l18 1 10 12 6 0-6-12 18-2c2 0 4-2 4-4s-2-4-4-4l-18-2 6-12-6 0-10 12-18 1c-3 0-4 2-4 5s1 5 4 5z"
            fill="url(#pg)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="26" cy="38" r="1.8" fill="white" />
      <circle cx="30" cy="38.2" r="1.2" fill="white" />
    </svg>
  );
}
