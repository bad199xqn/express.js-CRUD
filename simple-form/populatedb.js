#! /usr/bin/env node

console.log('This script populates some test books, articles, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')

var Article = require('./models/article')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var articles = []


function articleCreate(article_title, article_content, cb) {
  articledetail = {article_title:article_title , article_content: article_content }

  
  var article = new Article(articledetail);
       
  article.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Article: ' + article);
    articles.push(article)
    cb(null, article)
  }  );
}


function createArticles(cb) {
    async.series([
        function(callback) {
          articleCreate('Patrick', 'Rothfuss', callback);
        },
        function(callback) {
          articleCreate('Ben', 'Bova', callback);
        },
        function(callback) {
          articleCreate('Isaac', 'Asimov', callback);
        },
        function(callback) {
          articleCreate('Bob', 'Billings', callback);
        },
        function(callback) {
          articleCreate('Jim', 'Jones', callback);
        },
        ],
        // optional callback
        cb);
}



async.series([
    createArticles,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('aaa');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



