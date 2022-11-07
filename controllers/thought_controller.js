const { User, Thought } = require('../models');

const thoughtController = {
    // Create a new thought
    createThought({ body }, res) {
        Thought.create(body)
        .then(( { _id } ) => {
            return User.findOneAndUpdate(
                {  _id: body.userId }, 
                { $push: {thoughts: _id } }, 
                { new: true }
            );
        })
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'No user is found with this ID...' });
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err)); 
    },

    // Gets all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // Gets specific thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
            res.status(404).json({ message: 'No thought is found with this ID...' });
            return;
        }
        res.json(dbThoughtData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Update a current thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id }, 
            body, 
            { new: true, runValidators: true }
        )
        .populate({ path: 'reactions', select: '-__v' })
        .select('-___v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought is found with this ID...' });
                return;
            }
                res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // Delete a current thought by ID
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought is found with this ID...'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // Add a new Reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $push: { reactions: body } }, 
            { new: true, runValidators: true })
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought is found with this id...' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))

    },

    // Delete a reaction by ID
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $pull: {reactions: {reactionId: params.reactionId } } }, 
            { new : true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought is found with this ID...' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },
};

module.exports = thoughtController;