// src/api/content.ts
import api from "./client";

export type Banner = { id:number; title:string; image_url:string; link_url?:string; is_active:boolean; order:number };
export type Offer  = { id:number; title:string; subtitle?:string; price_from?:string; is_featured:boolean; order:number };

export async function getBanners(): Promise<Banner[]> {
  const { data } = await api.get("/api/content/banners/");
  return data;
}
export async function getOffers(): Promise<Offer[]> {
  const { data } = await api.get("/api/content/offers/");
  return data;
}
