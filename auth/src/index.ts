import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json())

app.listen(8000, () => {
  console.log('Listening on port: 8000')
})