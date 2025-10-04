import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, FadeIn } from "../components/UI";
import BannerSlider from "../components/BannerSlider";
import SearchBar from "../components/SearchBar";
import HeroShowcase from "../components/HeroShowcase"; // твой текущий самолётик

export default function Landing(){
  const nav = useNavigate();
  const offers = [
    { title:"Bishkek → Dubai",    price: "from $199" },
    { title:"Almaty → Tashkent",  price: "from $129" },
    { title:"Bishkek → Astana",   price: "from $149" },
  ];

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex gap-2 mb-3"><Badge>Premium cabins</Badge><Badge>CO₂-smart</Badge></div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Летим с комфортом — без компромиссов</h1>
            <p className="text-lg text-slate-600 dark:text-white/80 mt-3">Интеллектуальный поиск, мгновенная покупка и безупречный сервис.</p>
            <div className="mt-5 flex gap-3">
              <Button onClick={()=>nav("/search")}>Найти рейс</Button>
              <Button variant="outline" onClick={()=>nav("/tickets")}>Мои билеты</Button>
            </div>
          </div>
          <HeroShowcase />
        </div>
      </FadeIn>
      <FadeIn><BannerSlider/></FadeIn>
      <FadeIn><SearchBar/></FadeIn>
      <FadeIn>
        <div className="grid md:grid-cols-3 gap-4">
          {offers.map(o=>(
            <Card key={o.title} className="p-4">
              <div className="font-semibold">{o.title}</div>
              <div className="text-slate-500 dark:text-white/70">{o.price}</div>
            </Card>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
