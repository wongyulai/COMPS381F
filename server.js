const express = require('express');
const app = express();
const fs = require('fs');
const formidable = require('formidable');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
const mongourl = 'mongodb+srv://mahoshi:a123123@cluster0-lqb1s.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'restaurants';

app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(session({
  name: 'session',
  keys:['key1','key2'],
  maxAge: 24*60*60*1000
}));

var userNsession ="";

app.post('/createAC', (req,res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(JSON.stringify(files));
    if (fields.account) {
      var account = fields.account;
      console.log(`account = ${account}`);
    }
    if (fields.password) {
      var password = fields.password;
      console.log(`password = ${password}`);
    }
    if (fields.account.length == 0) {
      res.status(500).end("Account is needed");
    }
    if (fields.password.length == 0) {
      res.status(500).end("Password is needed");
    }
      let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
        const db = client.db(dbName);
        let new_r = {};
        new_r['account'] = account;
        new_r['password'] = password;
        createAC(db,new_r,(result) => {
          client.close();
          res.redirect(301, "/login");
      });
    });
  });
});

app.post('/uploadRes', (req,res) => {
userNsession = req.session.username;
if(userNsession == undefined){res.render("login.ejs");}else{
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(JSON.stringify(files));
    let filename = files.filetoupload.path;
    if (fields.res_name) {
      var res_name = fields.res_name;
      console.log(`res_name = ${res_name}`);
    }
    if (fields.borough) {
      var borough =  (fields.borough.length > 0) ? fields.borough : "null";
      console.log(`borough = ${borough}`);
    }
    if (fields.cuisine) {
      var cuisine = (fields.cuisine.length > 0) ? fields.cuisine : "null";
      console.log(`cuisine = ${cuisine}`);
    }
    if (fields.street) {
      var street = (fields.street.length > 0) ? fields.street : "null";
      console.log(`street = ${street}`);
    }
    if (fields.building) {
      var building = (fields.building.length > 0) ? fields.building : "null";
      console.log(`building = ${building}`);
    }
    if (fields.zipcode) {
      var zipcode = (fields.zipcode.length > 0) ? fields.zipcode : "null";
      console.log(`zipcode = ${zipcode}`);
    }
    if (fields.lon) {
      var lon = (fields.lon.length > 0) ? fields.lon : '0';
      console.log(`lon = ${lon}`);
    }
    if (fields.lat) {
      var lat = (fields.lat.length > 0) ? fields.lat : '0';
      console.log(`lat = ${lat}`);
    }
    if (files.filetoupload.type) {
      var mimetype = files.filetoupload.type;
      console.log(`mimetype = ${mimetype}`);
    }
    fs.readFile(filename, (err,data) => {
      let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
        const db = client.db(dbName);
        let new_r = {};
        new_r['res_name'] = res_name;
        new_r['cuisine'] = cuisine;
        new_r['borough'] = borough;
        new_r['street'] = street;
        new_r['building'] = building;
        new_r['zipcode'] = zipcode;
        new_r['lon'] = lon;
        new_r['lat'] = lat;
        new_r['mimetype'] = mimetype;
        new_r['image'] = new Buffer.from(data).toString('base64');
        new_r['owner'] = req.session.username;
        upload_res(db,new_r,(result) => {
          client.close();
          res.redirect(301, "/rest");
        });
      });
    });
  });
 }
});

