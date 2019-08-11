const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const app = express();
const router = express.Router();

mongoose
  .connect('mongodb://localhost:27017/test')
  .catch(error => console.log('Could not connect'));

const Link = mongoose.model(
  'Link',
  new mongoose.Schema({
    link: {
      type: String,
      required: true
    },
    tags: Array,
    text: String
  })
);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/bookmarks/', router);

router.get('/all', async (req, res) => {
  let links = await Link.find();
  res.send(links);
});

router.post('/', async (req, res) => {
  let link = new Link({
    link: req.body.link,
    tags: req.body.tags,
    text: req.body.text
  });

  console.log(req.body);

  let response = await Link.create(link).catch(error =>
    console.log('Could not create document')
  );
  if (response) {
    res.send(response);
  } else {
    res.status(500).send('Error: could not create');
  }
});

router.delete('/', async (req, res) => {
  let response = await Link.findByIdAndDelete(req.body._id).catch(error =>
    console.log('Could not delete document')
  );
  if (response) {
    res.send(response);
  } else {
    res.status(500).send('Error: could not delete');
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/posts.html');
});

app.listen(8080, () => console.log('App listening on port 8080...'));
