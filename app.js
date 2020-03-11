const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session = require('express-session');
const path=require('path');
const adminRoutes=require('./routes/admin');//
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController=require('./controllers/error');
const User = require('./models/user');
const MongoDBStore=require('connect-mongodb-session')(session);
const app = express();

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));//we can also set cookie here
/*app.use((req, res, next) => {
    User.findById('5e6526098e5877236ddae237')
    .then(user=> {
        req.user=user;
        next();
    })
    .catch(err=> console.log(err));
});*/
//can use multipe static folders
//order of admin routes and shop routes matters here if we used app.use in admin and shop routes
app.use((req,res,next)=> {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=> {
        req.user=user;
        next();
    })
    .catch(err=>console.log(err));
});
app.use('/admin',adminRoutes);//appendes all admin routes with/admin
app.use(shopRoutes);
app.use(authRoutes);

//handling all unknown routes because route next funnels from top to bottom

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URI)
.then(result=> {
    app.listen(3000);
}).catch(err=> console.log(err));


