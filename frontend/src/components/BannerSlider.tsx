import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./UI";

const BANNERS = [
  { id:1, title:"-15% на полёты в Дубай", text:"Только до конца месяца", color:"from-blue-600 to-indigo-600" },
  { id:2, title:"Премиальные салоны",    text:"Лежачие кресла и Wi-Fi", color:"from-sky-500 to-blue-700" },
  { id:3, title:"Умные CO₂-маршруты",    text:"Экономим время и планету", color:"from-indigo-500 to-violet-600" },
];

export default function BannerSlider(){
  const [idx, setIdx] = useState(0);
  useEffect(()=>{ const t = setInterval(()=> setIdx(i => (i+1)%BANNERS.length), 4500); return ()=>clearInterval(t); },[]);
  const b = BANNERS[idx];

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 md:h-56">
        <AnimatePresence mode="wait">
          <motion.div
            key={b.id}
            initial={{opacity:0, scale:.98}}
            animate={{opacity:1, scale:1}}
            exit={{opacity:0, scale:.98}}
            transition={{duration:.4}}
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${b.color} text-white p-6 flex items-center`}
          >
            <div>
              <div className="text-2xl md:text-3xl font-extrabold">{b.title}</div>
              <div className="text-white/90 mt-1">{b.text}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
