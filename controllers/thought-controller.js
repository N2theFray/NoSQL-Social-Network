const { Thought, User, Reaction } = require('../models')

const thoughtController = {

    getAllThoughts(req,res){
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })

    },
    getThoughtById({ params }, res){
        Thought.findOne({ _id: params.id })
        .populate([
           
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
    createThought({ body }, res){
        Thought.create(body)
        .then(dbThoughtData => {
            console.log(dbThoughtData)
            console.log(body.userId)
            User.findOneAndUpdate(
                { _id: body.userId},
                { $push: { thoughts: dbThoughtData._id} },
                { new: true }
            )
            .then(dbThoughtData => {
                if(!dbThoughtData){
                    res.status(404).json({ message: 'whatchu talking bout'})
                }
                res.json(dbThoughtData)
            })
            .catch(err =>{
                console.log(err)
                res.status(400).json(err)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })

    },
    updateThought({ params, body}, res){
        Thought.findOneAndUpdate({ _id: params.id}, body, {new:true})
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'No thoughts here padiwan'})
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(dbThoughtData)
        })

    },
    deleteThought({ params }, res){
        Thought.findOneAndDelete({ _id: params.id }, res )
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
    addReaction({ params, body}, res ){
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'Not today kiddo, there is no thought to react to' })
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(dbThoughtData)
        })
    },
    deleteReaction({ params, body }, res){
        Thought.findOneAndUpdate(
            { _id: params.id },
            { $pull: { reactions: {reactionId: body.reactionId} } },
            { runValidators: true, new: true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'no reactions here'})
            }
            res.json(dbThoughtData)
        })
        .catch(err => {res.status(400).json(err)})
    }

}

module.exports = thoughtController