var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user: 'newnikhil',
    database: 'newnikhil',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: "someRandomSecretValue",
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}
}));

var articleOne = {
    title: 'Article One | Nikhil',
    heading: 'Article One',
    date: 'Sep 26, 2016',
    content: `
    <p>
        How you doin'? How you doin'? How you doin'? How you doin'? How you doin'? How you doin'? How you doin'? How you doin'? How you doin'? How you doin'? How you doin'? How you doin'?
    </p>
    <p>
        I am good. I am good. I am good. I am good. I am good. I am good. I am good. I am good. I am good. I am good. I am good. I am good.
    </p>`
};

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="/ui/style.css" rel="stylesheet" />
            <link href="/ui/menu_style.css" rel="stylesheet" />
        </head>
        <body>
            <div class="jumbotron">
                <div class="container">
                    <div>
                        <a href="/">Home</a>
                    </div>
                    <hr/>
                    <h3>
                        ${heading}
                    </h3>
                    <div>
                        ${date.toDateString()}
                    </div>
                    <div>
                        ${content}
                    </div>
                    <hr />
                    <h4>Comments</h4>
                    <div id="comment_form" style='width: 100%'>
                          <textarea id='comment' style='display: none; width: inherit' class="form-control status-box" rows="2" placeholder="What's on your mind?"></textarea>
                    </div>
                    <div class="button-group pull-right">
                        <a href="#" id="post" style="display: none" class="btn btn-primary">Post</a>
                    </div>
                    <div id="comments">
                        <center>Loading comments...</center>
                    </div>
                    <script type="text/javascript" src="/ui/article.js"></script>
                </div>
            </div>
        </body>
    </html>`;
    
    return htmlTemplate;
}

var pool = new Pool(config);

app.get('/test-db', function(req, res) {
    //make a select request
    //return a response with the results
    pool.query('SELECT *FROM test', function(err, result) {
        if (err)  {
           res.status(500).send(err.toString());
       } else {
           res.send(JSON.stringify(result.rows));
       }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt) {
	var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');

	return ['pbkdf2', '10000', salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res) {
	var hashedString = hash(req.params.input, 'this-is-some-random-string');
	res.send(hashedString);
});

app.post('/create-user', function(req, res) {
    //username, password
    //JSON
    var username = req.body.username;
    var password = req.body.password;
    
    if (username.length === 0 || password.length === 0) {
        res.status(403).send("username/password is too short!");
    }
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    
    pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send("User has been successfully created: " + username);
        }
    });
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result) {
       if (err) {
            res.status(500).send(err.toString());
       } else {
           if (result.rows.length === 0) {
               res.status(403).send('username/password is invalid');
           } else {
               var dbString = result.rows[0].password;
               var salt = dbString.split('$')[2];
               var hashedPassword = hash(password, salt);
               
               if (hashedPassword === dbString) {
                   req.session.auth = {userId: result.rows[0].id};
                   
                   res.send('credentials correct!');
               } else {
                   res.status(403).send('forbidden');
               }
           }
       }
    });
});

app.get('/check-login', function(req, res) {
    if (req.session && req.session.auth && req.session.auth.userId) {
        res.send('You are logged in: ' + req.session.auth.userId);
    } else {
        res.status(403).send('You are not logged in');
    }
});

app.get('/logout', function(req, res) {
   delete req.session.auth;
   res.send('Logged out!');
});

var counter = 0;
app.get('/counter', function(req, res) {
   counter++;
   res.send(counter.toString());//You can only send a string as response and not a number as a response
});

var names = [];
app.get('/submit-name', function(req, res) {// URL: /submit-name?name=
    //Set the name from request
    var name = req.query.name;
    names.push(name);
    
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function(req, res) {
    pool.query("SELECT *FROM article where title = '" + req.params.articleName + "'", function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(404).send('Article not found!');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

app.get('/display-comments/:articleName', function(req, res) {
    pool.query("SELECT id FROM article where title = '" + req.params.articleName + "'", function(err, result) {
       if (err)  {
           res.status(500).send("1" + err.toString());
       } else {
            var articleId = result.rows[0].id;
            
            pool.query("SELECT * FROM comment WHERE article_id = " + articleId, function(err, result) {
               if (err)  {
                   res.status(500).send("2" + err.toString());
               } else {
                   var comments = "";
                   for (var i = 0; i < result.rows.length; i++) {
                       comments += '<li>' + result.rows[i].comment + '</li>';
                   }
                   res.send(comments);
               }
            });
       }
    });
});

app.post('/post-comment', function(req, res) {
    //username, password
    //JSON
    var comment = req.body.comment;
    var articleName = req.body.articleName;
    
//    var username = "";
    pool.query('SELECT username from "user" WHERE id = ' + req.session.auth.userId, function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            var username = result.rows[0].username;
            pool.query('SELECT id from "article" WHERE title = \'' + articleName + '\'', function(err, result) {
                if (err) {
                    res.status(500).send(err.toString());
                } else {
                    var articleId = result.rows[0].id;
                    pool.query('INSERT INTO "comment" (comment, username, article_id) VALUES ($1, $2, $3)', [comment, username, articleId], function(err, result) {
                        if (err) {
                            res.status(500).send(err.toString());
                        } else {
                            res.send("Comment inserted " + comment + ": " + username);
                        }
                    });
                }
            });
        }
    });
});

app.get('/load-articles', function(req, res) {
    var articleList = "";
    
    pool.query('SELECT * FROM "article"', function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
//            var articleList = "";
            for (var i = 0; i < result.rows.length; i++) {
                articleList += '<li><a href="http://newnikhil.imad.hasura-app.io/articles/' + result.rows[i].title + '">' + result.rows[i].title + '</li>';
            }
            res.status(200).send(articleList);
        }
    });
});

app.get('/ui/loginPopup', function(req, res) {
    res.sendFile(path.join(__dirname, 'loginPopup.html'))
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/article.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article.js'));
});

app.get('/article-one', function (req, res) {
  res.send(createTemplate(articleOne));
});

app.get('/article-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});

app.get('/ui/app.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'app.js'));
});

app.get('/ui/menu_style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'menu_style.css'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
