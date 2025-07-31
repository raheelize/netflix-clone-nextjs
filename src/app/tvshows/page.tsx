"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Search, Play, Plus, Check, Star, LogOut, User, Heart, Bookmark, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScroll, useDrag } from 'react-use-gesture';
import { animated } from '@react-spring/web';
import { MovieCard, useMovieModal } from '../_components';
import { useSession, signOut } from 'next-auth/react';
import { Navigation } from '../Navigation';


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'demo_key';

const ENDPOINTS = {
  nowPlaying: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=2&sort_by=popularity.desc&api_key=${API_KEY}`,
  topRated: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=3&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200&api_key=${API_KEY}`,
  popular: `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=2&sort_by=popularity.desc&api_key=${API_KEY}`,
  search: (query) => `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&api_key=${API_KEY}`,
};

interface Movie {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  first_air_date: string;
}


function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

function NetflixClone() {
  const isClient = useIsClient();
  const { data: session, status } = useSession();
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openMovieModal, MovieModalComponent } = useMovieModal();
  
  // Movie data states
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);

  // Shuffle mockMovies for popular only on the client to avoid hydration mismatch
  useEffect(() => {
    if (API_KEY === 'demo_key' && popular.length && popular === mockMovies) {
      setPopular([...mockMovies].sort(() => Math.random() - 0.5));
    }
  }, [popular]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  
  // User lists
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Search input ref
  const searchInputRef = useRef(null);

  // Mock data fallback for demo
  const mockMovies = [
    {
      id: 1,
      name: "The Shawshank Redemption",
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      poster_path: "/q6y0Go1G1c4L8WKQ0YW0aXbfVkB.jpg",
      backdrop_path: "/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
      vote_average: 9.3,
      first_air_date: "1994-09-23"
    },
    {
      id: 2,
      name: "The Godfather",
      overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
      vote_average: 9.2,
      first_air_date: "1972-03-14"
    },
    {
      id: 3,
      name: "The Dark Knight",
      overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/ybHkyRU2PcqncrMoMYK2gYO7IE.jpg",
      vote_average: 9.0,
      first_air_date: "2008-07-16"
    }
  ];

  // Fetch movies on component mount
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setApiError(false);
      
      try {
        if (API_KEY === 'demo_key') {
          // Use mock data for demo
          setNowPlaying(mockMovies);
          setTopRated([...mockMovies].sort((a, b) => b.vote_average - a.vote_average));
          setPopular(mockMovies);
          setLoading(false);
          return;
        }

        // Real API calls
        const [npResponse, trResponse, popResponse] = await Promise.all([
          fetch(ENDPOINTS.nowPlaying),
          fetch(ENDPOINTS.topRated),
          fetch(ENDPOINTS.popular),
        ]);

        if (!npResponse.ok || !trResponse.ok || !popResponse.ok) {
          throw new Error('API request failed');
        }

        const [np, tr, pop] = await Promise.all([
          npResponse.json(),
          trResponse.json(),
          popResponse.json(),
        ]);

        setNowPlaying(np.results || []);
        setTopRated(tr.results || []);
        setPopular(pop.results || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setApiError(true);
        setNowPlaying([]);
        setTopRated([]);
        setPopular([]);
      }
      setLoading(false);
    }
    
    fetchMovies();
  }, []);

  // Search functionality with debounce
  useEffect(() => {
    const searchMovies = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        if (API_KEY === 'demo_key') {
          // Mock search with local data
          const filtered = mockMovies.filter(movie => 
            movie.name.toLowerCase().includes(search.toLowerCase())
          );
          setSearchResults(filtered);
        } else {
          const response = await fetch(ENDPOINTS.search(search));
          if (!response.ok) throw new Error('Search failed');
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 500);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setCurrentView('search');
    }
  };

  // Horizontal scroll functions
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Section Component with horizontal scroll
  function Section({ title, movies, loading }) {
    const ref = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
      if (ref.current) {
        const { scrollLeft, scrollWidth, clientWidth } = ref.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    useEffect(() => {
      const currentRef = ref.current;
      if (currentRef) {
        currentRef.addEventListener('scroll', checkScroll);
        checkScroll(); // Initial check
      }
      return () => {
        if (currentRef) {
          currentRef.removeEventListener('scroll', checkScroll);
        }
      };
    }, [movies]);

    if (loading) {
      return (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 px-4">{title}</h2>
          <div className="flex space-x-4 px-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 h-36 md:h-44 lg:h-56 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      );
    }

    if (!movies || movies.length === 0) return null;

    return (
      <div className="relative mb-12 group">
        <h2 className="text-xl font-bold text-white mb-4 px-4">{title}</h2>
        
        {showLeftArrow && (
          <button 
            onClick={() => scrollLeft(ref)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-full flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        
        <div 
          ref={ref}
          className="flex space-x-4 px-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: 'smooth', scrollbarColor: 'transparent transparent' }}
        >
          {movies.map(movie => (
            <MovieCard
            key={movie.id}
            movie={movie}
            watchlist={watchlist}
            favorites={favorites}
            setWatchlist={setWatchlist}
            setFavorites={setFavorites}
            session={session}
            setSelectedMovie={openMovieModal}
          />
          ))}
        </div>
        
        {showRightArrow && (
          <button 
            onClick={() => scrollRight(ref)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-12 h-full flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>
    );
  }

  // Hero Section Component
  const HeroSection = () => {
    const featuredMovie = popular[0];
    if (!featuredMovie) return null;

    return (
      <div className="relative h-[75vh] min-h-[500px] bg-gradient-to-r from-black via-gray-900/50 to-transparent overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
        
        {featuredMovie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <div className="relative z-20 flex flex-col justify-center h-full px-4 md:px-16 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {featuredMovie.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl line-clamp-3">
            {featuredMovie.overview}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center space-x-3 bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-semibold text-lg">
              <Play className="w-6 h-6 fill-current" />
              <span>Play</span>
            </button>
            <button 
              onClick={() => {
                if (!watchlist.find(item => item.id === featuredMovie.id)) {
                  setWatchlist(prev => [...prev, featuredMovie]);
                }
              }}
              className="flex items-center justify-center space-x-3 bg-gray-600/70 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold text-lg"
            >
              <Plus className="w-6 h-6" />
              <span>My List</span>
            </button>
          </div>
        </div>
      </div>
    );
  };


  // Main render logic
  if (status === 'unauthenticated') {
    // Do not render anything if not authenticated
    return null;
  }
  if (!session) {
    // Optionally, render a loading spinner while session is loading
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleSearch={handleSearch}
        searchInputRef={searchInputRef}
        search={search}
        setSearch={setSearch}
        session={session}
        handleSignOut={() => signOut({ callbackUrl: '/' })}
      />
      
      

      <main className="">
          <HeroSection />
          <div className="space-y-8 pb-20 px-4 md:px-8">
            <Section title="Now Playing" movies={nowPlaying} loading={loading} />
            <Section title="Top Rated" movies={topRated} loading={loading} />
            <Section title="Popular" movies={popular} loading={loading} />
          </div>
      </main>
    </div>
  );
};

import ProtectedRoute from '../ProtectedRoute';

export default function ProtectedHomePage() {
  return (
    <ProtectedRoute>
      <NetflixClone />
    </ProtectedRoute>
  );
}