const http=require("http");
const fs=require("fs");

var requests = require("requests");

const homefile = fs.readFileSync("Home.html","utf-8");
const port =process.env.PORT || 8123;
const replaceVal=(tempval,orgVal)=>{
  let temperture=tempval.replace("{%tempval%}",(orgVal.main.temp-273.15).toFixed(1));
  temperture=temperture.replace("{%tempmin%}",(orgVal.main.temp_min-273.15).toFixed(1));
  temperture=temperture.replace("{%tempmax%}",(orgVal.main.temp_max-273.15).toFixed(1));
  temperture=temperture.replace("{%location%}",orgVal.name);
  temperture=temperture.replace("{%country%}",orgVal.sys.country);
 temperture=temperture.replace("{%tempstatus%}",orgVal.weather[0].main);
  return temperture;

}

const server=http.createServer((req,res)=>{
   if(req.url=="/"){
    requests("http://api.openweathermap.org/data/2.5/weather?q=Yamunanagar&appid=c8b096443209a4723335d1abb60308ee" 
    )
    .on('data', function (chunk) {
        const obj=JSON.parse(chunk);
        const arrData=[obj];
     //console.log(arrData);
     const realTimeData=arrData.map((val)=>replaceVal(homefile,val)).join("");
     res.write(realTimeData);
     //console.log(realTimeData);
    })
    .on('end', function (err) {
      if (err) return console.log('connection closed due to errors', err);
     
      res.end();
    });
   }
});

server.listen(port,()=>{
  console.log(`${port}`);
});