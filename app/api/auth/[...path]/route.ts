import { getAuth } from '@/lib/auth';
type Context={params:Promise<{path:string[]}>};
export async function GET(req:Request,context:Context){return getAuth().handler().GET(req,context);}
export async function POST(req:Request,context:Context){return getAuth().handler().POST(req,context);}
