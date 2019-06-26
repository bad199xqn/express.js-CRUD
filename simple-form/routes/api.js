var express = require('express');
var router = express.Router();

var article_controller = require('../controllers/articleController');
// GET api home page.
router.get('/', article_controller.index);

//GET create
router.get('/article/create', article_controller.article_create_get);

//POST create
router.post('/article/create', article_controller.article_create_post);

//GET delete
router.get('/article/:id/delete', article_controller.article_delete_get);

//POST delete
router.post('/article/:id/delete', article_controller.article_delete_post);

//List all article
router.get('/articles', article_controller.article_list);

// 1 article
router.get('/article/:id', article_controller.article_detail);

module.exports = router;