app.post('/update', (req,res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(JSON.stringify(files));
    let filename = files.filetoupload.path;
    if (fields.owner) {
      var owner = fields.owner;
      console.log(`owner = ${owner}`);
    }
    if (fields._id) {
      var _id = fields._id;
      console.log(`_id = ${_id}`);
    }
    if (fields.res_name) {
      var res_name = fields.res_name;
      console.log(`res_name = ${res_name}`);
    }
    if (fields.borough) {
      var borough = fields.borough;
      console.log(`borough = ${borough}`);
    }
    if (fields.cuisine) {
      var cuisine = fields.cuisine;
      console.log(`cuisine = ${cuisine}`);
    }
    if (fields.street) {
      var street = fields.street;
      console.log(`street = ${street}`);
    }
    if (fields.building) {
      var building = fields.building;
      console.log(`building = ${building}`);
    }
    if (fields.zipcode) {
      var zipcode = fields.zipcode;
      console.log(`zipcode = ${zipcode}`);
    }
    if (fields.lon) {
      var lon = fields.lon;
      console.log(`lon = ${lon}`);
    }
    if (fields.lat) {
      var lat = fields.lat;
      console.log(`lat = ${lat}`);
    }
    if (files.filetoupload.type) {
      var mimetype = files.filetoupload.type;
      console.log(`mimetype = ${mimetype}`);
    }
    fs.readFile(filename, (err,data) => {
      let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
        const db = client.db(dbName);
        let new_r = {};
        new_r['_id'] = ObjectID(fields._id);
        new_r['res_name'] = res_name;
        new_r['borough'] = borough;
        new_r['cuisine'] = cuisine;
        new_r['street'] = street;
        new_r['building'] = building;
        new_r['zipcode'] = zipcode;
        new_r['lon'] = lon;
        new_r['lat'] = lat;
        new_r['owner'] = owner;
        new_r['mimetype'] = mimetype;
        new_r['image'] = new Buffer.from(data).toString('base64');
          update_res(db,new_r,new_r['_id'],(result) => {
          client.close();
          res.redirect(301, "/rest");
        });
      });
    });
  });

function update_res(db,rew,old,callback) {
    if(req.session.username == rew['owner']){
    db.collection('restaurant').replaceOne({'_id':old},rew,function(err,result) {
    assert.equal(err,null);
    console.log("update was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
 }else{
   res.redirect(301, "/rest");
   
 }
}
});


app.get('/rate', function(req,res) {
console.log(req.session.username);
userNsession = req.session.username;
if(userNsession == undefined){res.redirect(301, "/login");}else{
    var client = new MongoClient(mongourl);
  client.connect((err) => {
    try {
      assert.equal(err,null);
    } catch (err) {
      res.status(500).end("MongoClient connect() failed!");
    }
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    var criteria = {};
    criteria['_id'] = ObjectID(req.query._id);
    findRes(db,criteria,(rest) => {
      client.close();
      console.log('Disconnected MongoDB');
      res.render("rate.ejs",{rest:rest});
    });
  });
}
});

app.post('/rate', (req,res) => {
console.log(req.session.username);
userNsession = req.session.username;
if(userNsession == undefined){res.redirect(301, "/login");}else{
 var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
     console.log(JSON.stringify(files));
  if (fields.rate) {
      var rate = fields.rate;
      console.log(`rate = ${rate}`);
    }

  var client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
        const db = client.db(dbName);
        var new_r = {};
        new_r['_id'] = ObjectID(fields._id);
        new_r['owner'] = req.session.username;
        new_r['rate'] = rate;
        findOwner(db,userNsession,new_r['_id'],(result) => {
       if(result == null){
        insertRate(db,userNsession,new_r,new_r['_id'],(result) => {
          client.close();
        console.log('Rated');
    var redirLink = "/display?_id="+new_r['_id'];
    res.redirect(301, redirLink);
           });
          }
        else{
             client.close();
             console.log('Rate error');
        var redirLink = "/display?_id="+new_r['_id'];
        res.redirect(301, redirLink);
           }
      });
    });
  });
function insertRate(db,sessionuserid,r,id,callback) {
  db.collection('restaurant').updateOne({'_id':id},{$push:{Rate:{owner:sessionuserid,score:r.rate}}},function(err,result) {
    assert.equal(err,null);
    console.log("Rated");
callback(result);
    });

  }

function findOwner(db,sessionuserid,id,callback) {
  db.collection('restaurant').findOne({$and:[{_id:id},{Rate:{$elemMatch:{owner: sessionuserid}}}]},function(err,result) {
    assert.equal(err,null);
    console.log("Rated before");
    console.log(result);
callback(result);
    });

 }

}
});

app.get('/login', function(req,res) {
  res.render('login.ejs');
});

app.post('/login', (req,res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(JSON.stringify(files));
    if (fields.account) {
      var account = fields.account;
      console.log(`account = ${account}`);
    }
    if (fields.password) {
      var password = fields.password;
      console.log(`password = ${password}`);
    }
    if (fields.account.length == 0) {
      res.status(500).end("Account is needed");
    }
    if (fields.password.length == 0) {
      res.status(500).end("Password is needed");
    }
      let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
        const db = client.db(dbName);
        let new_r = {};
        new_r['account'] = account;
        new_r['password'] = password;
        login_l(db,new_r,(result) => {
          client.close();
  req.session.username = account;
          res.redirect(301,'/rest');
      });
    });
  });
  
