import { z } from 'zod';
export const teas = [
 {name:'Jasmine green',note:'Delicate jasmine with a fresh finish',color:'#b8b083',tag:'FAN FAVORITE',symbol:'✿'},
 {name:'Classic black',note:'Rich tea with a smooth finish',color:'#613c29',tag:'THE ORIGINAL',symbol:'☀'},
 {name:'Roasted oolong',note:'Toasted leaves with a mellow finish',color:'#bf985e',tag:'COZY PICK',symbol:'❋'},
 {name:'Matcha',note:'Ground green tea with a grassy finish',color:'#81934e',tag:'GREEN ENERGY',symbol:'✳'},
 {name:'Custom tea',note:'Name your tea and choose its color',color:'#ba8755',tag:'YOUR CHOICE',symbol:'✧'},
 {name:'No tea',note:'Leave the tea out of your blend',color:'#e3d4bd',tag:'CAFFEINE FREE',symbol:'♡'}
] as const;
export const milks = ['Whole milk','Oat milk','Almond milk','Coconut milk','No milk'] as const;
export const milkColors:Record<typeof milks[number],string>={'Whole milk':'#fffdf4','Oat milk':'#c5a373','Almond milk':'#ead9b5','Coconut milk':'#f1eddb','No milk':'transparent'};
export const toppings = [{name:'Tapioca pearls',note:'The chewy classic',color:'#50332e'},{name:'Brown sugar pearls',note:'Soft pearls in caramel syrup',color:'#9b6244'},{name:'Lychee jelly',note:'Light & fruity',color:'#e7c4c8'},{name:'Mango popping boba',note:'Mango juice with a delicate shell',color:'#e9b946'},{name:'Grass jelly',note:'Silky & herbal',color:'#655351'},{name:'Aloe vera',note:'Tender pieces of aloe',color:'#abc7a2'}] as const;
// Earl Grey remains readable for drinks saved before the custom tea option.
export const drinkSchema = z.object({name:z.string().trim().min(1).max(60),tea:z.enum(['Jasmine green','Classic black','Roasted oolong','Matcha','Earl Grey','Custom tea','No tea']),teaName:z.string().trim().max(40).optional(),teaColor:z.string().regex(/^#[0-9a-fA-F]{6}$/,'Choose a valid tea color.').optional(),teaAmount:z.number().int().min(0).max(100).multipleOf(10),milk:z.enum(milks),milkAmount:z.number().int().min(0).max(100).multipleOf(10),ice:z.enum(['No ice','Light ice','Regular ice','Extra ice']),toppings:z.array(z.string().trim().min(1).max(40)).max(12),sweetness:z.enum(['0%','25%','50%','75%','100%'])}).superRefine((d,c)=>{
 const empty=d.tea==='No tea'&&d.milk==='No milk';
 if(d.teaAmount+d.milkAmount!==(empty?0:100))c.addIssue({code:'custom',message:'Tea and milk must add up to 100%, or both be left out.'});
 if((d.tea==='No tea')!==(d.teaAmount===0))c.addIssue({code:'custom',message:'Choose a tea for a nonzero tea amount.'});
 if((d.milk==='No milk')!==(d.milkAmount===0))c.addIssue({code:'custom',message:'Choose a milk for a nonzero milk amount.'});
 if(d.tea==='Custom tea'&&(!d.teaName||!d.teaColor))c.addIssue({code:'custom',message:'Name your custom tea and choose its color.'});
 if(new Set(d.toppings.map(t=>t.toLowerCase())).size!==d.toppings.length)c.addIssue({code:'custom',message:'Choose each topping once.'});
});
export type Drink = z.infer<typeof drinkSchema>;
export const initialDrink:Drink = {name:'My boba drink',tea:'Jasmine green',teaAmount:60,milk:'Oat milk',milkAmount:40,ice:'Regular ice',toppings:['Tapioca pearls'],sweetness:'50%'};

export function teaLabel(drink:Pick<Drink,'tea'|'teaName'>){return drink.tea==='Custom tea'?drink.teaName?.trim()||'Custom tea':drink.tea;}
export function baseLabel(drink:Pick<Drink,'tea'|'teaName'|'milk'>){return drink.tea==='No tea'?(drink.milk==='No milk'?'No tea or milk':drink.milk):`${teaLabel(drink)}${drink.milk==='No milk'?'':' with '+drink.milk.toLowerCase()}`;}
export function chooseTea(drink:Drink,tea:Drink['tea']):Partial<Drink>{
 const teaAmount=tea==='No tea'?0:drink.milk==='No milk'?100:drink.teaAmount||60;
 return {tea,teaAmount,milkAmount:drink.milk==='No milk'?0:100-teaAmount,teaName:tea==='Custom tea'?drink.teaName??'':undefined,teaColor:tea==='Custom tea'?drink.teaColor??'#ba8755':undefined};
}
export function chooseMilk(drink:Drink,milk:Drink['milk']):Partial<Drink>{
 const milkAmount=milk==='No milk'?0:drink.tea==='No tea'?100:drink.milkAmount||40;
 return {milk,milkAmount,teaAmount:drink.tea==='No tea'?0:100-milkAmount};
}
