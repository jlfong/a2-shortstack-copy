const http = require('http'),
    fs = require('fs'),
    mime = require('mime'),
    express = require('express'),
    app = express(),
    session   = require( 'express-session' ),
    passport  = require( 'passport' ),
    Local     = require( 'passport-local' ).Strategy,
    bodyParser= require( 'body-parser' ),

    dir = 'public/',
    port = 3000

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db1.json')
const db = low( adapter )

const appdata = [
    {
        'firstName': 'Janette',
        'lastName': 'Fong',
        'pronouns': 'She/Her/Hers',
        'values': 'ambition',
        'house': 'Slytherin'
    },
    {'firstName': 'Winny', 'lastName': 'Cheng', 'pronouns': 'She/Her/Hers', 'values': 'wisdom', 'house': 'Ravenclaw'},
    {'firstName': 'Jose', 'lastName': 'Li Quiel', 'pronouns': 'He/Him/His', 'values': 'loyalty', 'house': 'Hufflepuff'},
    {'firstName': 'Harry', 'lastName': 'Potter', 'pronouns': 'He/Him/His', 'values': 'bravery', 'house': 'Gryffindor'},
]

const users = [
  {username: 'janette', password: 'janette1'},
  {username: 'winny', password: 'winny1'}
]

db.defaults({ appdata: appdata, users: users }).write()


app.use( express.static(dir) )
app.use(passport.initialize())
app.use( bodyParser.json() )

// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
  console.log('local strategy')
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  const user = users.find( __user => __user.username === username )
  
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    return done( null, false, { message:'user not found' })
  }else if( user.password === password ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
    return done( null, false, { message: 'incorrect password' })
  }
}

passport.use( 'local-login', new Local( myLocalStrategy ) )

passport.initialize()

app.post('/login',
    passport.authenticate('local-login', {
        // redirect back to /login
        // if login fails
        //failureRedirect: '/error'
    }),
 
    // end up at / if login works
    function (req, res) {
        console.log('login works')
        res.redirect('/');
    }
);

passport.serializeUser( ( user, done ) => done( null, user.username ) )

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = users.find( u => u.username === username )
  console.log( 'deserializing:', name )
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})

app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )
app.use( passport.initialize() )
app.use( passport.session() )

app.post('/test', function( req, res ) {
  console.log( 'authenticate with cookie?', req.user )
  res.json({ status:'success' })
})

app.get('/studentData', (req, res) => {
  let data = db.get('appdata').value()
  res.send(data)
});

app.get('/register', (req, res) => {
  let data = db.get('users').value()
  res.send(data)
})

app.post('/register', (req, res) => {
  var data = req.body
  db.get('users').push(data).write()
  res.status(200).send("Added user to database")
})

app.post('/submit', function(req, res) {
    var data = req.body;
    switch (data.values) {
      case 'bravery':
          data.house = 'Gryffindor'
          break
      case 'loyalty':
          data.house = 'Hufflepuff'
          break
      case 'wisdom':
          data.house = 'Ravenclaw'
          break
      case 'ambition':
          data.house = 'Slytherin'
          break
      default:
          data.house = 'Muggle'
      }
    db.get('appdata').push(data).write()
    res.status(200).send("Successfully added new character");
});

app.post('/update', function(req, res) {
  const index = req.body.index,
        indexVal = db.get('appdata['+index+']').value()
  console.log(indexVal.house)
  db.get('appdata').find(indexVal).assign({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    pronouns: req.body.pronouns,
    house: req.body.house
  }).write()
  res.status(200).send("updated")
})

app.post('/delete', function(req, res) {
    const index = req.body.rowData,
    indexVal = db.get('appdata['+index+']').value()
    db.get('appdata').remove(indexVal).write();

  //var data = req.body
  //appdata.splice(data.rowData, 1)
  res.status(200).send("deleted")
})

app.listen( process.env.PORT || port )

const sendData = function (response, studentData) {
    response.end(JSON.stringify(studentData));
}


const sendFile = function (response, filename) {
    const type = mime.getType(filename)
    fs.readFile(filename, function (err, content) {

        // if the error = null, then we've loaded the file successfully
      if (err === null) {
        response.writeHeader(200, {'Content-Type': type})
        response.end(content)
      }
      else {
        response.writeHeader(404)
        response.end('404 Error: File Not Found')
      }
    })
}


//server.listen(process.env.PORT || port)
