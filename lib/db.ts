import { neon } from '@neondatabase/serverless';
export function db(){return neon(process.env.DATABASE_URL!);}
export async function session(){const {getAuth}=await import('./auth');const {data}=await getAuth().getSession();return data?.user;}
export async function isAdmin(userId:string,email:string,emailVerified:boolean){const rows=await db()`SELECT user_id FROM admins WHERE user_id=${userId} UNION ALL SELECT email FROM admin_emails WHERE email=${email.toLowerCase()} AND ${emailVerified} LIMIT 1`;return rows.length>0;}
