import { session,isAdmin } from '@/lib/db';
import { getInsights } from '@/lib/insights';
export async function GET(){
 try{
  const user=await session();
  if(!user)return Response.json({error:'Sign in with an admin account to view drink trends.'},{status:401});
  if(!await isAdmin(user.id,user.email,Boolean(user.emailVerified)))return Response.json({error:'This account does not have dashboard access.'},{status:403});
  return Response.json(await getInsights());
 }catch{return Response.json({error:'Drink trends are temporarily unavailable.'},{status:503});}
}
