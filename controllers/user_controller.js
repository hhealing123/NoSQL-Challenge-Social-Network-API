const { User, Thought } = require('../models');

const userController = {
    // Get All Users.
    getAllUsers(req, res) {
        User.find({})
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    // Get single user by their ID.
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        // Will return this if no user is found.
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'No user is found with this id...'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // Creates a new user.
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // Updates a current user by their ID.
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user is found with this id...' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // Deletes a current user by their ID.
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user is found with this id...'});
                return;
            }
            // Removes the user from any friends arrays.
            User.updateMany(
                { _id : {$in: dbUserData.friends } },
                { $pull: { friends: params.id } }
            )
            .then(() => {
                // Removes any comments from current user.
                Thought.deleteMany({ username : dbUserData.username })
                .then(() => {
                    res.json({message: "Successfully deleted the user"});
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user is found with this ID...' });
                return;
            }
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserData2 => {
                if(!dbUserData2) {
                    res.status(404).json({ message: 'No user is found with this ID...' })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $pull: { friends: params.userId } },
            { new: true, runValidators: true }
        )
        .then(dbUserData2 => {
            if(!dbUserData2) {
                res.status(404).json({ message: 'No user is found with this ID...' })
                return;
            }
            res.json({message: "Successfully deleted user's friend..."});
        })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    }
}

module.exports = userController;