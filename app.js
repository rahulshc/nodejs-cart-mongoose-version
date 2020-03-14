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
const csrf=require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const app = express();

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();
const fileStorage= multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype=== 'image/png' || file.mimetype=== 'image/jpg' || file.mimetype=== 'image/jpeg')
    {
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}
app.use(flash());
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));//single for handling single file, image is the name of the identifier in front end
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));//we can also set cookie here
app.use(csrfProtection);

app.use((req,res,next)=> {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
//can use multipe static folders
//order of admin routes and shop routes matters here if we used app.use in admin and shop routes
app.use((req,res,next)=> {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user=> {
        if(!user){
            return next();
        }
        req.user=user;
        next();
    })
    .catch(err=>{
        throw new Error(err);
    });
});


app.use('/admin',adminRoutes);//appendes all admin routes with/admin
app.use(shopRoutes);
app.use(authRoutes);

//handling all unknown routes because route next funnels from top to bottom
app.get('/500', errorController.get500);//for handling error which gets redirected to /500

//404 is for handling unknown routes
app.use(errorController.get404);

//error handling middleware
app.use((error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
      });
//or can also be like res.redirect('/500) however 
//for api driven approach res.status(error.httpStatusCode).render() 
});

mongoose.connect(process.env.MONGODB_URI)
.then(result=> {
    app.listen(3000);
}).catch(err=> console.log(err));


