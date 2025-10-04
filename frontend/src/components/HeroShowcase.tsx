import React, { useEffect, useRef, useState } from "react";
import {
  motion, useMotionValue, useSpring, useVelocity, useTransform, MotionValue,
} from "framer-motion";

type Mode = "free" | "docked";

export default function HeroShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("docked");

  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const root = document.documentElement;
    const mo = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const tx = useMotionValue(0), ty = useMotionValue(0);
  const x = useSpring(0, { stiffness: 90, damping: 18, mass: 0.7 });
  const y = useSpring(0, { stiffness: 90, damping: 18, mass: 0.7 });

  const vx = useVelocity(x), vy = useVelocity(y);
  const angle = useTransform(() => (Math.atan2(vy.get()||0, vx.get()||0) * 180) / Math.PI);
  const bank  = useTransform(angle, [-90, 0, 90], [16, 0, -16]);

  const cx1 = useTransform(x, (v) => -10 + (v / 300) * 6);
  const cy1 = useTransform(y, (v) =>  8 + (v / 300) * -4);
  const cx2 = useTransform(x, (v) =>   6 + (v / 300) * 4);
  const cy2 = useTransform(y, (v) =>  -4 + (v / 300) * 3);

  function setPoint(nx:number, ny:number){ tx.set(nx); ty.set(ny); x.set(nx); y.set(ny); }
  function center(){ if(!ref.current) return; const r=ref.current.getBoundingClientRect(); setPoint(r.width/2, r.height/2); }
  useEffect(()=>{ center(); /* eslint-disable-line */ },[]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (mode !== "free") return;
      const pad=16;
      const gx=Math.max(pad, Math.min(window.innerWidth-pad, e.clientX));
      const gy=Math.max(pad, Math.min(window.innerHeight-pad, e.clientY));
      setPoint(gx, gy);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mode]);

  function toFree(){
    if(ref.current){
      const r=ref.current.getBoundingClientRect();
      setPoint(r.left+x.get(), r.top+y.get());
    }
    setMode("free");
  }
  function toDocked(){ setMode("docked"); center(); }
  function toggle(){ mode==="free"?toDocked():toFree(); }
  useEffect(()=>{ const h=(e:KeyboardEvent)=> (e.key||"").toLowerCase()==="f" && toggle(); window.addEventListener("keydown",h); return()=>window.removeEventListener("keydown",h);},[mode]); // eslint-disable-line

  return (
    <>
      <div className="relative rounded-[28px] p-[2px]
                      bg-white dark:bg-white/5
                      border border-black/10 dark:border-white/15
                      shadow-[0_40px_120px_-40px_rgba(0,0,0,.6)]">
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-[26px] min-h-[420px] ${
            isDark ? "bg-[#0a0f1f]" : "bg-gradient-to-br from-[#6a8aff] to-[#5148da]"
          }`}
        >
          {!isDark ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_25%_-10%,rgba(255,255,255,.18),transparent)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_340px_at_70%_110%,rgba(0,0,0,.18),transparent)]" />
              <SunRight />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(1200px_420px_at_50%_-20%,rgba(59,130,246,.15),transparent)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_340px_at_70%_110%,rgba(0,0,0,.55),transparent)]" />
              <MoonRight />
              <Stars count1={70} count2={40} />
            </>
          )}

          <Cloud left="10%" top="22%" w={260} dx={cx1} dy={cy1} opacity={isDark ? 0.16 : 0.45} />
          <Cloud left="66%" top="16%" w={200} dx={cx2} dy={cy2} opacity={isDark ? 0.12 : 0.35} />
          <Cloud left="24%" top="70%" w={240} dx={cx1} dy={cy2} opacity={isDark ? 0.18 : 0.40} />

          <button
            onClick={toggle}
            className="absolute right-4 bottom-4 z-10 rounded-xl px-3 py-2
                       border bg-white text-slate-800 border-black/10 shadow-sm hover:bg-slate-100
                       dark:border-white/20 dark:bg-white/10 dark:text-white/95 dark:hover:bg-white/20"
            title="Нажми F"
          >
            {mode==="free" ? "🕊 Free flight (F)" : "🎯 Docked (F)"}
          </button>

          {mode === "docked" && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <PlaneSVG />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
          <Badge>🛏️ lie-flat seats</Badge>
          <Badge>🍽️ chef menu</Badge>
          <Badge>🛰️ fast Wi-Fi</Badge>
          <Badge>✨ lounge access</Badge>
        </div>
      </div>

      {mode === "free" && (
        <motion.div
          style={{ x, y, rotate: angle, translateX: "-50%", translateY: "-50%" }}
          className="fixed left-0 top-0 z-[60] pointer-events-none"
        >
          <motion.div style={{ rotateZ: bank }}>
            <PlaneSVG />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/* atoms/sky */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm
                     border border-black/10 bg-white text-slate-800 shadow-sm
                     dark:border-white/15 dark:bg-white/10 dark:text-white/90">
      {children}
    </span>
  );
}

function Cloud({ left, top, w, dx, dy, opacity = 0.4 }:{
  left:string; top:string; w:number; dx?:MotionValue<number>; dy?:MotionValue<number>; opacity?:number;
}) {
  const style = { left, top, width:w, height:w*0.55, x:dx, y:dy } as any;
  return (
    <motion.div style={style} className="absolute" aria-hidden>
      <div className="absolute left-2  top-12 h-[52%] w-[46%] rounded-full blur-xl" style={{ background:`rgba(255,255,255,${opacity})` }}/>
      <div className="absolute left-28 top-4  h-[60%] w-[50%] rounded-full blur-xl" style={{ background:`rgba(255,255,255,${opacity*0.9})` }}/>
      <div className="absolute left-14 top-10 h-[58%] w-[48%] rounded-full blur-xl" style={{ background:`rgba(255,255,255,${opacity*0.95})` }}/>
      <div className="absolute left-36 top-16 h-[48%] w-[42%] rounded-full blur-xl" style={{ background:`rgba(255,255,255,${opacity*0.85})` }}/>
    </motion.div>
  );
}

function SunRight(){
  return (
    <div className="absolute right-6 top-6">
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-[#fff3b0] shadow-[0_0_40px_10px_rgba(255,243,176,.45)]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,.6),transparent_60%)]" />
      </div>
    </div>
  );
}
function MoonRight(){
  return (
    <div className="absolute right-6 top-6">
      <div className="relative">
        <div className="h-14 w-14 rounded-full bg-[#f8fafc] shadow-[0_0_30px_8px_rgba(248,250,252,.18)]" />
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,.08),transparent_60%)]" />
      </div>
    </div>
  );
}

function Stars({ count1=70, count2=40 }:{count1?:number; count2?:number;}){
  return (
    <>
      {[...Array(count1)].map((_,i)=>(
        <motion.span key={`s1-${i}`} className="absolute bg-white rounded-full"
          style={{ left:`${Math.random()*100}%`, top:`${Math.random()*60}%`, width:2, height:2, opacity:0.7 }}
          animate={{ opacity:[0.4,0.9,0.4] }} transition={{ duration:2+Math.random()*2, repeat:Infinity }} />
      ))}
      {[...Array(count2)].map((_,i)=>(
        <motion.span key={`s2-${i}`} className="absolute bg-white rounded-full"
          style={{ left:`${Math.random()*100}%`, top:`${20+Math.random()*70}%`, width:1.5, height:1.5, opacity:0.6 }}
          animate={{ opacity:[0.3,0.8,0.3] }} transition={{ duration:3+Math.random()*2, repeat:Infinity }} />
      ))}
    </>
  );
}

function PlaneSVG(){
  const body="#DDDDF7", dark="#5E64C9", wing="#C7C9F3", shine="#F4F5FF", belly="#7AA0FF";
  return (
    <svg viewBox="0 0 420 220" width="180" height="180"
         className="drop-shadow-[0_12px_22px_rgba(0,0,0,.35)] select-none" aria-hidden>
      <path d="M40 140 C 140 90, 260 75, 340 90 C 370 95, 390 110, 390 125 C 390 142, 365 160, 330 168 C 260 184, 150 184, 70 160 C 56 156, 46 150, 44 144 C 42 139, 44 136, 40 140 Z" fill={body}/>
      <path d="M320 88 C 350 90, 380 110, 392 122 C 372 120, 350 120, 330 124 C 318 126, 310 124, 300 118 C 315 108, 318 96, 320 88 Z" fill={dark}/>
      <path d="M245 100 Q 285 96 305 98 Q 270 108 245 100 Z" fill={shine}/>
      <path d="M300 148 Q 340 146 360 142 Q 345 156 300 148 Z" fill={shine}/>
      <path d="M72 120 L120 132 L82 150 Q65 155 60 150 Q52 144 60 136 Z" fill={wing}/>
      <path d="M80 78 L116 132 L100 134 L70 92 Z" fill={dark}/>
      <path d="M160 132 L290 150 L240 172 Q200 188 168 186 Q150 185 150 174 Q152 158 160 132 Z" fill={wing}/>
      <path d="M150 120 L250 134 L178 150 Q160 154 150 150 Q144 148 146 140 Z" fill={dark}/>
      <path d="M22 82 Q70 54 104 58 Q112 59 112 60 Q112 62 104 64 Q70 70 22 86 Z" fill={belly}/>
      {Array.from({length:9}).map((_,i)=>(<circle key={i} cx={150+i*22} cy={128} r={8} fill={dark}/>))}
    </svg>
  );
}
