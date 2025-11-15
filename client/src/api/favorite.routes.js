// client/src/api/favorite.routes.js
// This file contains all API functions for managing user favorites
// These functions communicate with the backend /favorites endpoints

// Import axiosAuth - HTTP client that automatically includes JWT token in requests
import axiosAuth from "../axios/axiosAuth";

// ============ ADD PRODUCT TO FAVORITES ============
// Function: addToFavorites
// Parameters: product object containing all product details
// Returns: Response with success status and created favorite data
// Purpose: Send product details to backend to create a favorite record
export const addToFavorites = async (product) => {
  try {
    // Send POST request to /favorites with all product details
    const response = await axiosAuth.post('/favorites', {
      productId: product.id,      // Reference to the product
      name: product.name,          // Store product name
      description: product.description,  // Store description
      price: product.price,        // Store current price
      category: product.category,  // Store category
      image: product.image,        // Store image URL
      stock: product.stock,        // Store stock quantity
    });
    // Return the response data (success true/false with favorite record)
    return response.data;
  } catch (error) {
    // Log error to console for debugging
    console.error("Error adding to favorites:", error);
    // Return error response data if available
    return error.response?.data;
  }
};

// ============ REMOVE FAVORITE BY FAVORITE ID ============
// Function: removeFavorite
// Parameters: favoriteId - the ID of the favorite record to delete
// Returns: Response with success status
// Purpose: Delete a specific favorite record using its ID
export const removeFavorite = async (favoriteId) => {
  try {
    // Send DELETE request to /favorites/:id
    const response = await axiosAuth.delete(`/favorites/${favoriteId}`);
    // Return the response data
    return response.data;
  } catch (error) {
    // Log error to console for debugging
    console.error("Error removing favorite:", error);
    // Return error response data if available
    return error.response?.data;
  }
};

// ============ REMOVE FAVORITE BY PRODUCT ID ============
// Function: removeFavoriteByProductId
// Parameters: productId - the ID of the product to remove from favorites
// Returns: Response with success status
// Purpose: Delete favorite using product ID (convenience function)
// This is useful because frontend usually has product ID readily available
export const removeFavoriteByProductId = async (productId) => {
  try {
    // Send DELETE request to /favorites/product/:productId
    const response = await axiosAuth.delete(`/favorites/product/${productId}`);
    // Return the response data
    return response.data;
  } catch (error) {
    // Log error to console for debugging
    console.error("Error removing favorite by product id:", error);
    // Return error response data if available
    return error.response?.data;
  }
};

// ============ GET ALL USER FAVORITES ============
// Function: getFavorites
// Parameters: none
// Returns: Response with array of all user's favorites
// Purpose: Fetch all products the user has favorited
export const getFavorites = async () => {
  try {
    // Send GET request to /favorites to get all user's favorites
    const response = await axiosAuth.get('/favorites');
    // Return the response data (array of favorites)
    return response.data;
  } catch (error) {
    // Log error to console for debugging
    console.error("Error fetching favorites:", error);
    // Return error response data if available
    return error.response?.data;
  }
};

// ============ GET SPECIFIC FAVORITE BY ID ============
// Function: getFavoriteById
// Parameters: favoriteId - the ID of the favorite record to retrieve
// Returns: Response with specific favorite data
// Purpose: Fetch a single favorite record by its ID
export const getFavoriteById = async (favoriteId) => {
  try {
    // Send GET request to /favorites/:id
    const response = await axiosAuth.get(`/favorites/${favoriteId}`);
    // Return the response data
    return response.data;
  } catch (error) {
    // Log error to console for debugging
    console.error("Error fetching favorite:", error);
    // Return error response data if available
    return error.response?.data;
  }
};

// ============ UPDATE FAVORITE ============
// Function: updateFavorite
// Parameters: 
//   - favoriteId: ID of the favorite record to update
//   - updates: object containing fields to update (e.g., {price: 29.99})
// Returns: Response with updated favorite data
// Purpose: Update stored product details in a favorite record (e.g., if price changed)
export const updateFavorite = async (favoriteId, updates) => {
  try {
    // Send PUT request to /favorites/:id with fields to update
    const response = await axiosAuth.put(`/favorites/${favoriteId}`, updates);
    // Return the response data
    return response.data;
  } catch (error) {
    // Log error to console for debugging
    console.error("Error updating favorite:", error);
    // Return error response data if available
    return error.response?.data;
  }
};
