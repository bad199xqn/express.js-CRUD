const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Article = require('../models/article');
var async = require('async');
exports.index = function (req, res) {
    async.parallel({
        article_count: function (callback) {
            Article.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', { title: 'Home', error: err, data: results });
    });
}

//Hien thi list cac bai viet
exports.article_list = function (req, res, next) {

    Article.find({}, 'article_title')
        .exec(function (err, list_articles) {
            if (err) return next(err);
            res.render('article_list', { title: 'Article list', article_list: list_articles });
        });
};

//Hien thi chi tiet bai viet
exports.article_detail = function (req, res, next) {

    async.parallel({
        article: function (callback) {

            Article.findById(req.params.id)
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('article_detail', { title: 'Title', article: results.article });
    });

};

//Hien thi create form tren GET
exports.article_create_get = function (req, res, next) {
    res.render('article_form', { title: 'Create Article' })
};

//Xu ly create form tren POST
exports.article_create_post = [
    // Validate fields.
    body('article_title').isLength({ min: 1 }).trim().withMessage('Title must be specified.')
        .isLength({ max: 50 }).trim().withMessage('Title must be less than 100 character.'),
    body('article_content').isLength({ min: 1 }).trim().withMessage('Title must be specified.'),

    // Sanitize fields.
    sanitizeBody('article_title').escape(),
    sanitizeBody('article_content').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('article_form', { title: 'Create Article', article: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Article object with escaped and trimmed data.
            var article = new Article(
                {
                    article_title: req.body.article_title,
                    article_content: req.body.article_content,
                });
            article.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new article record.
                res.redirect(article.url);
            });
        }
    }
]

//Hien thi delete form tren GET
exports.article_delete_get = function (req, res, next) {
    async.parallel({
        article: function (callback) {
            Article.findById(req.params.id).exec(callback)
        }
    },
        function (error, results) {
            if (error) { return next(error); }
            res.render('article_delete', { title: 'Delete Article', article: results.article });
        });
};

//Xu ly delete form tren POST
exports.article_delete_post = function (req, res, next) {
    async.parallel({
        article: function (callback) {
            Article.findById(req.body.articleid).exec(callback)
        }
    },
        function (error, results) {
            if (error) { return next(error); }
            else
                Article.findByIdAndRemove(req.body.articleid, function deleteAticle(error) {
                    if (error) { return next(error); }
                    res.redirect('/api/articles')
                })
        }
    );
};