function login_l(db,r,callback) {
  db.collection('accounts').findOne(r,function(err,result) {
    console.log('----------------------');
    console.log(r);
    console.log('----------------------');
    assert.equal(err,null);
    console.log("successful!");
    console.log(JSON.stringify(result));
    if(JSON.stringify(result) == "null"){res.redirect(301, "/login");}
    else{callback(result);}
  });
 }
});

app.get('/rest', (req,res) => {
userNsession = req.session.username;
if(userNsession == undefined){res.render("login.ejs");}else{
  var client = new MongoClient(mongourl);
  client.connect((err) => {
    try {
      assert.equal(err,null);
    } catch (err) {
      res.status(500).end("MongoClient connect() failed!");
    }
    console.log('Connected to MongoDB');
  console.log('=----------------------');
  console.log(userNsession);
  console.log('=----------------------');
    const db = client.db(dbName);
    findRes(db,{},(rest) => {
      client.close();
      console.log('Disconnected MongoDB');
      res.render("list_res.ejs",{rest:rest});
    });
  });
 }
});

app.get('/delete', (req,res) => {
  var client = new MongoClient(mongourl);
    client.connect((err) => {
    try {
      assert.equal(err,null);
    } catch (err) {
      res.status(500).end("MongoClient connect() failed!");
    }
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    var criteria = {};
    criteria['_id'] = ObjectID(req.query._id);
    findRes(db,criteria,(rest) => {
      client.close();
      console.log('Disconnected MongoDB');
      res.render("delete.ejs",{rest:rest});
    });
  });
});

app.get('/find', (req,res) => {
userNsession = req.session.username;
if(userNsession == undefined){res.render("login.ejs");}else{
  var client = new MongoClient(mongourl);
  client.connect((err) => {
    try {
      assert.equal(err,null);
    } catch (err) {
      res.status(500).end("MongoClient connect() failed!");
    }
    var new_r = {};
    key = req.query.key;
    if(key == "name"){key = "res_name";}
    find_value = req.query.find_value; 
    new_r[key] = find_value;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    findq(db,new_r,(rest) => {
      client.close();
      console.log('Disconnected MongoDB');
    res.render("list_res.ejs",{rest:rest});
    });
   });
 }
});
const findq = (db,criteria,callback) => {
  const cursor = db.collection("restaurant").find(criteria);
  console.log("RestName: "+criteria["res_name"]+" Borough: "+criteria["borough"]+" Cuisine: "+criteria["cuisine"]+" Owner: "+criteria["owner"]);
  var rest = [];
  cursor.forEach((doc) => {
    rest.push(doc);
  }, (err) => {
    assert.equal(err,null);
    callback(rest);
  })
}

app.get('/display', (req,res) => {
  let client = new MongoClient(mongourl);
  client.connect((err) => {
    try {
      assert.equal(err,null);
    } catch (err) {
      res.status(500).end("MongoClient connect() failed!");
    }      
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    let criteria = {};
    criteria['_id'] = ObjectID(req.query._id);
    findRes(db,criteria,(rest) => {
      client.close();
      console.log('Disconnected MongoDB');
      console.log('Restaurant returned = ' + rest.length);
      let image = new Buffer(rest[0].image,'base64');     
      console.log(rest[0].mimetype);
      if (rest[0].mimetype.match(/^image/)) {
        res.render('restaurant_detail.ejs',{rest:rest});
      } else {
        res.render('restaurant_detail.ejs',{rest:rest});
      }
    });
  });
});

app.post('/delete', (req,res) => {
  userNsession = req.session.username;
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    console.log(JSON.stringify(files));
    if (fields._id) {
      var _id = fields._id;
      console.log(`_id = ${_id}`);
    }
    if (fields.owner) {
      var owner = fields.owner;
      console.log(`owner = ${owner}`);
    }
      let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
        const db = client.db(dbName);
        let new_r = {};
        new_r['_id'] = ObjectID(fields._id);
        if(userNsession == owner){
           console.log(owner);
          deleteRes(db,new_r,(rest) => {
      client.close();
      console.log('Disconnected MongoDB');
      res.redirect(301, "/rest");
        });
 }else{
   res.redirect(301, "/rest");
  }
      });
  });

