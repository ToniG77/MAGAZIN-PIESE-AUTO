// server/routes/product.routes.js
const { Product } = require('../database/models');
const express = require('express');
const {verifyToken} = require('../utils/token.js');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {///creare produs
    try {
        console.log('[products] POST / body:', req.body);

        const allowedCategories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food', 'Other', 'Sisteme franare', 'Consumabile', 'Sisteme luminare fata', 'Sisteme curatare parbriz', 'Baterii', 'Sisteme de parcare'];

        // If request body is an array, create multiple products (bulk insert)
        if (Array.isArray(req.body)) {
            // Basic validation: ensure each item has a name and category (or default to 'Other')
            const items = req.body.map((p) => {
                const name = p.name ? String(p.name).trim() : null;
                if (!name) {
                    throw new Error('Each product must have a non-empty name');
                }

                const category = allowedCategories.includes(p.category) ? p.category : 'Other';

                return {
                    name,
                    description: p.description || null,
                    price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
                    category,
                    image: p.image || null,
                    stock: Number.isInteger(p.stock) ? p.stock : parseInt(p.stock) || 0,
                };
            });

            const created = await Product.bulkCreate(items, { returning: true });
            return res.status(201).json({ success: true, message: 'Products created successfully', data: created });
        }

        // Single product create
        const name = req.body.name ? String(req.body.name).trim() : null;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Product name is required', data: {} });
        }

        const category = allowedCategories.includes(req.body.category) ? req.body.category : 'Other';

        const product = await Product.create({
            name,
            description: req.body.description || null,
            price: typeof req.body.price === 'number' ? req.body.price : parseFloat(req.body.price) || 0,
            category,
            image: req.body.image || null,
            stock: Number.isInteger(req.body.stock) ? req.body.stock : parseInt(req.body.stock) || 0,
        })

        res.status(201).json({success: true, message: 'Product created successfully', data: product});
    } catch (error) {
        console.error('[products] error creating product:', error && error.stack ? error.stack : error);
        res.status(500).json({success: false, message: 'Error creating product', data: error.message});
    }
});

router.put('/:id', verifyToken, async (req, res) => {///update produs
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Product id is not valid', data: {}})
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found', data: {}})
        }

        const updatedProduct = await product.update({
            ...req.body
        })

        res.status(200).json({success: true, message: 'Product updated successfully', data: updatedProduct});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error updating product', data: error.message});
    }
});

router.delete('/:id', verifyToken, async (req, res) => {//stergere bazata pe id
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Product id is not valid', data: {}})
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found', data: {}})
        }

        await product.destroy();

        res.status(200).json({success: true, message: 'Product successfully deleted', data: {}});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error deleting product', data: error.message});
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({success: true, message: 'Products retrieved successfully', data: products});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error retrieving products', data: error.message});
    }
})

router.get('/:id', async (req, res) => {///citire produs dupa id
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Product id is not valid', data: {}})
        }

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found', data: {}})
        }

        res.status(200).json({success: true, message: 'Product was found', data: product})
    } catch (error) {
        res.status(500).json({success: false, message: 'Error retrieving product', data: error.message});
    }
});

module.exports = router;