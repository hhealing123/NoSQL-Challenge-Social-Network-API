const router = require('express').Router();

// Sets requirements from user_controller.js file
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUsers,
    deleteUser,
    addFriend,
    deleteFriend
  } = require('../../controllers/user_controller');

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUserById).put(updateUsers).delete(deleteUser);

router.route('/:id/friends/:friendId').post(addFriend).delete(deleteFriend)

module.exports = router;