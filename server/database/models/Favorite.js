// server/database/models/Favorite.js


const { sequelize } = require('../server');
const { DataTypes } = require('sequelize');


const Favorite = sequelize.define('Favorite', {
 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Foreign key din users
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  // Foreign key referita la produs
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
    references: {
      model: 'products',
      key: 'id',
    },
  },
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  
  category: {
    type: DataTypes.ENUM('Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food', 'Other', 'Sisteme franare', 'Consumabile', 'Sisteme luminare fata', 'Sisteme curatare parbriz', 'Baterii', 'Sisteme de parcare'),
    allowNull: false,
  },
 
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  
  tableName: 'favorites',
  
  timestamps: true,
  
  createdAt: 'created_at',
  
  updatedAt: 'updated_at',
});


module.exports = Favorite;
