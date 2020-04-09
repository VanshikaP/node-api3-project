const express = require('express');

const Posts = require('./postDb.js');

const router = express.Router();

router.use((req, res, next) => {
  console.log('Inside Posts Router');
  next();
})

router.get('/', (req, res) => {
  // do your magic!
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error retrieving the posts'
      });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
    .then(() => {
      res.status(200).json(req.post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error deleting the post'
      });
    });
});

router.post('/', validatePost, (req, res) => {
  // do your magic!
  Posts.insert(req.body)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error adding the post'
      });
    });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  // do your magic!
  Posts.update(req.post.id, req.body)
    .then(async function (){
      const post = await Posts.getById(req.params.id);
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error updating the post'
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  if(!typeof(id) == Number){
    res.status(400).json({ message: 'Invalid Post ID'});
  } else {
    Posts.getById(id)
      .then(post => {
        if (post) {
          req.post = post;
          next();
        } else {
          res.status(404).json({ message: 'post id not found' });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: 'Error retreiving the post'
        });
      });
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if(!req.body || Object.keys(req.body).length == 0){
    res.status(400).json({ message: 'missing post data' });
  } else {
    if (!req.body.hasOwnProperty('text')) {
      res.status(400).json({ message: 'missing required text field'});
    } else {
      next();
    }
  }
}

module.exports = router;
