const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Validates email by using REGEX.
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [{ 
        type: Schema.Types.ObjectId,
        // References Thought model. 
        ref: 'Thought' 
    }],
    friends: [{ 
        type: Schema.Types.ObjectId,
        // References User model (self-reference).  
        ref: 'User' 
    }]
    },
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
    }
);

// Creates a virtual called "friendCount" that retrieves the length of the user's "friends" array field on query.
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

// Creates the User model using the userSchema.
const User = model('User', userSchema);

// Exports User module.
module.exports = User;