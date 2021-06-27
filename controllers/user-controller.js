const { User, Thought, Reaction } = require('../models')

const userController = {
    getAllUsers(req,res){
        User.find({})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })

    },
    getUserById({ params }, res){
        User.findOne({ _id: params.id })
        .populate([
            {
                path: 'thoughts',
                select: '-__v'
            },
            {
                path: 'reactions',
                select: '-__v'
            }
        ])
        .select('-__v')
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message:"try again homie"})
                return
            }
            res.json(dbUserData)
        })
        .catch(err => res.status(400).json(err))

    },
    createUser({ body }, res){
        User.create(body)
        .then(dbUserData => res.json(dbUserData)) 
        .catch(err => res.status(400).json(err))

    },
    updateUser({ params, body}, res){
        User.findOneAndUpdate({ _id: params.id }, body, {new:true})
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id'})
                return
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(400).json(err))

    },
    deleteUser({ params }, res){
        User.findOneAndDelete({ _id: params.id }, res )
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({ message: 'No user found with this id'})
                return
            }
            res.json(dbUserData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
        
    },
    addFriend({ params }, res){
        console.log(params)
        User.findOneAndUpdate(
            { _id: params.userId}, 
            { $push: { friends: params.friendId} },
            { runValidators: true, new: true}
        )
        .then(dbFriendData => {
            if(!dbFriendData){
                res.status(404).json({ message: 'this is not the friend you are looking for'})
            }
            res.json(dbFriendData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    },
    deleteFriend({ params }, res){
        console.log(params)
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId} },
            { runValidators: true, new: true}
        )
        .then(dbFriendData => {
            if(!dbFriendData){
                res.status(404).json({ message: 'you cant delete this friend'})
            }
            res.json(dbFriendData)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
        

    }
}

module.exports = userController