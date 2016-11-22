var comment = document.getElementById('comment');
comment.style.display = 'none';

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
        //Take some action
        if (request.status == 200) {
            comment.style.display = 'block';
        } else if (request.status === 403) {
            comment.style.display = 'none';
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
  }
};
