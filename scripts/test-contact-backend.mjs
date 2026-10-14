import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try {
 const {handleInquiry,default:worker}=await server.ssrLoadModule('/workers/contact.ts');
 const valid={name:'Test Visitor',email:'visitor@example.com',business:'Example Company',project:'website',budget:'$300 launch offer',details:'A fictional inquiry for automated delivery validation.',preferred:'Email',website:'',turnstileToken:'mock-token'};
 const messages=[];
 const env=()=>({EMAIL:{send:async message=>{messages.push(message);return {messageId:'mock-id'};}},TURNSTILE_SECRET:'mock-secret',IP_LIMIT:{limit:async()=>({success:true})},SEND_LIMIT:{limit:async()=>({success:true})}});
 const request=(data=valid,headers={},method='POST')=>new Request('https://veyro350.com/api/inquiry',{method,headers:{Origin:'https://veyro350.com','Content-Type':'application/json',...headers},...(method==='POST'?{body:typeof data==='string'?data:JSON.stringify(data)}:{})});
 const verify=async()=>Response.json({success:true,action:'inquiry',hostname:'veyro350.com'});
 let checks=0;
 async function status(req,expected,state=env(),validator=verify){const r=await handleInquiry(req,state,validator);assert.equal(r.status,expected);assert.equal((await r.json()).ok,expected===200);checks++;}
 await status(request(),200);assert.equal(messages[0].to,'veyro350@gmail.com');assert.equal(messages[0].replyTo,'visitor@example.com');assert.equal(messages[0].from,'hello@veyro350.com');
 const initialCount=messages.length;
 await status(request(valid,{Origin:'https://attacker.example'}),403);
 await status(request(valid,{},'GET'),405);
 await status(request(valid,{'Content-Type':'text/plain'}),415);
 await status(request('{bad'),400);
 await status(request({...valid,details:'x'.repeat(25000)}),413);
 await status(request({...valid,email:'visitor@example.com\r\nBcc: victim@example.com'}),400);
 await status(request({...valid,website:'spam'}),400);
 await status(request({...valid,project:'unknown'}),400);
 await status(request({...valid,budget:'forged'}),400);
 await status(request({...valid,turnstileToken:''}),400);
 await status(request(),400,env(),async()=>Response.json({success:false}));
 await status(request(),400,env(),async()=>Response.json({success:true,action:'other',hostname:'veyro350.com'}));
 await status(request(),400,env(),async()=>Response.json({success:true,action:'inquiry',hostname:'attacker.example'}));
 await status(request(),429,{...env(),IP_LIMIT:{limit:async()=>({success:false})}});
 await status(request(),429,{...env(),SEND_LIMIT:{limit:async()=>({success:false})}});
 await status(request(),503,{...env(),TURNSTILE_SECRET:''});
 await status(request(),503,{...env(),EMAIL:{send:async()=>{throw Error('provider unavailable');}}});
 assert.equal(messages.length,initialCount,'Rejected requests must not send mail.');
 await status(request({...valid,to:'victim@example.com'}),200);assert.equal(messages.at(-1).to,'veyro350@gmail.com');
 assert.equal((await worker.fetch(request(valid,{},'GET'),env(),{})).status,405);
 console.log('Contact backend passed '+checks+' validation, abuse, provider-failure and delivery checks. No real email was sent.');
}finally{await server.close();}
