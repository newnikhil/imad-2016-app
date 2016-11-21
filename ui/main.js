var art = document.getElementById('article2');

art.onclick = function()
{
       //Create a request object
    var request = new XMLHttpRequest();
    
  //Capture the response and store it in a variable
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            //Take some action
            if (request.status == 200) {
                //alert("User successfully logged in");
                var req = new XMLHttpRequest();
                
                if (req.readyState ===  XMLHttpRequest.DONE) {
//                document = req.response;
                    alert(req.responseText);
                }
                req.open('GET', "http://newnikhil.imad.hasura-app.io/article-two", true);
                
                req.send(null);
            } else if (request.status === 403) {
                alert("You need to login first!");
            } else if (request.status === 500) {
                alert("Something went wrong on the server");
            }
        }
        //Not done yet
    };
    
    //Make the request
    request.open('GET', "http://newnikhil.imad.hasura-app.io/check-login", true);
    request.send(null);
    //Make a request to the server and send the name
    //Capture a list of names and render as a list

};
/*
//Counter code
var button = document.getElementById("counter");

button.onclick = function()
{
    //Create a request object
    var request = new XMLHttpRequest();
    
  //Capture the response and store it in a variable
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            //Take some action
            if (request.status == 200) {
                var counter = request.responseText;
                var span = document.getElementById("count");
                span.innerHTML = counter.toString();
                
            }
        }
        //Not done yet
    };
    
    //Make the request
    request.open('GET', "http://newnikhil.imad.hasura-app.io/counter", true);
    request.send(null);
};
*/

var submit = document.getElementById("submit_btn_login");

submit.onclick = function() {
    //Create a request object
    var request = new XMLHttpRequest();
    
  //Capture the response and store it in a variable
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            //Take some action
            if (request.status == 200) {
                alert("User successfully logged in");
            } else if (request.status === 403) {
                alert("username/password incorrect");
            } else if (request.status === 500) {
                alert("Something went wrong on the server");
            }
        }
        //Not done yet
    };
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    console.log(username);
    console.log(password);
    
    //Make the request
    request.open('POST', "http://newnikhil.imad.hasura-app.io/login", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password: password}));
    //Make a request to the server and send the name
    //Capture a list of names and render as a list

};

var submit_register = document.getElementById("submit_btn_register");

submit_register.onclick = function() {
    //Create a request object
    var request = new XMLHttpRequest();
    
  //Capture the response and store it in a variable
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            //Take some action
            if (request.status == 200) {
                alert("Registered successfully!");
            } else if (request.status === 403) {
                alert("username/password incorrect");
            } else if (request.status === 500) {
                alert("Something went wrong on the server");
            }
        }
        //Not done yet
    };
    
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    console.log(username);
    console.log(password);
    
    //Make the request
    request.open('POST', "http://newnikhil.imad.hasura-app.io/create-user", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password: password}));
    //Make a request to the server and send the name
    //Capture a list of names and render as a list

};
/*
//Submit name
var submit = document.getElementById("submit_btn");

submit.onclick = function() {
    //Create a request object
    var request = new XMLHttpRequest();
    
  //Capture the response and store it in a variable
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            //Take some action
            if (request.status == 200) {
                var names = request.responseText;
                names = JSON.parse(names);
                var list = "";
                
                for (i = 0; i < names.length; i++) {
                    list += "<li>" + names[i] + "</li>";
                }
                
                var ul = document.getElementById("namelist");
                ul.innerHTML = list;
            }
        }
        //Not done yet
    };
    
    var nameInput = document.getElementById("name");
    var name = nameInput.value;
    
    //Make the request
    request.open('GET', "http://newnikhil.imad.hasura-app.io/submit-name?name=" + name, true);
    request.send(null);
    //Make a request to the server and send the name
    //Capture a list of names and render as a list

};
*/