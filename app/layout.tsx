import type { Metadata } from 'next';
import './globals.css';
import './counter.css';
import './mobile-flow.css';
import './guided-flow.css';
export const metadata:Metadata={title:'Bobathon — Build a boba drink',description:'Find your blend of tea, milk and toppings, keep the recipe for another visit, and show your drink card at a boba shop.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
