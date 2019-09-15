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
  document.getElementById('registerform').style.display = "none"
  document.getElementById('homepage').style.display = ""
}

const confirmRegister = function(e) {
  e.preventDefault()
  const username = document.getElementById('usernameRegister').value,
        password = document.getElementById('passwordRegister').value,
        confirmPassword = document.getElementById('confirmPassword').value
  if(registerCheck(username, password, confirmPassword)) {
    
  }
}

function registerCheck(username, password, confirmPassword) {
  let userList;
  fetch('/register', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (users) {
        userList = users
      console.log(users)
    })
  //console.log(userList)
  if(password != confirmPassword) {
    document.getElementById('passwordmismatch').style.display = ""
    document.getElementById('passwordmismatch').focus()
    return false
  }
  else {
    document.getElementById('passwordmismatch').style.display = "none"
    document.getElementById('passwordmismatch').focus()
    return true
  }
}

const cancelLogin = function(e) {
  e.preventDefault()
  document.getElementById('homepage').style.display = ""
  document.getElementById('loginform').style.display = "none"
}

const login = function (e) {
  e.preventDefault()
  const username = document.getElementById('username').value,
        password = document.getElementById('password').value
  console.log(username)
  console.log(password)
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
      showData()
    }
    else {
      console.log('here')
      document.getElementById('loginerror').style.display = ""
    }
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
            newLine += ('<td align="center">' + houseColor + '<button id="update' + i + '" onclick="updateRow(' + i + ')"> Update </button></div></td>\n');
            newLine += ('<td align="center">' + houseColor + '<button id="delete' + i + '" onclick="deleteRow(' + i + ')"> X </button></div></td>\n');
            newLine += '</tr>';
        }
        else {
            newLine += ('<td align="center">' + houseColor + currentStudent.firstName + '</div></td>\n');
            newLine += ('<td align="center">' + houseColor + currentStudent.lastName + '</div></td>\n');
            newLine += ('<td align="center">' + houseColor + currentStudent.pronouns + '</td>\n');
            newLine += ('<td align="center">' + houseColor+ currentStudent.house + '</td>\n');
            newLine += ('<td align="center">' + houseColor + '<button id="' + i + '" onclick="editRow(' + i + ')"> Edit </button></td>\n');
            newLine += ('<td align="center">' + houseColor + '<button id="' + i + '" onclick="deleteRow(' + i + ')"> X </button></td>\n');
            newLine += '</div>' + '</tr>';
        }

        studentTable.innerHTML += newLine
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
  homeLoginButton.onclick = homeLogin
  submitButton.onclick = submit
  loginButton.onclick = login
  cancelLoginButton.onclick = cancelLogin
  registerButton.onclick = register
  cancelRegisterButton.onclick = cancelRegister
  confirmRegisterButton.onclick = confirmRegister
}