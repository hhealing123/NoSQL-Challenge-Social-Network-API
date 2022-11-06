// Require moduels for express and mongoose.
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes'));

// Connect to mongoose.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-media-api', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Logs mongoose queries.
mongoose.set('debug', true);

app.listen(PORT, () => console.log(`You are now connected on localhost:${PORT}!!!`));