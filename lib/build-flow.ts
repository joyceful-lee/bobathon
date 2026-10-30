import { drinkSchema, teaLabel, type Drink } from './drinks';

export const sectionNames = ['Tea','Milk','Ice & sweetness','Toppings','Your drink'] as const;

export function drinkKey(drink:Drink){
 return JSON.stringify([drink.name.trim(),drink.tea,drink.tea==='Custom tea'?drink.teaName?.trim():null,drink.tea==='Custom tea'?drink.teaColor:null,drink.teaAmount,drink.milk,drink.milkAmount,drink.ice,drink.sweetness,[...drink.toppings].sort()]);
}

export function canVisitSection(section:number,unlocked:number){
 return Number.isInteger(section)&&section>=0&&section<sectionNames.length&&section<=unlocked;
}

export function unlockedAfterEdit(unlocked:number,current:number,patch:Partial<Drink>){
 return Object.keys(patch).some(key=>key!=='name')?Math.min(unlocked,current):unlocked;
}

export function advanceSection(current:number,unlocked:number,drink:Drink){
 if(!canVisitSection(current,unlocked))return {step:current,unlocked,finished:false};
 if(current===0&&drink.tea==='Custom tea'&&(!drink.teaName?.trim()||!/^#[0-9a-fA-F]{6}$/.test(drink.teaColor??'')))return {step:current,unlocked,finished:false};
 if(current===sectionNames.length-1)return {step:current,unlocked,finished:drinkSchema.safeParse(drink).success};
 const next=current+1;
 return {step:next,unlocked:Math.max(unlocked,next),finished:false};
}

export function describeDrink(drink:Drink){
 const base=drink.tea==='No tea'?(drink.milk==='No milk'?'You left out the tea and milk':`${drink.milk} makes a creamy base`):drink.milk==='No milk'?`${teaLabel(drink)} stays at the center of this blend`:`${teaLabel(drink)} meets ${drink.milk.toLowerCase()} in a ${drink.teaAmount>drink.milkAmount?'tea-forward':drink.teaAmount<drink.milkAmount?'creamier':'balanced'} blend`;
 const texture=drink.toppings.length?`You finished it with ${drink.toppings.map(t=>t.toLowerCase()).join(', ')}.`:'You kept the texture smooth by leaving out the toppings.';
 return `${base}, with ${drink.ice.toLowerCase()} and ${drink.sweetness} sweetness. ${texture}`;
}
