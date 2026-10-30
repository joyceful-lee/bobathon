import { ArrowLeft,ArrowRight,Bookmark,Check,Plus } from 'lucide-react';
import { teaLabel, type Drink } from '@/lib/drinks';
import { describeDrink } from '@/lib/build-flow';
import Cup from './cup-illustration';

type Props={drink:Drink;creator?:string;busy:boolean;saved:boolean;notice:string;onName:(name:string)=>void;onSave:()=>void;onCard:()=>void;onEdit:()=>void;onNew:()=>void};

export default function FinishedDrink({drink,creator,busy,saved,notice,onName,onSave,onCard,onEdit,onNew}:Props){
 return <section className="finished-drink" aria-labelledby="finished-title">
  <div className="finished-art"><div className="finished-art-label">{creator?`Blended by ${creator}`:'Your finished blend'}</div><Cup drink={drink}/><span className="finished-size">500 ml</span></div>
  <div className="finished-details"><p className="finish-complete"><Check size={15}/>Your drink is complete</p><h1 id="finished-title">{drink.name||'Your boba drink'}</h1><p className="finished-description">{describeDrink(drink)}</p>
   <label className="finished-name" htmlFor="finished-name">Make the name your own<input id="finished-name" value={drink.name} maxLength={60} onChange={e=>onName(e.target.value)}/></label>
   <dl className="finished-specs"><div><dt>Tea</dt><dd>{teaLabel(drink)} · {drink.teaAmount}%</dd></div><div><dt>Milk</dt><dd>{drink.milk} · {drink.milkAmount}%</dd></div><div><dt>Ice</dt><dd>{drink.ice}</dd></div><div><dt>Sweetness</dt><dd>{drink.sweetness}</dd></div><div><dt>Toppings</dt><dd>{drink.toppings.join(' + ')||'None'}</dd></div></dl>
   <div className="finished-actions"><button className="primary" onClick={onCard} disabled={busy||!drink.name.trim()}>Make my drink card<ArrowRight size={17}/></button><button className="secondary" onClick={onSave} disabled={busy||saved||!drink.name.trim()}>{saved?<Check size={17}/>:<Bookmark size={17}/>} {saved?'Saved to your drinks':'Save this drink'}</button></div>
   {notice?<p className="finished-feedback" role="status">{notice}</p>:null}
   <p className="finished-save-note">Save it to your account when you want to come back to this exact blend.</p><div className="finished-edit-actions"><button onClick={onEdit}><ArrowLeft size={15}/>Adjust my drink</button><button onClick={onNew}>Start another cup<Plus size={15}/></button></div>
  </div>
 </section>;
}
