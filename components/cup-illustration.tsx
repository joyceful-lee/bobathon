import { useId } from 'react';
import { Drink,teas,toppings } from '@/lib/drinks';

export default function Cup({drink,small=false}:{drink:Drink;small?:boolean}){
 const id=useId().replaceAll(':','');
 const teaColor=teas.find(t=>t.name===drink.tea)?.color||'#acb98b';
 const milkColor=drink.milk==='No milk'?teaColor:drink.milk==='Coconut milk'?'#f1eddb':'#e4d3af';
 const boundary=360-245*drink.teaAmount/100;
 const iceCount={'No ice':0,'Light ice':3,'Regular ice':6,'Extra ice':10}[drink.ice];
 const pearls=Array.from({length:drink.toppings.length*7},(_,i)=>({x:86+(i*37)%138,y:338-(i*19)%52,r:7+i%3,ingredient:drink.toppings[i%drink.toppings.length]}));
 return <svg viewBox="0 0 310 410" role="img" aria-label={`${drink.tea} with ${drink.milk} and ${drink.toppings.length} toppings`} className={small?'cup-svg small':'cup-svg'}>
 <defs>
 <clipPath id={id+'clip'}><path d="M58 111L253 111L232 342Q230 361 211 362H100Q80 361 78 342Z"/></clipPath>
 <linearGradient id={id+'liquid'} x1="0" x2="1"><stop stopColor={teaColor}/><stop offset=".25" stopColor={teaColor} stopOpacity=".82"/><stop offset=".8" stopColor={teaColor}/><stop offset="1" stopColor="#443c23" stopOpacity=".65"/></linearGradient>
 <linearGradient id={id+'glass'}><stop stopColor="white" stopOpacity=".45"/><stop offset=".12" stopColor="white" stopOpacity=".08"/><stop offset=".45" stopColor="white" stopOpacity="0"/><stop offset=".85" stopColor="white" stopOpacity=".06"/><stop offset=".94" stopColor="white" stopOpacity=".35"/><stop offset="1" stopColor="white" stopOpacity=".12"/></linearGradient>
 <linearGradient id={id+'straw'}><stop stopColor="#b75030"/><stop offset=".5" stopColor="#de7d50"/><stop offset="1" stopColor="#b65c37"/></linearGradient>
 <radialGradient id={id+'shadow'}><stop stopColor="#344738" stopOpacity=".25"/><stop offset="1" stopColor="#344738" stopOpacity="0"/></radialGradient>
 <pattern id={id+'grain'} width="13" height="17" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".65" fill="#faf8df" opacity=".2"/><circle cx="9" cy="13" r=".5" fill="#3d482d" opacity=".1"/></pattern>
 </defs>
 <ellipse cx="159" cy="380" rx="114" ry="19" fill={`url(#${id}shadow)`}/>
 <path d="M187 21L202 24L162 223L147 220Z" fill={`url(#${id}straw)`}/>
 <g clipPath={`url(#${id}clip)`}>
 <path d="M50 110H260V367H50Z" fill={milkColor}/>
 <path d={`M49 ${boundary}Q100 ${boundary-10} 154 ${boundary+3}T260 ${boundary}V367H49Z`} fill={`url(#${id}liquid)`}/>
 {drink.milkAmount>0&&drink.teaAmount>0?<><path d={`M65 ${boundary+10}Q141 ${boundary-7} 213 ${boundary+39}T221 363H80Z`} fill={milkColor} opacity=".3"/><path d={`M71 ${boundary+25}Q201 ${boundary+8} 225 ${boundary+72}T210 359`} stroke={milkColor} strokeOpacity=".2" strokeWidth="14" fill="none"/></>:null}
 <rect x="50" y="110" width="220" height="255" fill={`url(#${id}grain)`}/>
 {Array.from({length:iceCount},(_,i)=><g key={i} transform={`translate(${79+i*41%133} ${126+i*31%83}) rotate(${i%2?17:-13} 15 15)`}><path d="M0 7L8 0H31L33 25L25 33L2 31Z" fill="#f4f5e9" fillOpacity=".3" stroke="#fffdf0" strokeOpacity=".45"/><path d="M0 7L24 8L31 0M24 8L25 33M6 13L7 25" stroke="#fffef4" strokeOpacity=".4" fill="none"/></g>)}
 {pearls.map((p,i)=>{const color=toppings.find(t=>t.name===p.ingredient)?.color||'#50332e';return <g key={i}>{p.ingredient.includes('jelly')||p.ingredient==='Aloe vera'?<rect x={p.x-p.r} y={p.y-p.r} width={p.r*1.8} height={p.r*1.5} rx="2" transform={`rotate(${i*31} ${p.x} ${p.y})`} fill={color}/>:<><circle cx={p.x} cy={p.y} r={p.r} fill={color}/><path d={`M${p.x-3} ${p.y-2}q0-3 4-3`} stroke="#fffbe5" strokeWidth="1.2" strokeOpacity=".3" fill="none"/></>}</g>})}
 <path d="M55 110H258L234 365H78Z" fill={`url(#${id}glass)`}/>
 <path d="M70 142L86 326" stroke="#fffdf2" strokeWidth="4" strokeLinecap="round" opacity=".35"/>
 </g>
 <path d="M58 111L253 111L232 342Q230 361 211 362H100Q80 361 78 342Z" fill="none" stroke="#52604b" strokeOpacity=".45" strokeWidth="1.5"/>
 <path d="M51 104Q155 90 260 104L258 118Q155 108 53 118Z" fill="#ece9d8" stroke="#8c937d" strokeWidth="1.4"/>
 <ellipse cx="155" cy="103" rx="104" ry="10" fill="#faf8e8" stroke="#8c937d" strokeWidth="1.3"/>
 <ellipse cx="155" cy="102" rx="95" ry="5" fill="none" stroke="#d4d3bd"/>
 <path d="M171 102L187 21L202 24L186 103Z" fill={`url(#${id}straw)`}/>
 <path d="M192 26L178 96" stroke="#efad77" strokeOpacity=".5" strokeWidth="2"/>
 <g transform="rotate(-5 155 244)"><path d="M107 216Q153 208 204 216L200 276Q152 285 110 275Z" fill="#f9f4dc" stroke="#d6cfb4" strokeWidth=".7"/><text x="155" y="239" textAnchor="middle" fontSize="16" fontFamily="Fraunces,serif" fontWeight="600" fill="#344a3b">bobathon</text><path d="M123 248H187" stroke="#b1b49b" strokeWidth=".7"/></g>
 <path d="M91 347Q154 356 220 346" fill="none" stroke="#fffced" strokeWidth="2" strokeOpacity=".3"/>
 </svg>;
}
