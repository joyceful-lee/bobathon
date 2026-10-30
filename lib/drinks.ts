import { z } from 'zod';
export const teas = [
 {name:'Jasmine green',note:'Delicate jasmine with a fresh finish',color:'#a4b47c',tag:'FAN FAVORITE',symbol:'✿'},
 {name:'Classic black',note:'Rich tea with a smooth finish',color:'#aa6d40',tag:'THE ORIGINAL',symbol:'☀'},
 {name:'Roasted oolong',note:'Toasted leaves with a mellow finish',color:'#bf985e',tag:'COZY PICK',symbol:'❋'},
 {name:'Matcha',note:'Ground green tea with a grassy finish',color:'#81934e',tag:'GREEN ENERGY',symbol:'✳'},
 {name:'Earl Grey',note:'Black tea scented with bergamot',color:'#9b839d',tag:'A LITTLE FANCY',symbol:'✧'},
 {name:'No tea',note:'Leave the tea out of your blend',color:'#e3d4bd',tag:'CAFFEINE FREE',symbol:'♡'}
] as const;
export const milks = ['Whole milk','Oat milk','Almond milk','Coconut milk','No milk'] as const;
export const toppings = [{name:'Tapioca pearls',note:'The chewy classic',color:'#50332e'},{name:'Brown sugar pearls',note:'Soft pearls in caramel syrup',color:'#9b6244'},{name:'Lychee jelly',note:'Light & fruity',color:'#e7c4c8'},{name:'Mango popping boba',note:'Mango juice with a delicate shell',color:'#e9b946'},{name:'Grass jelly',note:'Silky & herbal',color:'#655351'},{name:'Aloe vera',note:'Tender pieces of aloe',color:'#abc7a2'}] as const;
export const drinkSchema = z.object({name:z.string().trim().min(1).max(60),tea:z.enum(['Jasmine green','Classic black','Roasted oolong','Matcha','Earl Grey','No tea']),teaAmount:z.number().int().min(0).max(100).multipleOf(10),milk:z.enum(milks),milkAmount:z.number().int().min(0).max(100).multipleOf(10),ice:z.enum(['No ice','Light ice','Regular ice','Extra ice']),toppings:z.array(z.enum(['Tapioca pearls','Brown sugar pearls','Lychee jelly','Mango popping boba','Grass jelly','Aloe vera'])).max(6),sweetness:z.enum(['0%','25%','50%','75%','100%'])}).superRefine((d,c)=>{if(d.teaAmount+d.milkAmount!==100)c.addIssue({code:'custom',message:'Tea and milk must add up to 100%.'});if((d.tea==='No tea')!== (d.teaAmount===0))c.addIssue({code:'custom',message:'Choose a tea for a nonzero tea amount.'});if((d.milk==='No milk')!==(d.milkAmount===0))c.addIssue({code:'custom',message:'Choose a milk for a nonzero milk amount.'});if(new Set(d.toppings).size!==d.toppings.length)c.addIssue({code:'custom',message:'Choose each topping once.'});});
export type Drink = z.infer<typeof drinkSchema>;
export const initialDrink:Drink = {name:'My boba drink',tea:'Jasmine green',teaAmount:60,milk:'Oat milk',milkAmount:40,ice:'Regular ice',toppings:['Tapioca pearls'],sweetness:'50%'};
