const express = require('express');
const compression = require('compression');
const helmet = require('helmet')

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression({
    level: 8
}));

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.send('Supershapes starting off');
});

app.listen(PORT, () => console.log('Supershapes is listening on port 3000 on local!'));