import React, { useState, useCallback } from 'react';
import { Play, Check, Plus, Heart, Star } from 'lucide-react';
import { MovieModal } from '@/components/MovieModal';

// Movie Card Component with Netflix-style icons
export function MovieCard({
  movie,
  size = 'normal',
  watchlist,
  favorites,
  setWatchlist,
  setFavorites,
  session,
  setSelectedMovie
}: {
  movie: any;
  size?: 'normal' | 'large';
  watchlist: any[];
  favorites: any[];
  setWatchlist: React.Dispatch<React.SetStateAction<any[]>>;
  setFavorites: React.Dispatch<React.SetStateAction<any[]>>;
  session: any;
  setSelectedMovie?: (movie: any) => void;
}) {
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Open modal with this movie
  const handleCardClick = () => {
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
  };
  
    

  const isInWatchlist = (watchlist ?? []).some(item => item.id === movie.id);
  const isInFavorites = (favorites ?? []).some(item => item.id === movie.id);

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) return;
    setWatchlistLoading(true);
    try {
      if (isInWatchlist) {
        setWatchlist(prev => prev.filter(item => item.id !== movie.id));
      } else {
        setWatchlist(prev => [...prev, movie]);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
    setWatchlistLoading(false);
  };

  const handleAddToFavorites = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) return;
    setFavoriteLoading(true);
    try {
      if (isInFavorites) {
        setFavorites(prev => prev.filter(item => item.id !== movie.id));
      } else {
        setFavorites(prev => [...prev, movie]);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
    setFavoriteLoading(false);
  };

  const cardClass = size === 'large'
    ? "w-80 h-[450px] flex-shrink-0"
    : "w-64 h-96 flex-shrink-0";

  return (
    <>
    <div
      className={`${cardClass} relative group cursor-pointer transform hover:scale-105 transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleCardClick()}
    >
      <div className="w-full h-full bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-3/4 object-cover"
          />
        ) : (
          <div className="w-full h-3/4 bg-gray-800 flex items-center justify-center">
            <p className="text-white text-center p-4 text-sm">{movie.title ? movie.title : movie.name}</p>
          </div>
        )}

        {/* Movie Info */}
        <div className="p-4 h-1/4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm truncate mb-1">{movie.title ? movie.title : movie.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{movie.release_date?.split('-')[0] ? movie.release_date?.split('-')[0] : movie.first_air_date?.split('-')[0]}</span>
              {movie.vote_average > 0 && (
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                  <span className="text-white text-xs">{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Netflix-style overlay controls */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-3">
              {/* Play Button */}
              <button className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors">
                <Play className="w-5 h-5 fill-current" />
              </button>
              {/* Add to Watchlist */}
              <button
                onClick={handleAddToWatchlist}
                disabled={watchlistLoading}
                className="bg-gray-800/80 text-white p-3 rounded-full hover:bg-gray-700 transition-colors border-2 border-gray-600 hover:border-white"
              >
                {watchlistLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isInWatchlist ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
              {/* Add to Favorites */}
              <button
                onClick={handleAddToFavorites}
                disabled={favoriteLoading}
                className="bg-gray-800/80 text-white p-3 rounded-full hover:bg-gray-700 transition-colors border-2 border-gray-600 hover:border-white"
              >
                {favoriteLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isInFavorites ? 'text-red-500 fill-current' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        )}

      
      </div>
    </div>

    {showModal && (
      <MovieModal movie={movie} onClose={handleClose} />
    )}
    </>
  );


}

// HorizontalScroll component (moved from page.tsx)
export function HorizontalScroll({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4 md:px-16">{title}</h2>
      <div className="flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-zinc-800 px-4 md:px-16 pb-2">
        {children}
      </div>
    </section>
  );
}

export function Section({
  title,
  movies,
  loading,
  watchlist,
  favorites,
  setWatchlist,
  setFavorites,
  session,
  setSelectedMovie
}: {
  title: string;
  movies: any[];
  loading: boolean;
  watchlist: any[];
  favorites: any[];
  setWatchlist: React.Dispatch<React.SetStateAction<any[]>>;
  setFavorites: React.Dispatch<React.SetStateAction<any[]>>;
  session: any;
  setSelectedMovie: (movie: any) => void;
}) {
  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4 md:px-16">{title}</h2>
        <div className="text-center text-gray-400 py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4">Loading amazing content...</p>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 px-4 md:px-16">{title}</h2>
        <div className="text-center text-gray-400 py-20">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-xl">No movies available</p>
          <p className="mt-2">Please check back later or try refreshing the page</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <HorizontalScroll title={title}>
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            watchlist={watchlist}
            favorites={favorites}
            setWatchlist={setWatchlist}
            setFavorites={setFavorites}
            session={session}
            setSelectedMovie={setSelectedMovie}
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}

export function HeroSection({
  popular,
  watchlist,
  setWatchlist
}: {
  popular: any[];
  watchlist: any[];
  setWatchlist: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const featuredMovie = popular[0];
  if (!featuredMovie) return null;

  return (
    <div className="relative h-screen bg-gradient-to-r from-black via-gray-900/50 to-transparent overflow-hidden">
      {featuredMovie.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
          alt={featuredMovie.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
      <div className="relative z-20 flex flex-col justify-center h-full px-4 md:px-16 max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 leading-tight">
          {featuredMovie.title ? featuredMovie.title : featuredMovie.name}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
          {featuredMovie.overview}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center justify-center space-x-3 bg-white text-black px-8 py-4 rounded-lg hover:bg-gray-200 transition duration-200 font-semibold text-lg">
            <Play className="w-6 h-6 fill-current" />
            <span>Play</span>
          </button>
          <button
            onClick={() => {
              if (!watchlist.find(item => item.id === featuredMovie.id)) {
                setWatchlist(prev => [...prev, featuredMovie]);
              }
            }}
            className="flex items-center justify-center space-x-3 bg-gray-800 text-white px-8 py-4 rounded-lg hover:bg-gray-700 border-2 border-gray-600 hover:border-white transition duration-200 font-semibold text-lg"
          >
            <Plus className="w-6 h-6" />
            <span>Add to Watchlist</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function useMovieModal() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setSelectedMovie(null);
    setShowModal(false);
  };

  const openMovieModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  return {
    selectedMovie,
    showModal,
    openMovieModal,
    handleClose,
    MovieModalComponent: () => <MovieModal movie={selectedMovie} onClose={handleClose} />
  };
}