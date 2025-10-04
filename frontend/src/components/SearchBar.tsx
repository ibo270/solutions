import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "./UI";

export default function SearchBar(){
  const [origin, setO] = useState("");
  const [destination, setD] = useState("");
  const [date, setDate] = useState("");
  const [people, setP] = useState(1);
  const nav = useNavigate();

  function submit(e:any){
    e.preventDefault();
    const q = new URLSearchParams({origin, destination, date, people:String(people)});
    nav(`/search?${q.toString()}`);
  }

  return (
    <Card className="p-4 md:p-5">
      <form onSubmit={submit} className="grid md:grid-cols-5 gap-3">
        <input className="rounded-xl border p-2 dark:bg-white/10 dark:border-white/15 dark:text-white" placeholder="Откуда" value={origin} onChange={e=>setO(e.target.value)} />
        <input className="rounded-xl border p-2 dark:bg-white/10 dark:border-white/15 dark:text-white" placeholder="Куда" value={destination} onChange={e=>setD(e.target.value)} />
        <input type="date" className="rounded-xl border p-2 dark:bg-white/10 dark:border-white/15 dark:text-white" value={date} onChange={e=>setDate(e.target.value)} />
        <input type="number" min={1} className="rounded-xl border p-2 dark:bg-white/10 dark:border-white/15 dark:text-white" value={people} onChange={e=>setP(Number(e.target.value))} />
        <Button className="w-full">Искать</Button>
      </form>
    </Card>
  );
}
