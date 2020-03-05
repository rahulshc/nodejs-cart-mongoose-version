const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
    MongoClient.connect(process.env.MONGODB_URI)
.then(client=> {
    //console.log('Connected!');
    _db=client.db();//to connect to a different database we have to pass option to db like db('qms')
    callback();
})
.catch(err=> {
    console.log(err);
    throw err;
});
}

//connection pool otherwise we shall have to connect using connection string again and again
const getDb = () => {
    if(_db){
        return _db;
    }

    throw 'No Database Found!';
}

//module.exports=mongoConnect;
exports.mongoConnect=mongoConnect;
exports.getDb=getDb;

