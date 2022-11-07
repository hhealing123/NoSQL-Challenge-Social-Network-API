const router = require('express').Router();

// Sets requirements from thought_controller.js file
const { 
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought_controller');

router.route('/').get(getAllThoughts).post(createThought);

router.route('/:id').get(getThoughtById).put( updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(addReaction)

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction)

module.exports = router;