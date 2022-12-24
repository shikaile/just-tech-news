const router = require('express').Router();
const {User} = require('../../models');

//GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude:['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/users/byid
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude:['password']
        },
        where: {
            id: req.params.id
            }
        })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(400).json({message: 'No user found'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//POST /api/users
router.post('/', (req, res) => {
      // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then (dbUserData => res.json(dbUserData))
        .catch(err =>{
            console.log(err);
            res.status(500).json(err);
        });
});

//PUT /api/users/byid
router.put('/:id', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData[0]) {
                res.status(400).json({message: 'No user found'});
                return; 
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//DELETE /api/users/byid
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message: 'No user found'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports= router;