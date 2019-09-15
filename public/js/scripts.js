let currUser

const homeLogin = function (e) {
  e.preventDefault()
  document.getElementById('loginform').style.display = ""
  document.getElementById('homepage').style.display = "none"
}

const register = function(e) {
  e.preventDefault()
  document.getElementById('registerform').style.display = ""
  document.getElementById('homepage').style.display = "none"
}

const cancelRegister = function(e) {
  e.preventDefault()
  document.getElementById('usernameRegister').value = ""
  document.getElementById('passwordRegister').value = ""
  document.getElementById('confirmPassword').value = ""
  document.getElementById('registerform').style.display = "none"
  document.getElementById('homepage').style.display = ""
  document.getElementById('duplicateuser').style.display = "none"
  document.getElementById('duplicateuser').focus()
  document.getElementById('passwordmismatch').style.display = "none"
  document.getElementById('passwordmismatch').focus()
  document.getElementById('usernameRegister').value = ""
  document.getElementById('passwordRegister').value = ""
  document.getElementById('confirmPassword').value = ""
  document.getElementById('incompleteregister').style.display = "none"
  document.getElementById('incompleteregister').focus()
}

const confirmRegister = function(e) {
  e.preventDefault()
  const username = document.getElementById('usernameRegister').value,
        password = document.getElementById('passwordRegister').value,
        confirmPassword = document.getElementById('confirmPassword').value
  fetch('/register', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (userList) {
        registerCheck(userList, username, password, confirmPassword)
    })
}

function registerCheck(userList, username, password, confirmPassword) {
    document.getElementById('duplicateuser').style.display = "none"
    document.getElementById('duplicateuser').focus()
    document.getElementById('passwordmismatch').style.display = "none"
    document.getElementById('passwordmismatch').focus()
    document.getElementById('incompleteregister').style.display = "none"
    document.getElementById('incompleteregister').focus()
    console.log(userList)
    let emptyCheck = false
    if(username === "" || password === "" || confirmPassword === "") {
      emptyCheck = true
      document.getElementById('incompleteregister').style.display = ""
      document.getElementById('incompleteregister').focus()
    }
    if(emptyCheck === false) {
      document.getElementById('incompleteregister').style.display = "none"
      document.getElementById('incompleteregister').focus()
      let dupUserCheck = false
      for(let i = 0; i < userList.length; i++) {
        if(userList[i].username === username) {
          dupUserCheck = true
          i = userList.length
          document.getElementById('duplicateuser').style.display = ""
          document.getElementById('duplicateuser').focus()
        }
      }
      if(dupUserCheck === false) {
        document.getElementById('duplicateuser').style.display = "none"
        document.getElementById('duplicateuser').focus()
        if(password != confirmPassword) {
          document.getElementById('passwordmismatch').style.display = ""
          document.getElementById('passwordmismatch').focus()
        }
        else {
          document.getElementById('passwordmismatch').style.display = "none"
          document.getElementById('passwordmismatch').focus()
          const json = {
            'username': username,
            'password': password
          },
          body = JSON.stringify(json)
          fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body 
          }).then(function (response) {})
          document.getElementById('usernameRegister').value = ""
          document.getElementById('passwordRegister').value = ""
          document.getElementById('confirmPassword').value = ""
          document.getElementById('registerform').style.display = "none"
          document.getElementById('homepage').style.display = ""
        }
      }
    }
    
  
}

const cancelLogin = function(e) {
  e.preventDefault()
  document.getElementById('homepage').style.display = ""
  document.getElementById('loginform').style.display = "none"
  document.getElementById('loginerror').style.display = "none"
  document.getElementById('username').value = ""
  document.getElementById('password').value = ""
}

const login = function (e) {
  e.preventDefault()
  const username = document.getElementById('username').value,
        password = document.getElementById('password').value
  const user = {
    'username': username,
    'password': password
  },
  body = JSON.stringify(user)
  console.log(body)
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body
  }).then(function (response) {
    if(response.status === 200) {
      document.getElementById('loginform').style.display = "none"
      document.getElementById('loginerror').style.display = "none"
      document.getElementById('maindisplay').style.display = ""
      currUser = username
      document.getElementById('currentuser').innerText = "Hello " + currUser
      document.getElementById('usertable').innerText = currUser + "'s Characters:"
      document.getElementById('username').value = ""
      document.getElementById('password').value = ""
      showData()
    }
    else {
      document.getElementById('loginerror').style.display = ""
    }
    fetch('/register', {
      method: 'GET'
    }).then(function(response) {
      return response.json()
    }).then(function (users) {
      console.log(users)
    })
  })
}

