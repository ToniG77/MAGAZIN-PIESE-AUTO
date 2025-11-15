const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const {User}= require('./database/models');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
// Importam favorite routes 
const favoriteRoutes = require('./routes/favorite.routes');

const app = express();
dotenv.config();
 
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello'});
})

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
// Mountam favorite 
app.use('/favorites', favoriteRoutes);

app.listen(PORT, () => {//pornire server
    console.log(`Server successfully started on port ${PORT}`);
})

