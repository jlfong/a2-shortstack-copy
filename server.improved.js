const http = require('http'),
    fs = require('fs'),
    mime = require('mime'),
    express = require('express'),
    app = express(),
    session   = require( 'express-session' ),
    passport  = require( 'passport' ),
    Local     = require( 'passport-local' ).Strategy,
    bodyParser= require( 'body-parser' ),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),

    dir = 'public/',
    port = 3000

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low( adapter )

const appdata = [
    {'user': 'janette', 'firstName': 'Janette', 'lastName': 'Fong', 'pronouns': 'She/Her/Hers', 'values': 'ambition', 'house': 'Slytherin'},
    {'user': 'winny', 'firstName': 'Winny', 'lastName': 'Cheng', 'pronouns': 'She/Her/Hers', 'values': 'wisdom', 'house': 'Ravenclaw'},
    {'user': 'janette', 'firstName': 'Jose', 'lastName': 'Li Quiel', 'pronouns': 'He/Him/His', 'values': 'loyalty', 'house': 'Hufflepuff'},
    {'user': 'winny', 'firstName': 'Harry', 'lastName': 'Potter', 'pronouns': 'He/Him/His', 'values': 'bravery', 'house': 'Gryffindor'},
]

const users = [
  {username: 'janette', password: 'janette1'},
  {username: 'winny', password: 'winny1'}
]

db.defaults({ appdata: appdata, users: users }).write()

app.use( express.static(dir) )
app.use(helmet())
app.use(passport.initialize())
app.use( bodyParser.json() )
app.use(cookieParser())

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
})

const myLocalStrategy = function( username, password, done ) {
  const user = db.get('users').value().find( __user => __user.username === username )
  if( user === undefined ) {
    return done( null, false, { message:'user not found' })
  }
  else if( user.password === password ) {
    return done( null, { username, password })
  }
  else{
    return done( null, false, { message: 'incorrect password' })
  }
}

passport.use( 'local-login', new Local( myLocalStrategy ) )

passport.initialize()

app.post('/login',
    passport.authenticate('local-login', {}),
    function (req, res) {
        console.log('login works')
        res.redirect('/');
    }
);

passport.serializeUser( ( user, done ) => done( null, user.username ) )

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
        newData = db.get('appdata['+index+']').value()
  console.log(newData.house)
  db.get('appdata').find(newData).assign({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    pronouns: req.body.pronouns,
    house: req.body.house
  }).write()
  res.status(200).send("updated")
})

app.post('/delete', function(req, res) {
    const index = req.body.rowData,
    todelete = db.get('appdata['+index+']').value()
    db.get('appdata').remove(todelete).write();
  res.status(200).send("deleted")
})

app.listen( process.env.PORT || port )