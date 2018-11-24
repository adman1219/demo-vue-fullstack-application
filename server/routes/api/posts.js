const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });

    res.status(201).send();
});

router.put('/:postId', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.updateOne(
        {_id: new mongodb.ObjectID(req.params.postId)},
        {$set: {text: req.body.text }});
    res.status(200).send();
});

router.delete('/:postId', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.postId)});
    res.status(200).send();
});

async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect('mongodb://localhost:32768/vue_express', {
        useNewUrlParser: true
    });

    return client.db('vue_express').collection('posts');
}

module.exports = router;
