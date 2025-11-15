import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getFavorites, removeFavoriteByProductId } from '../api/favorite.routes';
import LoadingSpinner from '../components/LoadingSpinner';

// Page that lists the current user's favorite products
export default function FavoritesPage() {
  // Local state: array of favorite records
  const [favorites, setFavorites] = useState([]);
  // Loading state while fetching
  const [loading, setLoading] = useState(true);
  // Track which productId is being removed (to disable its button)
  const [removing, setRemoving] = useState(null);

  // Redux: check if user is logged in
  const loggedIn = useSelector((state) => state.user.loggedIn);

  // Fetch favorites when component mounts and when login state changes
  useEffect(() => {
    if (!loggedIn) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      setLoading(true);
      try {
        const res = await getFavorites();
        if (res?.success) {
          setFavorites(res.data || []);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [loggedIn]);

  // Handler to remove favorite by productId (convenience route)
  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      const res = await removeFavoriteByProductId(productId);
      if (res?.success) {
        setFavorites((prev) => prev.filter((f) => f.productId !== productId));
      } else {
        console.error('Failed to remove favorite:', res);
        alert(res?.message || 'Failed to remove favorite');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Error removing favorite');
    } finally {
      setRemoving(null);
    }
  };

  if (!loggedIn) {
    return (
      <div className="bg-white min-h-screen p-8">
        <h2 className="text-2xl font-semibold">Favorites</h2>
        <p className="mt-4 text-gray-600">Please log in to see your favorites.</p>
      </div>
    );
  }

  if (loading) return (
    <div className="bg-white min-h-screen p-8 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="bg-white min-h-screen p-8">
      <h2 className="text-2xl font-semibold mb-6">Produse favorite</h2>
      {favorites.length === 0 ? (
        <div className="text-gray-600">Nu ai produse favorite.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {favorites.map((f) => (
            <div key={f.id || f.productId} className="flex items-center gap-4 border rounded-md p-4">
              <img src={f.image || 'https://via.placeholder.com/120'} alt={f.name} className="w-28 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{f.name}</div>
                <div className="text-sm text-gray-500">{f.category}</div>
                <div className="mt-2 text-sm text-gray-700">{f.description}</div>
                <div className="mt-2 font-bold">{f.price} RON</div>
              </div>
              <div>
                <button
                  onClick={() => handleRemove(f.productId)}
                  disabled={removing === f.productId}
                  className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {removing === f.productId ? 'Se șterge...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
