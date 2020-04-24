const express = require('express');
const compression = require('compression');
const helmet = require('helmet')

const app = express();

app.use(helmet());
app.use(compression({
    level: 8
}));

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Supershapes starting off');
});

app.listen(3000, () => console.log('Supershapes is listening on port 3000!'));