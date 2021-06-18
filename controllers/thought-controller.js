const { Thought } = require('../models')

const thoughtController = {

    getAllThoughts(req,res){
        Thought.find({})
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })

    },
    getThoughtById({ params }, res){
        Thought.findOne({ _id: params.id}, res)
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.json(404).json({ message: 'This is not the thought you are looking for'})
                return
            }
            res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })

    },
    createThought({ body }, res){
        Thought.create(body)
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err =>{
            console.log(err)
            res.status(400).json(err)
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
    deleteThought({ params}, res){
        Thought.findOneAndUpdate({ _id: params.id}, res)
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({ message: 'Not today kiddo'})
                return
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
    }

}

module.exports = thoughtController