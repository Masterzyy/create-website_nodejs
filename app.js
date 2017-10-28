let http=require('http');

let path=require('path');

let url=require('url');

let fs=require('fs');

let db=require('./database/students.json');

let template=require('art-template');
template.defaults.extname='.html';
template.defaults.root='./views';

let app =http.createServer();


app.listen(3000,(err)=>{
    if(!err){
        console.log('legendary');
    }
})
app.on('request',(req,res)=>{
    // console.log(url.parse(req.url));
    let {pathname} =url.parse(req.url);
    let realPath=path.join('public',pathname);
    res.render=function(tpl,data){
        let html=template(tpl,data);
        res.end(html); 
    }

    switch(pathname){
        case '/':
        case '/add':
            res.render('add',{});
        break;
        case '/list':
            res.render('list', {list:db});
        break;
        case '/create':
            let {query} =url.parse(req.url,true);
            db.push(query);

            fs.writeFile('./database/students.json', JSON.stringify(db),(err)=>{
                if(!err){
                    res.writeHeader(302,{
                        'Location':'/list'
                    })
                }
                res.end();
            })
        break;
        default:
        fs.readFile(realPath,(err,data)=>{
            if(!err){
                res.end(data);
            }
        })

    }

})