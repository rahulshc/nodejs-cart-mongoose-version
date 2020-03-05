//const http = require('http');
const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const app = express();
app.set('view engine', 'ejs');
//app.set('views', 'views');//shall be required if the views folder is not named as "views"
//const adminRoutes=require('./routes/admin');//works for module.exports
const adminRoutes=require('./routes/admin');//
const shopRoutes = require('./routes/shop');
const errorController=require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
//between creating app and creatig server we can add middlewares


/*app.use('/', (req, res, next)=>{
    console.log('This always runs');
    next();
});*/

//bodyparser.urlencoded internally calls the next
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));//makes the public folder statically available to front end

app.use((req, res, next) => {
    User.findById('5e5e8bb61c9d44000012950f')
    .then(user=> {
        req.user=new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err=> console.log(err));
});
//can use multipe static folders
//order of admin routes and shop routes matters here if we used app.use in admin and shop routes
app.use('/admin',adminRoutes);//appendes all admin routes with/admin
app.use(shopRoutes);

/*db.execute('select * from products')
.then(result=>{
    console.log(result);
})
.catch(err =>{
    console.log(err)
});*/

//handling all unknown routes because route next funnels from top to bottom

app.use(errorController.get404);



//between creating app and creatig server we can add middlewares
/*const server = http.createServer(app);

server.listen(3000);*/

mongoConnect(()=> {
    //console.log(client);
    app.listen(3000);
});


