var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema(
    {
        article_title: { type: String, required: true},
        article_content: { type: String, required: true}
    }

);

//phuong thuc ao url
ArticleSchema
    .virtual('url')
    .get(function () {
        return '/api/article/' + this._id;
    });

module.exports = mongoose.model('Article', ArticleSchema);

