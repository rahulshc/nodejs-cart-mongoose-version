//const http = require('http');
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session = require('express-session');
const path=require('path');
const app = express();
app.set('view engine', 'ejs');
//app.set('views', 'views');//shall be required if the views folder is not named as "views"
//const adminRoutes=require('./routes/admin');//works for module.exports
const adminRoutes=require('./routes/admin');//
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController=require('./controllers/error');
const User = require('./models/user');
//between creating app and creatig server we can add middlewares


/*app.use('/', (req, res, next)=>{
    console.log('This always runs');
    next();
});*/

//bodyparser.urlencoded internally calls the next
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));//makes the public folder statically available to front end
//app.use(session({secret: 'my secret', resave: false, saveUninitialized}))
app.use((req, res, next) => {
    User.findById('5e6526098e5877236ddae237')
    .then(user=> {
        req.user=user;
        next();
    })
    .catch(err=> console.log(err));
});
//can use multipe static folders
//order of admin routes and shop routes matters here if we used app.use in admin and shop routes
app.use('/admin',adminRoutes);//appendes all admin routes with/admin
app.use(shopRoutes);
app.use(authRoutes);

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

/*mongoConnect(()=> {
    //console.log(client);
    app.listen(3000);
});*/

mongoose.connect(process.env.MONGODB_URI)
.then(result=> {
    User.findOne().then(user=> {
        if(!user){
            const user = new User({
                name: 'Rahul',
                email: 'test@test.com',
                cart: {
                    items: []
                }
            });
            return user.save(); 
        }
    })
    
})
.then(result=> {
    app.listen(3000);
}).catch(err=> console.log(err));


