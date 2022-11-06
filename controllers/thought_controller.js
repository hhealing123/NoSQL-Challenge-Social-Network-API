const { User, Thought } = require('../models');

const thoughtController = {
    // Gets all thoughts.
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // Gets specific thought by ID.
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought is found with this ID...'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Creates a new thought.
    createThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user is found with this ID...' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    // Update a current thought by ID.
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
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


    // Delete a current thought by ID.
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought is found with this ID...'});
                return;
            }
            // Deletes the reference to deleted thought in the user's thought array.
            User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: params.id } }
            )
            .then(() => {
                res.json({message: 'Successfully deleted the thought!'});
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },

    // Adds a new Reaction.
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought is found with this id...' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

    // Deletes a reaction by ID.
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought is found with this ID...' });
                return;
            }
            res.json({message: 'Successfully deleted the reaction'});
        })
        .catch(err => res.status(500).json(err));
    },
}

module.exports = thoughtController;