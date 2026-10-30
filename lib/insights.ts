import { db } from './db';
import type { Drink } from './drinks';

export type IngredientCount={name:string;count:number};
export type Insights={sampleCount:number;uniqueBlends:number;savedDrinks:number;teas:IngredientCount[];milks:IngredientCount[];toppings:IngredientCount[];ice:IngredientCount[];sweetness:IngredientCount[];blends:{recipe:Omit<Drink,'name'>;count:number}[]};

// Names and topping selection order do not make a different combination.
export const normalizedBlendsSql=`SELECT (recipe - 'name' - 'toppings') || jsonb_build_object('toppings', (SELECT COALESCE(jsonb_agg(value ORDER BY value),'[]'::jsonb) FROM jsonb_array_elements(recipe->'toppings') AS item(value))) AS blend FROM orders`;

export async function getInsights():Promise<Insights>{
 const sql=db();
 const [totals,saved,teas,milks,toppings,ice,sweetness,blends]=await Promise.all([
  sql.query(`WITH blends AS (${normalizedBlendsSql}) SELECT COUNT(*)::int AS samples,COUNT(DISTINCT blend)::int AS unique_blends FROM blends`),
  sql`SELECT COUNT(*)::int AS count FROM drinks`,
  sql`SELECT CASE WHEN recipe->>'tea'='Custom tea' THEN COALESCE(NULLIF(recipe->>'teaName',''),'Custom tea') ELSE recipe->>'tea' END AS name,COUNT(*)::int AS count FROM orders GROUP BY 1 ORDER BY 2 DESC,1`,
  sql`SELECT recipe->>'milk' AS name,COUNT(*)::int AS count FROM orders GROUP BY 1 ORDER BY 2 DESC,1`,
  sql`SELECT ingredient AS name,COUNT(*)::int AS count FROM orders CROSS JOIN LATERAL jsonb_array_elements_text(recipe->'toppings') ingredient GROUP BY 1 ORDER BY 2 DESC,1`,
  sql`SELECT recipe->>'ice' AS name,COUNT(*)::int AS count FROM orders GROUP BY 1 ORDER BY 2 DESC,1`,
  sql`SELECT recipe->>'sweetness' AS name,COUNT(*)::int AS count FROM orders GROUP BY 1 ORDER BY 2 DESC,1`,
  sql.query(`WITH blends AS (${normalizedBlendsSql}) SELECT blend AS recipe,COUNT(*)::int AS count FROM blends GROUP BY blend ORDER BY 2 DESC,blend::text LIMIT 6`)
 ]);
 return {sampleCount:totals[0].samples,uniqueBlends:totals[0].unique_blends,savedDrinks:saved[0].count,teas,milks,toppings,ice,sweetness,blends} as Insights;
}
