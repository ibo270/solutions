export function formatPrice(n:number,currency='USD'){ return new Intl.NumberFormat('ru-RU',{style:'currency',currency}).format(n); }
export function calcDiscount(base:number, percent?:number){ if(!percent||percent<=0) return {final:base,saved:0}; const saved=+(base*(percent/100)).toFixed(2); return {final:+(base-saved).toFixed(2),saved}; }
export function inferAutoDiscount(seats:number){ if(seats<=3) return 15; if(seats<=7) return 10; return undefined; }
export const PROMO_CODES:Record<string,number>={ AURORA15:15, SKY10:10, STUDENT7:7 };
