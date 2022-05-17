const express = require('express');
const blogSchema = require('../models/blog');
const router = express.Router();

//localhost:3000/blog

router.get('/', async (req, res) => {
    const result = await blogSchema.find({}).exec();
    res.render('blog/blog', { content: result });
});

router.get('/read/:id', async (req, res) => {
    const contentNo = req.params.id;
    const result = await blogSchema.findOne({ no: contentNo }).exec();
    res.render('blog/blogcontent', { content: result });
});


router.get('/write', (req, res) => {
    res.render('blog/write');
});

router.post('/write', (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    const blogText = new blogSchema({
        title: title,
        content: content,
    });

    blogText.save().then(result => {
        console.log(result);
        res.redirect('/blog');
    }).catch(err => {
        console.log(err);
        next(err);
    })
});

router.delete('/delete/:id', (req, res) => {
    const no = req.params.id;
    blogSchema.findOneAndDelete({no:no})
    .then(result => {
        return res.status(200).json({
            redirect: "/blog" //요거 백엔드에 유용... list.js/14로 넘어김
        });
    }).catch(err => {
        console.log(err);
    })
});

router.get('/updateread/:id', async(req, res) => {
    const contentNo = req.params.id;
    const result = await blogSchema.findOne({no: contentNo}).exec();
    res.render('blog/blogupdate', {content: result});
})

router.post('/updatewrite/:id', async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const no = req.params.id;
    await blogSchema.findOneAndUpdate({no: no}, {
        title:title,
        content:content
    }).exec();
    const updateResult = await blogSchema.findOne({no:no}).exec();
    res.render('blog/blogcontent', {content:updateResult});
})

//localhost:3000/blog

module.exports = router;