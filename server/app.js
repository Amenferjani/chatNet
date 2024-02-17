const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/user');


app.use('/api/user', userRoutes);


    const PORT = process.env.PORT || 8800;

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});

module.exports = app;