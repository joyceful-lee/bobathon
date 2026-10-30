const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const ts=require('typescript');
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);
const {advanceSection,canVisitSection,unlockedAfterEdit,drinkKey,describeDrink}=require(path.resolve(__dirname,'../lib/build-flow.ts'));
const {initialDrink,drinkSchema}=require(path.resolve(__dirname,'../lib/drinks.ts'));

let step=0,unlocked=0;
assert.equal(canVisitSection(4,unlocked),false,'The finish section must not be reachable initially.');
assert.equal(canVisitSection(1,unlocked),false,'Milk must stay locked until tea is confirmed.');
for(let i=0;i<4;i++){
 assert.equal(step,i);
 assert.equal(canVisitSection(i+1,unlocked),false);
 const next=advanceSection(step,unlocked,initialDrink);
 assert.equal(next.finished,false);
 step=next.step;unlocked=next.unlocked;
}
assert.equal(advanceSection(step,unlocked,initialDrink).finished,true);
assert.equal(advanceSection(4,4,{...initialDrink,name:'   '}).finished,false,'An unnamed drink cannot be finished.');
assert.equal(unlockedAfterEdit(4,1,{milk:'Almond milk'}),1,'Changing milk must require later sections to be confirmed again.');
assert.equal(unlockedAfterEdit(4,4,{name:'A cup of my own'}),4,'A personal name must preserve the completed ingredient choices.');
assert.equal(canVisitSection(4,unlockedAfterEdit(4,0,{tea:'Matcha'})),false);
assert.equal(drinkSchema.safeParse({...initialDrink,teaAmount:70,milkAmount:30}).success,true);
assert.equal(drinkSchema.safeParse({...initialDrink,teaAmount:70,milkAmount:40}).success,false);
assert.equal(drinkKey(initialDrink),drinkKey({...initialDrink,toppings:[...initialDrink.toppings].reverse()}));
assert.match(describeDrink({...initialDrink,toppings:[]}),/leaving out the toppings/);
assert.equal(canVisitSection(-1,4),false);
assert.equal(canVisitSection(5,4),false);
console.log('Verified section gating, re-confirmation after edits, finished-drink validation, and stable saved-drink identity.');