function update_res(db,rew,old,callback) {
    if(req.session.username == rew['owner']){
    db.collection('restaurant').replaceOne({'_id':old},rew,function(err,result) {
    assert.equal(err,null);
    console.log("update was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
 }
}
});

app.get('/update', function(req,res) {
  var client = new MongoClient(mongourl);
    client.connect((err) => {
    try {
      assert.equal(err,null);
    } catch (err) {
      res.status(500).end("MongoClient connect() failed!");
    }
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    var criteria = {};
    criteria['_id'] = ObjectID(req.query._id);
    findRes(db,criteria,(rest) => {
      client.close();
      console.log('Disconnected MongoDB');
      res.render("update.ejs",{rest:rest});
    });
  });
});

app.get("/map", (req,res) => {
userNsession = req.session.username;
if(userNsession == undefined){res.render("login.ejs");}else{
    res.render("map.ejs", {
        lat:req.query.lat,
        lon:req.query.lon,
        zoom:15
    });
    res.end();
  }
});

app.get('/', function(req,res) {
  res.render('login.ejs');
});

app.get('/createAC', function(req,res) {
  res.render('createAC.ejs');
});

app.get('/uploadRes', function(req,res) {
  res.render('uploadRes.ejs');
});

function createAC(db,r,callback) {
  db.collection('accounts').insertOne(r,function(err,result) {
    assert.equal(err,null);
    console.log("create was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
}

function upload_res(db,r,callback) {
  db.collection('restaurant').insertOne(r,function(err,result) {
    assert.equal(err,null);
    console.log("create was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
}

const findRes = (db,criteria,callback) => {
  console.log(criteria);
  console.log('----------------------');
  const cursor = db.collection('restaurant').find(criteria);
  var rest = [];
  cursor.forEach((doc) => {
    rest.push(doc);
  }, (err) => {
    assert.equal(err,null);
    callback(rest);
  })
}
 
const deleteRes = (db,criteria,callback) => {
  console.log(criteria);
  db.collection('restaurant').deleteOne(criteria,function(err,result) {
    assert.equal(err,null);
    console.log("delete was successful!");
    console.log(JSON.stringify(result));
    callback(result);
  });
 }

app.get('/logout', function(req,res,next) {
req.session = null;
res.redirect(301, "/login");
});

app.post('/api/restaurant', function(req,res) {
      let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
        const db = client.db(dbName);
        let new_r = {};
        new_r['res_name'] = req.body.res_name;
        new_r['cuisine'] = req.body.cuisine;
        new_r['borough'] = req.body.borough;
        new_r['street'] = req.body.street;
        new_r['building'] = req.body.building;
        new_r['zipcode'] = req.body.zipcode;
        new_r['lon'] = req.body.lon;
        new_r['lat'] = req.body.lat;
        new_r['image'] = "N/A";
        new_r['mimetype'] = "image/jpeg";
        new_r['owner'] = req.body.owner;
        upload_res(db,new_r,(result) => {
          client.close();
          res.status(200).type('json').json(result).end();
      });
   });
});

app.get('/api/restaurant/name/:res_name', function(req,res) {
  let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
  const db = client.db(dbName); 
  findRes(db,{},(result) => {
      client.close();
      console.log('Disconnected MongoDB');
      let results = result.filter((result) => {
            return result.res_name == req.params.res_name;
          });
      res.status(200).type('json').json(results).end();
    });
  });
});

app.get('/api/restaurant/borough/:borough', function(req,res) {
  let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
  const db = client.db(dbName); 
  findRes(db,{},(result) => {
      client.close();
      console.log('Disconnected MongoDB');
      let results = result.filter((result) => {
            return result.borough == req.params.borough;
          });
      res.status(200).type('json').json(results).end();
    });
  });
});

app.get('/api/restaurant/cuisine/:cuisine', function(req,res) {
  let client = new MongoClient(mongourl);
      client.connect((err) => {
        try {
          assert.equal(err,null);
        } catch (err) {
          res.status(500).end("MongoClient connect() failed!");
        }
  const db = client.db(dbName); 
 findRes(db,{},(result) => {
      client.close();
      console.log('Disconnected MongoDB');
      let results = result.filter((result) => {
            return result.cuisine == req.params.cuisine;
          });
      res.status(200).type('json').json(results).end();
    });
  });
});

app.listen(process.env.PORT || 8099);
