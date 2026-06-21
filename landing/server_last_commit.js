const h=require('http'),f=require('fs'),p=require('path');
const d='D:\\Projects\\dispatch\\landing';
h.createServer((q,r)=>{
  let u=q.url==='/'||q.url==='/index.html'?'/index_last_commit.html':q.url;
  let s=p.join(d,u);
  try{r.end(f.readFileSync(s))}catch{
    r.writeHead(404);r.end('not found');
  }
}).listen(5000,'0.0.0.0',()=>console.log('running server from last commit on port 5000'));
