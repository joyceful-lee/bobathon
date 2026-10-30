const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const ts=require('typescript');
const Module=require('node:module');
const resolve=Module._resolveFilename;
Module._resolveFilename=function(name,...args){return resolve.call(this,name.startsWith('@/')?path.resolve(__dirname,'..',name.slice(2)):name,...args);};
require.extensions['.tsx']=require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);
const {initialDrink,drinkSchema,chooseTea,chooseMilk,milkColors,teaLabel}=require('../lib/drinks.ts');
const {drinkKey,advanceSection}=require('../lib/build-flow.ts');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const Cup=require('../components/cup-illustration.tsx').default;
let empty={...initialDrink,...chooseTea(initialDrink,'No tea')};
empty={...empty,...chooseMilk(empty,'No milk'),ice:'No ice',toppings:[]};
assert.equal(empty.tea,'No tea');assert.equal(empty.milk,'No milk');
assert.equal(empty.teaAmount,0);assert.equal(empty.milkAmount,0);
assert.ok(drinkSchema.safeParse(empty).success);
assert.ok(!renderToStaticMarkup(React.createElement(Cup,{drink:empty})).includes('data-liquid='),'An empty cup must not draw a liquid layer.');
for(const tea of ['Matcha','No tea'])for(const milk of ['Almond milk','No milk']){
 const selected={...empty,...chooseTea(empty,tea)};
 const next={...selected,...chooseMilk(selected,milk)};
 assert.equal(next.tea,tea);assert.equal(next.milk,milk);assert.ok(drinkSchema.safeParse(next).success);
}
const custom={...initialDrink,name:'Violet afternoon',tea:'Custom tea',teaName:'Butterfly pea tea',teaColor:'#7565ac',toppings:['Taro pudding','Strawberry jelly','Tapioca pearls']};
assert.deepEqual(drinkSchema.parse(custom),custom);
assert.equal(teaLabel(custom),'Butterfly pea tea');
assert.equal(drinkSchema.safeParse({...custom,teaName:' '}).success,false);
assert.equal(advanceSection(0,0,{...custom,teaName:''}).step,0);
assert.equal(drinkSchema.safeParse({...custom,teaColor:'url(https://invalid)'}).success,false);
assert.equal(drinkSchema.safeParse({...custom,toppings:['Taro pudding','taro pudding']}).success,false);
assert.equal(drinkSchema.safeParse({...custom,toppings:Array.from({length:13},(_,i)=>`Topping ${i}`)}).success,false);
assert.notEqual(drinkKey(custom),drinkKey({...custom,teaColor:'#123456'}));
assert.notEqual(drinkKey(custom),drinkKey({...custom,teaName:'Another tea'}));
assert.equal(new Set(['Whole milk','Oat milk','Almond milk'].map(m=>milkColors[m])).size,3);
for(const milk of ['Whole milk','Oat milk','Almond milk']){
 const html=renderToStaticMarkup(React.createElement(Cup,{drink:{...custom,milk}}));
 assert.ok(html.includes(`fill="${milkColors[milk]}"`));assert.ok(html.includes('#7565ac'));
}
assert.ok(drinkSchema.safeParse({...initialDrink,tea:'Earl Grey'}).success,'Older saved drinks remain readable.');
console.log('Verified empty cups, explicit ingredient choices, distinct milk colors, custom tea/toppings validation, rendering, and saved identity.');
if(process.env.DATABASE_URL){
 const {db}=require('../lib/db.ts');
 db().query('SELECT $1::jsonb AS drink',[JSON.stringify(drinkSchema.parse(custom))]).then(rows=>{
  assert.deepEqual(drinkSchema.parse(rows[0].drink),custom);
  console.log('Neon JSON round trip preserves custom tea name, color, and multiple toppings.');
 }).catch(e=>{console.error(e.message);process.exitCode=1;});
}
