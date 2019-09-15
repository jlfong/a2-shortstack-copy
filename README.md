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
is meant to have a minimalist look and I liked the look of the Wing CSS framework on my application.

The middleware packages I used were: express, express.static, passport, body-parser, cookie-parser, helmet:
- Express is a middleware and routing web framework that has minimal functionality.  It listens for requests and calls the appropriate functions.
- Express.static serves static files from the path where your application is drawing files from.
- Passport 

## Technical Achievements
- **Colored Rows (Technical)**: Depending on which House the character is in, the row will be colored in the House's main color (Gryffindor is red, 
Hufflepuff is yellow, Ravenclaw is blue, Slytherin is green).
- **Editing the Table / Field Checking**: The user is able to edit a character's information from the table.  If their House is changed to a different Housee, the row will change its 
color to match the new House.  If the value for the new House ends up being invalid input, the table will list them as a Muggle (a regular human being with no magical talent).
If their first name, last name, or pronouns are edited to be empty, the table will list those fields as redacted.

### Design/Evaluation Achievements
- **Colored Rows (Design)**: To add on to what I stated in the technical aspect, I wanted to display the rows in these colors so the user can easily differentiate
which characters are in which Houses.
- **Table Row Hovering**: I wanted to implement a way where the user's mouse can interact with the table, so I added in an aspect when the mouse hovers over a row,
the row will highlight the text to alert the user which row their mouse is on.  (Got insipration from [here](https://codepen.io/jackrugile/pen/EyABe)).
