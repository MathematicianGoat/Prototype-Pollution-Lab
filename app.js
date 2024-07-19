const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const routes        = require('./routes');
const path          = require('path');
var cors            = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.set('views','./views');
app.use('/public', express.static(path.resolve('public')));

app.use(routes);

// app.all('*', (req, res) => {
//     return res.status(404).send('404 page not found');
// });

app.listen(80, () => console.log('Listening on port 80'));