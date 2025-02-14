import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import Redis from 'ioredis';

const redisClients: Map<string, Redis> = new Map();
const channelSubscribers: Map<string, Set<WebSocket>> = new Map();

const app = express();
const httpserver = app.listen(8080,()=>{
  console.log('Server is started at 8080');
  console.log(
    "nodejs running at http://localhost:8080"
  );
});

const wss = new WebSocketServer({ server : httpserver });

wss.on('connection', (ws)=> {
    console.log('New Websockts is Initialized');
    ws.on('error',(err : any)=>{
      console.log(err)
    })

    ws.on('message',(message : string)=>{
      const data = JSON.parse(message);

      if(data.action === 'subscribe' && typeof data.channel === 'string'){
        const channel = data.channel;

        if(!redisClients.has(channel)){
          const redisClient = new Redis();
          redisClients.set(channel,redisClient);

          redisClient.subscribe(channel,(err : any)=>{
              if(err){
                console.log(err);
                ws.send(JSON.stringify({error : `Failed to subscribe to Redis${channel}:`,err}))
              } else {
                console.log(`Subscribed to Redis channel: ${channel}`);
              }
          })

          redisClient.on('message',(chan,error)=>{
            if(channelSubscribers.has(chan)){
              
            }
          })
        }
      }
    }
})

