const express = require('express');

const Users = require('./userDb.js')
const Post = require('../posts/postDb.js');

const router = express.Router();

router.use((req, res, next) => {
  console.log('Inside User Router');
  next();
})

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error adding the user'
      });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  Post.insert({ ...req.body, user_id: req.params.id})
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

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error retreiving the users'
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
    .then(posts => {
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ message: 'No posts by this user'});
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error retreiving the posts'
      });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then(() => {
      res.status(200).json(req.user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error deleting the user'
      });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  // do your magic!
  Users.update(req.user.id, req.body)
    .then(async function(){
      const user = await Users.getById(req.params.id);
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'Error updating the user'
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  if(!typeof(id) == Number){
    res.status(400).json({ message: 'Invalid User ID'})
  } else {
    Users.getById(id)
      .then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).json({ message: 'user id not found' });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: 'Error retreiving the user'
        });
      });
  }
}

function validateUser(req, res, next) {
  // do your magic!
  if(!req.body || Object.keys(req.body).length == 0){
    res.status(400).json({ message: 'missing user data' });
  } else {
    if (!req.body.hasOwnProperty('name')) {
      res.status(400).json({ message: 'missing required name field'});
    } else {
      next();
    }
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body || Object.keys(req.body).length == 0){
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