const submit = function (e) {

    e.preventDefault()

    const firstName = document.querySelector('#firstName').value,
        lastName = document.querySelector('#lastName').value,
        pronouns = document.querySelector('input[name="studentPronouns"]:checked').value,
        mostValued = document.querySelector('input[name="studentValue"]:checked').value

    if (formComplete(firstName, lastName)) {
        let preferredPronouns;
        switch (pronouns) {
            case 'he':
                preferredPronouns = 'He/Him/His'
                break
            case 'she':
                preferredPronouns = 'She/Her/Hers'
                break
            case 'they':
                preferredPronouns = 'They/Them/Theirs'
                break
            default:
                if(document.getElementById('other').checked) {
                    preferredPronouns = document.getElementById('inputother').value
                }
        }

        const json = {
                'user': currUser,
                'firstName': firstName,
                'lastName': lastName,
                'pronouns': preferredPronouns,
                'values': mostValued
            },

            body = JSON.stringify(json)

        fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body 
        }).then(function (response) {})

        showData();
        return false
    }
}

function formComplete(studentFirstName, studentLastName) {
    if (studentFirstName === '' || studentLastName === '') {
        document.getElementById('error').style.display = "block"
        document.getElementById('error').focus()
        return false
    }
    else {
        document.getElementById('error').style.display = "none"
        document.getElementById('error').focus()
        return true
    }
}

function changeradioOther() {
    var other = document.getElementById("other");
    other.value = document.getElementById("inputother").value;
    other.checked = true
    console.log(other.value)
}

function clearOther() {
    document.getElementById("other").value = ""
    document.getElementById("inputother").value = ""
}

const updateRow = function (rowIndex) {
    let updateFirstName = document.getElementById('firstName'+rowIndex).value
    let updateLastName = document.getElementById('lastName' + rowIndex).value
    let pronouns = document.getElementById('pronouns' + rowIndex).value
    let house = document.getElementById('house' + rowIndex).value

    if(updateFirstName === '') {
        updateFirstName = '(Redacted)'
    }
    if(updateLastName === '') {
        updateLastName = '(Redacted)'
    }
    if(pronouns === '') {
        pronouns = '(Redacted)'
    }

    const json = {
        'firstName': updateFirstName,
        'lastName': updateLastName,
        'pronouns': pronouns,
        'house': house
    }
    json.index = rowIndex

    const body = JSON.stringify(json)
    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    }).then(function(response){
        showData()
    })
}

const editRow = function (rowIndex) {
    //redraw the table
    fetch('/studentData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (studentList) {
        genTable(studentList, rowIndex)
    })
}

const deleteRow = function (rowIndex) {
    const rowData = {rowData: rowIndex};
    console.log(rowIndex);
    const body = JSON.stringify(rowData);
    fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });
    showData();
};

