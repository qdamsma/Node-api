require('dotenv').config();
const { randomUUID } = require('crypto');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { createHandler } = require('graphql-http/lib/use/express');
const { ruruHTML } = require('ruru/server');

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');
const { clearImage} = require('./util/file');

const MONGODB_URI = process.env.MONGO_URI;

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, randomUUID() + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated');
  }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  if(req.body.oldPath){
    clearImage(req.body.oldPath);
  }
  return res.status(201).json({message: 'File stored', filePath: req.file.path })
})

app.get('/graphiql', (req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

app.use('/graphql', createHandler({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  context: (req) => ({ req: req.raw }),
  formatError(err) {
    if (!err.originalError) {
      return err;
    }
    const data = err.originalError.data;
    const message = err.message || 'An error occured';
    const code = err.originalError.code || 500;
    return { message: message, status: code, data: data }
  }
}));

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(MONGODB_URI).then(result => {
  const server = app.listen(8080);
})
  .catch(err => {
    console.log(err);
  });