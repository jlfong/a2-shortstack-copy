const http = require('http'),
    fs = require('fs'),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library used in the following line of code
    mime = require('mime'),
    express = require('express'),
    app = express(),
    session   = require( 'express-session' ),
    passport  = require( 'passport' ),
    Local     = require( 'passport-local' ).Strategy,
    bodyParser= require( 'body-parser' ),

    dir = 'public/',
    port = 3000

app.use( express.static(dir) )
app.use( bodyParser.json() )

const users = [
  {username: 'janette', password: 'janette1'},
  {username: 'winny', password: 'winny1'}
]

// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
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

/*app.post( '/login', passport.authenticate( 'local' ), function( req, res ) {
  console.log('in login method')
    var data = req.body
    console.log(data)
    //console.log( 'user:', req.username )
    res.json({ status:true })
  }
)*/

app.post('/login',
    passport.authenticate('local-login', {
        // redirect back to /login
        // if login fails
        failureRedirect: '/login'
    }),
 
    // end up at / if login works
    function (req, res) {
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
  res.send(appdata);
});

app.post('/submit', function(req, res) {
  console.log(req)
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
    appdata.push(data);
    res.status(200).send("Successfully posted ingredient");
});

app.post('/update', function(req, res) {
  var data = req.body
  let index = data.index
  appdata[index].firstName = data.firstName
  appdata[index].lastName = data.lastName
  appdata[index].house = data.house
  res.status(200).send("updated")
})

app.post('/delete', function(req, res) {
  var data = req.body
  appdata.splice(data.rowData, 1)
  res.status(200).send("deleted")
})

app.listen( process.env.PORT || port )

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


const server = http.createServer(function (request, response) {
    if (request.method === 'GET') {
        handleGet(request, response)
    } else if (request.method === 'POST') {
        handlePost(request, response)
    }
})


const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1)

    if (request.url === '/') {
        sendFile(response, 'public/index.html')
    } else if (request.url === '/studentData') {
        sendData(response, appdata)
    } else {
        sendFile(response, filename)
    }
}

const handlePost = function (request, response) {
    let dataString = ''

    request.on('data', function (data) {
        dataString += data
    })

    request.on('end', function () {

            const data = JSON.parse(dataString)


            switch (request.url) {

                case '/submit':
                    //server logic
                    let sortedHouse;
                    switch (data.values) {
                        case 'bravery':
                            sortedHouse = 'Gryffindor'
                            break
                        case 'loyalty':
                            sortedHouse = 'Hufflepuff'
                            break
                        case 'wisdom':
                            sortedHouse = 'Ravenclaw'
                            break
                        case 'ambition':
                            sortedHouse = 'Slytherin'
                            break
                        default:
                            sortedHouse = 'Muggle'
                    }

                    const newStudent = {
                        'firstName': data.firstName,
                        'lastName': data.lastName,
                        'pronouns': data.pronouns,
                        'values': data.values,
                        'house': sortedHouse
                    }

                    appdata.push(newStudent)

                    console.log(appdata)

                    response.writeHead(200, "OK", {'Content-Type': 'text/plain'})
                    response.end()
                    break

                case '/delete':
                    appdata.splice(data.rowData, 1)
                    response.writeHead(200, "OK", {'Content-Type': 'text/plain'})
                    response.end()
                    break

                case '/update':
                    let index = data.index
                    appdata[index].firstName = data.firstName
                    appdata[index].lastName = data.lastName
                    appdata[index].pronouns = data.pronouns
                    appdata[index].house = data.house
                    response.writeHead(200, "OK", {'Content-Type': 'text/plain'})
                    response.end()
                    break

                default:
                    response.end('404 Error: File Not Found')
            }


        }
    )
}

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
