const h=require('http'),f=require('fs'),p=require('path');
const d='D:\\Projects\\dispatch\\landing';
h.createServer((q,r)=>{
  let u=q.url==='/'?'/index.html':q.url;
  let s=p.join(d,u);
  try{r.end(f.readFileSync(s))}catch{
    r.writeHead(404);r.end('not found');
  }
}).listen(5000,'0.0.0.0',()=>console.log('running'));
