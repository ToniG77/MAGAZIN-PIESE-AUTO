// server/routes/favorite.routes.js


//IMPORTAM LUCURI
const { Favorite } = require('../database/models');///MODEL

const express = require('express');

const { verifyToken } = require('../utils/token.js');


const router = express.Router();


router.post('/', verifyToken, async (req, res) => {
    try {
        
        console.log('[favorites] POST / body:', req.body);
        
        
        const userId = req.userId;
        
        
        const { productId, name, description, price, category, image, stock } = req.body;

        
        if (!productId || !name || !price || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields (productId, name, price, category)', 
                data: {} 
            });
        }

       
        const existing = await Favorite.findOne({
            where: { userId, productId }
        });

        
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Product already in favorites',
                data: {}
            });
        }

        
        const favorite = await Favorite.create({
            userId,           // Link to current user
            productId,        // Link to product
            name,             // Store product name
            description: description || null,  // Store description (optional)
            price,            // Store current price
            category,         // Store category
            image: image || null,    // Store image URL (optional)
            stock: stock || 0,       
        });

        
        res.status(201).json({
            success: true,
            message: 'Product added to favorites',
            data: favorite
        });
    } catch (error) {
        
        console.error('[favorites] error adding to favorites:', error && error.stack ? error.stack : error);
       
        res.status(500).json({
            success: false,
            message: 'Error adding to favorites',
            data: error.message
        });
    }
});


router.get('/', verifyToken, async (req, res) => {
    try {
        
        const userId = req.userId;

        
        const favorites = await Favorite.findAll({
            where: { userId }
        });

       
        res.status(200).json({
            success: true,
            message: 'Favorites retrieved successfully',
            data: favorites
        });
    } catch (error) {
        
        console.error('[favorites] error fetching favorites:', error && error.stack ? error.stack : error);
        
        res.status(500).json({
            success: false,
            message: 'Error fetching favorites',
            data: error.message
        });
    }
});


router.get('/:id', verifyToken, async (req, res) => {
    try {
        
        const userId = req.userId;
        
        const { id } = req.params;

        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Favorite id is not valid',
                data: {}
            });
        }

        
        const favorite = await Favorite.findOne({
            where: { id, userId }
        });

        
        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found',
                data: {}
            });
        }

        
        res.status(200).json({
            success: true,
            message: 'Favorite retrieved successfully',
            data: favorite
        });
    } catch (error) {
        
        console.error('[favorites] error fetching favorite:', error && error.stack ? error.stack : error);
        
        res.status(500).json({
            success: false,
            message: 'Error fetching favorite',
            data: error.message
        });
    }
});


router.put('/:id', verifyToken, async (req, res) => {
    try {
        
        const userId = req.userId;
        
        const { id } = req.params;

        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Favorite id is not valid',
                data: {}
            });
        }

        
        const favorite = await Favorite.findOne({
            where: { id, userId }
        });

        
        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found',
                data: {}
            });
        }

    
        const updated = await favorite.update(req.body);

        
        res.status(200).json({
            success: true,
            message: 'Favorite updated successfully',
            data: updated
        });
    } catch (error) {
        
        console.error('[favorites] error updating favorite:', error && error.stack ? error.stack : error);
       
        res.status(500).json({
            success: false,
            message: 'Error updating favorite',
            data: error.message
        });
    }
});


router.delete('/:id', verifyToken, async (req, res) => {
    try {
        
        const userId = req.userId;
        
        const { id } = req.params;

        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Favorite id is not valid',
                data: {}
            });
        }

        
        const favorite = await Favorite.findOne({
            where: { id, userId }
        });

        
        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found',
                data: {}
            });
        }

        
        await favorite.destroy();

        
        res.status(200).json({
            success: true,
            message: 'Favorite removed successfully',
            data: {}
        });
    } catch (error) {
        
        console.error('[favorites] error deleting favorite:', error && error.stack ? error.stack : error);
       
        res.status(500).json({
            success: false,
            message: 'Error deleting favorite',
            data: error.message
        });
    }
});


router.delete('/product/:productId', verifyToken, async (req, res) => {
    try {
        
        const userId = req.userId;
        
        const { productId } = req.params;

       
        if (isNaN(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product id is not valid',
                data: {}
            });
        }

       
        const favorite = await Favorite.findOne({
            where: { userId, productId }
        });

        
        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found',
                data: {}
            });
        }

        
        await favorite.destroy();

       
        res.status(200).json({
            success: true,
            message: 'Favorite removed successfully',
            data: {}
        });
    } catch (error) {
        
        console.error('[favorites] error deleting favorite by product:', error && error.stack ? error.stack : error);
        
        res.status(500).json({
            success: false,
            message: 'Error deleting favorite',
            data: error.message
        });
    }
});


module.exports = router;