const genTable = function (studentList, editIndex) {
    let studentTable = document.querySelector('#HogwartsStudents');
    studentTable.innerHTML =
        '<tr>\n' +
        '<th align="center">First Name</th>\n' +
        '<th align="center">Last Name</th>\n' +
        '<th align="center">Pronouns</th>\n' +
        '<th align="center">House</th>\n' +
        '<th align="center">Edit</th>\n' +
        '<th align="center">Delete</th>\n' +
        '</tr>';

    for (let i = 0; i < studentList.length; i++) {
        const currentStudent = studentList[i];
        if(currentStudent.user === currUser) {
          let newLine = '<tr>\n';
        var houseColor;
        if(currentStudent.house === 'Gryffindor' || currentStudent.house === 'gryffindor') {
            currentStudent.house = 'Gryffindor'
            houseColor = '<div id="gryffindorbg">'
        }
        else if(currentStudent.house === 'Hufflepuff' || currentStudent.house === 'hufflepuff') {
            currentStudent.house = 'Hufflepuff'
            houseColor = '<div id="hufflepuffbg">'
        }
        else if(currentStudent.house === 'Ravenclaw' || currentStudent.house === 'ravenclaw') {
            currentStudent.house = 'Ravenclaw'
            houseColor = '<div id="ravenclawbg">'
        }
        else if(currentStudent.house === 'Slytherin' || currentStudent.house === 'slytherin') {
            currentStudent.house = 'Slytherin'
            houseColor = '<div id="slytherinbg">'
        }
        else {
            currentStudent.house = 'Muggle'
            houseColor = '<div id="mugglebg">'
        }
        if(i === editIndex) {
            newLine += ('<td align="center">' + houseColor + '<input id="firstName' + i + '" type="text" value="' + currentStudent.firstName + '"> </div></td>\n');
            newLine += ('<td align="center">' + houseColor + '<input id="lastName' + i + '" type="text" value="' + currentStudent.lastName + '"> </div></td>\n');
            newLine += ('<td align="center">' + houseColor + '<input id="pronouns' + i + '" type="text" value="' + currentStudent.pronouns + '"> </div></td>\n');
            newLine += ('<td align="center">' + houseColor + '<input id="house' + i + '" type="text" value="' + currentStudent.house + '"></div></td>\n');
            newLine += ('<td align="center">' + houseColor + '<button id="update' + i + '" class="outline" onclick="updateRow(' + i + ')"> Update </button></div></td>\n');
            newLine += ('<td align="center">' + houseColor + '<button id="delete' + i + '" class="outline" onclick="deleteRow(' + i + ')"> X </button></div></td>\n');
            newLine += '</tr>';
        }
        else {
            newLine += ('<td align="center">' + houseColor + currentStudent.firstName + '</div></td>\n');
            newLine += ('<td align="center">' + houseColor + currentStudent.lastName + '</div></td>\n');
            newLine += ('<td align="center">' + houseColor + currentStudent.pronouns + '</td>\n');
            newLine += ('<td align="center">' + houseColor+ currentStudent.house + '</td>\n');
            newLine += ('<td align="center">' + houseColor + '<button id="' + i + '" class="outline" onclick="editRow(' + i + ')"> Edit </button></td>\n');
            newLine += ('<td align="center">' + houseColor + '<button id="' + i + '" class="outline" onclick="deleteRow(' + i + ')"> X </button></td>\n');
            newLine += '</div>' + '</tr>';
        }

        studentTable.innerHTML += newLine
        }
        
    }
}

const showData = function () {
    fetch('/studentData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (studentList) {
        genTable(studentList, -1)
    })
}

const logout = function(e) {
  e.preventDefault()
  document.getElementById('maindisplay').style.display = "none"
  document.getElementById('homepage').style.display = ""
  document.getElementById('firstName').value = ""
  document.getElementById('lastName').value = ""
  document.getElementById('inputother').value = ""
  document.getElementById('he').checked = true
  document.getElementById('bravery').checked = true
  currUser = ""
}

window.onload = function () {
  fetch( '/test', {
    method:'POST',
    credentials: 'include'
  }).then( console.log )
  .catch( err => console.error ) 
  const homeLoginButton = document.getElementById('homelogin')
  const cancelLoginButton = document.getElementById('cancelLogin')
  const submitButton = document.getElementById('submitButton')
  const loginButton = document.getElementById('loginButton')
  const registerButton = document.getElementById('register')
  const cancelRegisterButton = document.getElementById('cancelRegister')
  const confirmRegisterButton = document.getElementById('confirmRegister')
  const logoutButton = document.getElementById('logout')
  homeLoginButton.onclick = homeLogin
  submitButton.onclick = submit
  loginButton.onclick = login
  cancelLoginButton.onclick = cancelLogin
  registerButton.onclick = register
  cancelRegisterButton.onclick = cancelRegister
  confirmRegisterButton.onclick = confirmRegister
  logoutButton.onclick = logout
}

// Wrap every letter in a span
let textWrapper = document.querySelector('.ml3');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

var anime
anime.timeline({loop: true})
  .add({
    targets: '.ml3 .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 500,
    delay: (el, i) => 150 * (i+1)
  }).add({
    targets: '.ml3',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });