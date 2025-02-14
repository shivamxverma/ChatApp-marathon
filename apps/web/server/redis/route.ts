import Redis from "ioredis";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const client = new Redis();

async function post(request : NextRequest , response : NextResponse){
   const body = await request.json();
   const msg : string = body.message;
   await client.lpush('messages',msg);

   return NextResponse.json({msg:"yeah i have send the data"});
}
async function get(request : NextRequest , response : NextResponse){
  await client.get('messages');
} 

export { post, get };