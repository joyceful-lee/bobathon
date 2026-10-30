const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const ts=require('typescript');

// Load the actual server queries without introducing a test framework.
require.extensions['.tsx']=require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,file);
const Module=require('node:module');const resolve=Module._resolveFilename;Module._resolveFilename=function(name,...args){return resolve.call(this,name.startsWith('@/')?path.resolve(__dirname,'..',name.slice(2)):name,...args);};
const {getInsights,normalizedBlendsSql}=require(path.resolve(__dirname,'../lib/insights.ts'));
const {db}=require(path.resolve(__dirname,'../lib/db.ts'));

(async()=>{
 const data=await getInsights();
 assert.ok(data.uniqueBlends<=data.sampleCount);
 const totals=await db().query('SELECT (SELECT COUNT(*)::int FROM orders) AS cards,(SELECT COUNT(*)::int FROM drinks) AS saved');
 assert.equal(data.sampleCount,totals[0].cards);assert.equal(data.savedDrinks,totals[0].saved);
 for(const key of ['teas','milks','ice','sweetness'])assert.equal(data[key].reduce((sum,item)=>sum+item.count,0),data.sampleCount);
 console.log('Live database matches dashboard:',JSON.stringify({completedCards:data.sampleCount,savedDrinks:data.savedDrinks,distinctCombinations:data.uniqueBlends}));
 for(const key of ['teas','milks','toppings','ice','sweetness']){
  assert.ok(Array.isArray(data[key]));
  for(const item of data[key]){assert.equal(typeof item.name,'string');assert.ok(item.count>0&&item.count<=data.sampleCount);}
 }
 for(const blend of data.blends){assert.ok(blend.count>0);assert.equal(blend.recipe.teaAmount+blend.recipe.milkAmount,blend.recipe.tea==='No tea'&&blend.recipe.milk==='No milk'?0:100);assert.deepEqual(blend.recipe.toppings,[...blend.recipe.toppings].sort());}
 const base={tea:'Matcha',teaAmount:60,milk:'Oat milk',milkAmount:40,ice:'Light ice',sweetness:'25%',toppings:['Tapioca pearls','Lychee jelly']};
 const examples=[{...base,name:'One'},{...base,name:'Another name',toppings:[...base.toppings].reverse()},{...base,name:'Different proportions',teaAmount:70,milkAmount:30}];
 const query=`WITH samples AS (SELECT value AS recipe FROM jsonb_array_elements($1::jsonb)), normalized AS (${normalizedBlendsSql.replace('FROM orders','FROM samples')}) SELECT COUNT(DISTINCT blend)::int AS combinations FROM normalized`;
 const result=await db().query(query,[JSON.stringify(examples)]);
 assert.equal(result[0].combinations,2,'Names and topping order must not split the same blend; proportions must distinguish blends.');
 const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');const InsightView=require(path.resolve(__dirname,'../components/drink-insights.tsx')).default;const html=renderToStaticMarkup(React.createElement(InsightView,{data}));assert.ok(html.includes('Popular combinations'));assert.ok(!/Estimated order value|Order code|\$[0-9]/.test(html));const empty=renderToStaticMarkup(React.createElement(InsightView,{data:{sampleCount:0,uniqueBlends:0,savedDrinks:0,teas:[],milks:[],toppings:[],ice:[],sweetness:[],blends:[]}}));assert.ok(empty.includes('Finished drink cards'));assert.ok(!empty.includes('NaN'));console.log('Verified live ingredient queries, normalized combinations, and populated/empty dashboard rendering.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
