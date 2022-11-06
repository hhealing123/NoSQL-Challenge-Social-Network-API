const { Schema, model, Types } = require('mongoose');
// Require moment modules to validate, parse, or display date and time. 
const moment = require('moment');

const reactionSchema = new Schema(
    {
    reactionId: {
        type: Schema.Types.ObjectId,
        default: new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    }
    },
    {
    toJSON: {
        getters: true
        }
    }
);

const thoughtSchema = new Schema(
    {
    thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        required: true
    },
    // Use reactionSchema to validate the data.
    reactions: [reactionSchema]
    },
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
    }
);

// Creates a virtual called "reactionCount" that retrieves the length of the thought's "reactions" array field on query.
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// Creates the Thoughts model using the thoughtSchema.
const Thought = model('Thought', thoughtSchema);

// Exports Thought module.
module.exports = Thought;