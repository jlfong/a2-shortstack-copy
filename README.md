Assignment 3 - Persistence: Two-tier Web Application with Flat File Database, Express server, and CSS template
===
---

## Create a Harry Potter Character (Version 2)
Janette Fong
[https://a3-jlfong.glitch.me/](https://a3-jlfong.glitch.me/)

The user can create their own Harry Potter character by filling out the form.  Once they submitted their information, a table with current added characters is displayed.
Depending on what they answered for the survey question, their character will be sorted into one of the Hogwarts Houses (Gryffindor, Hufflepuff, Ravenclaw, Slytherin).

## Requirements Met
- Server (with Express)
- Results (table for an associated user)
- Form/Entry to add, edit, and delete data for an associated user
- HTML input tags (input, radio buttons, password, etc)
- Passport local middleware authentication
- Persistent data storage (lowdb)
- CSS framework ([Wing](https://kbrsh.github.io/wing/))
- Javascript
- At least five middleware (express, express.static, passport, body-parser, cookie-parser, helmet)

The goal of this application is to host a service where users can log into the website and create, edit, and delete their own set of Harry Potter characters.
New users can create an account.  Some challenges I faced in this assignment was getting the Passport local authentication to work.  I chose to use the 
Passport local authentication and lowdb database because those were two topics discussed in class.  I decided to use the Wing CSS framework because its framework
is meant to have a minimalist look and I liked the look of the Wing CSS framework on my application.  I didn't overwrite the components from the framework but I
added more styling I wanted in my style.css file.

The middleware packages I used were: express, express.static, passport, body-parser, cookie-parser, helmet:
- Express is a middleware and routing web framework that has minimal functionality.  It listens for requests and calls the appropriate functions.
- Express.static serves static files from the path where your application is drawing files from.
- Passport authenticates requests (for logging in, for example) through strategies.  I used the Local strategy since it was discussed in class.
- Body-parser parses incoming request bodies before those requests are handled.
- Cookie-parser parses cookie headers and populates cookies.
- Helmet helps secure the application by setting various HTTP headers.

## Technical Achievements
- **Logout Functionality**: The user has an option to log out to return to the home page.
- **Error Checking**: The login form has error checking to ensure that users fill out the login form completely before logging in.  The registration form has
error checking to ensure that the username is not already in the database, passwords match, and the form is filled out completely.
- **Used more than 5 middleware packages**: As detailed above, I used more than five middleware packages.

### Design/Evaluation Achievements
- **Animated Title Text**: For the home page, I wanted to add an animation to make the website less boring.  I referenced this moving letters library [here](https://tobiasahlin.com/moving-letters/)
- **Set background image**: In the last version, I used a plain background.  I decided to set the background of the application to an image to make it more aesthically pleasing.