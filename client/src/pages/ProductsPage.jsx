// client/src/pages/ProductsPage.jsx
// This page displays all available products and allows users to:
// - View products in a grid layout
// - Add/remove products to/from favorites (all logged-in users)
// - Edit/delete products (admin only)
// - Create new products (admin only)

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
// Import product API functions for fetching and deleting products
import { fetchProducts, deleteProduct } from '../api/product.routes';
// Import favorite API functions for managing favorites
import { addToFavorites, removeFavoriteByProductId, getFavorites } from '../api/favorite.routes';
// Import loading spinner component
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductsPage() {
  // ============ STATE VARIABLES ============
  // Array to store all products fetched from API
  const [products, setProducts] = useState([]);
  // Loading state - true while fetching products
  const [loading, setLoading] = useState(true);
  // Error message if fetching fails
  const [error, setError] = useState(null);
  // ID of product currently being deleted (for disabling button)
  const [deletingId, setDeletingId] = useState(null);
  // Array of user's favorite products
  const [favorites, setFavorites] = useState([]);
  // ID of product currently being favorited (for disabling button while loading)
  const [favoriting, setFavoriting] = useState(null);
  
  // ============ REDUX STATE ============
  // Get user object from Redux state
  const user = useSelector((state) => state.user.user);
  // Check if user is logged in
  const loggedIn = useSelector((state) => state.user.loggedIn);
  // Check if current user is admin (for showing edit/delete buttons)
  const isAdmin = user?.role === 'admin';
  // Router navigation hook for redirecting
  const navigate = useNavigate();

  // ============ FETCH PRODUCTS ON MOUNT ============
  useEffect(() => {
    // Define async function to fetch all products
    const getProducts = async () => {
      try {
        setLoading(true);
        // Call API to fetch all products
        const {data} = await fetchProducts();
        // Check if data is valid array
        if (data && Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        // Set error message for display
        setError(err.message || 'An error occurred while fetching products');
        console.error('Error fetching products:', err);
      } finally {
        // Set loading to false regardless of success or failure
        setLoading(false);
      }
    };

    // Call the async function
    getProducts();
  }, []); // Empty dependency array means this runs only once on component mount

  // ============ FETCH USER'S FAVORITES ON LOGIN ============
  useEffect(() => {
    // Only fetch favorites if user is logged in
    if (loggedIn) {
      // Define async function to fetch user's favorites
      const getFavs = async () => {
        // Call API to get all user's favorites
        const response = await getFavorites();
        // Check if response is successful and contains array
        if (response?.success && Array.isArray(response.data)) {
          // Update favorites state with fetched data
          setFavorites(response.data);
        }
      };
      // Call the async function
      getFavs();
    }
  }, [loggedIn]); // Re-run if loggedIn status changes

  // ============ HELPER: CHECK IF PRODUCT IS FAVORITED ============
  // Function to check if a product is in user's favorites
  // Parameters: productId - the ID to check
  // Returns: true if product is favorited, false otherwise
  const isFavorited = (productId) => {
    // Look for a favorite with matching productId
    return favorites.some((fav) => fav.productId === productId);
  };

  // ============ HANDLE FAVORITE BUTTON CLICK ============
  // Function triggered when user clicks the favorite heart button
  // Parameters: product - the product object being favorited/unfavorited
  const handleFavoriteClick = async (product) => {
    // Check if user is logged in before allowing favorites
    if (!loggedIn) {
      // Show error toast if not logged in
      toast.error('Please log in to add favorites');
      return;
    }

    try {
      // Set favorite button as loading (disable it during request)
      setFavoriting(product.id);

      // Check if product is already favorited
      if (isFavorited(product.id)) {
        // If favorited, remove it from favorites
        // Call API to remove favorite by product ID
        const response = await removeFavoriteByProductId(product.id);
        if (response?.success) {
          // Update local favorites state by filtering out the removed product
          setFavorites(favorites.filter((fav) => fav.productId !== product.id));
          // Show success toast notification
          toast.success('Removed from favorites');
        } else {
          // Show error toast if removal failed
          toast.error(response?.message || 'Failed to remove from favorites');
        }
      } else {
        // If not favorited, add it to favorites
        // Call API to add product to favorites
        const response = await addToFavorites(product);
        if (response?.success) {
          // Update local favorites state by adding the new favorite
          setFavorites([...favorites, response.data]);
          // Show success toast notification
          toast.success('Added to favorites');
        } else {
          // Show error toast if adding failed
          toast.error(response?.message || 'Failed to add to favorites');
        }
      }
    } catch (err) {
      // Show generic error toast if unexpected error occurs
      toast.error(err.message || 'An error occurred');
      console.error('Error toggling favorite:', err);
    } finally {
      // Clear the favoriting state to re-enable button
      setFavoriting(null);
    }
  };

  // ============ HANDLE EDIT BUTTON CLICK ============
  // Function to navigate to edit product page
  // Parameters: productId - the ID of product to edit
  const handleEditClick = (productId) => {
    // Navigate to edit page with product ID in URL
    navigate(`/products/edit/${productId}`);
  };

  // ============ HANDLE DELETE BUTTON CLICK ============
  // Function to delete a product (admin only)
  // Parameters: productId - the ID of product to delete
  const handleDeleteClick = async (productId) => {
    // Show confirmation dialog before deleting
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // Set deleting state to disable button while loading
      setDeletingId(productId);
      // Call API to delete product
      const response = await deleteProduct(productId);

      if (response?.success) {
        // Remove deleted product from local products state
        setProducts(products.filter((p) => p.id !== productId));
        // Show success toast notification
        toast.success('Product deleted successfully');
      } else {
        // Show error toast if deletion failed
        toast.error(response?.message || 'Failed to delete product');
      }
    } catch (err) {
      // Show generic error toast if unexpected error occurs
      toast.error(err.message || 'An error occurred while deleting the product');
    } finally {
      // Clear deleting state to re-enable button
      setDeletingId(null);
    }
  };

  
  const handleCreateClick = () => {
   
    navigate('/products/create');
  };

 
  if (loading) {
    return <LoadingSpinner />;
  }

  
  if (error) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

 
  if (!products || products.length === 0) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No products available</p>
          {/* Show create button only for admins */}
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Product
            </button>
          )}
        </div>
      </div>
    );
  }

  
  return (
    <div className="bg-white h-screen overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Header with title and create button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
          {/* Show create button only for admins */}
          {isAdmin && (
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Product
            </button>
          )}
        </div>

        {/* Grid layout for products (responsive: 1 column mobile, 2 tablet, 4 desktop) */}
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {/* Map through products array and render each product */}
          {products.map((product) => (
            <div key={product.id} className="group relative">
              {/* Product image container */}
              <div className="relative">
                <img
                  alt={product.name}
                  src={product.image || 'https://via.placeholder.com/300'}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 pointer-events-none"
                />
                {/* Action buttons - show on hover */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  {/* FAVORITE BUTTON - visible to all logged-in users */}
                  {loggedIn && (
                    <button
                      type="button"
                      // Dynamic styling: red if favorited, yellow if not
                      className={`${
                        isFavorited(product.id)
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-yellow-500 hover:bg-yellow-600'
                      } text-white p-2 rounded-md shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                      onClick={() => handleFavoriteClick(product)}
                      // Disable button while request is in progress
                      disabled={favoriting === product.id}
                      // Tooltip text changes based on favorite status
                      title={isFavorited(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {/* Heart icon - filled if favorited, outline if not */}
                      <svg 
                        className="w-5 h-5" 
                        fill={isFavorited(product.id) ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                  {/* ADMIN BUTTONS - edit and delete (visible only to admins) */}
                  {isAdmin && (
                    <>
                      {/* EDIT BUTTON */}
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md shadow-lg transition-colors duration-200"
                        onClick={() => handleEditClick(product.id)}
                        title="Edit"
                      >
                        {/* Edit icon (pencil) */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDeleteClick(product.id)}
                        // Disable button while deletion is in progress
                        disabled={deletingId === product.id}
                        title="Delete"
                      >
                        {/* Delete icon (trash bin) */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* Product info section */}
              <div className="mt-4 flex justify-between">
                <div>
                  {/* Product name */}
                  <h3 className="text-sm text-gray-700">
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  {/* Product category */}
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                </div>
                {/* Product price */}
                <p className="text-sm font-medium text-gray-900">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
