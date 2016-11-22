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
