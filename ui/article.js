var comment = document.getElementById('comment');
comment.style.display = 'none';

var post_btn = document.getElementById('post');
post_btn.style.display = 'none';

var req = new XMLHttpRequest();

req.onreadystatechange = function() {
    if (req.readyState === XMLHttpRequest.DONE) {
        //Take some action
        if (req.status == 200) {
//             var ul = getElementById('postList');
            var ul = document.createElement('ul');
            ul.id = 'postList';
            ul.innerHTML = req.responseText;
            document.getElementById('comments').innerHTML = "";
            document.getElementById('comments').appendChild(ul);
        }
    }
    //Not done yet
};

var articleName = window.location.href.split('/')[4];
    //Make the request
req.open('GET', "http://newnikhil.imad.hasura-app.io/display-comments/" + articleName, true);
req.send(null);

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
        //Take some action
        if (request.status == 200) {
            comment.style.display = 'block';
            post_btn.style.display = 'block';
        } else if (request.status === 403) {
            comment.style.display = 'none';
            post_btn.style.display = 'none';            
        } else if (request.status === 500) {
            alert("Something went wrong on the server");
        }
    }
    //Not done yet
};
    
    //Make the request
request.open('GET', "http://newnikhil.imad.hasura-app.io/check-login", true);
request.send(null);

var post = document.getElementById('post');

post.onclick = function() {
  var li = document.createElement('li');
  var text = document.getElementById('comment').value;
  
  if (text.length > 0) {
    li.textContent = text;
    var ul = document.getElementById('postList');
    ul.appendChild(li);
    comment.value = "";
    
    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            //Take some action
            if (request.status == 200) {
//                alert(req.responseText);
            } else if (request.status === 500) {
                alert("Something went wrong on the server");
            }
        }
        //Not done yet
    };
        
        //Make the request
    req.open('POST', "http://newnikhil.imad.hasura-app.io/post-comment", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({comment: text, articleName: articleName}));

  }
};
