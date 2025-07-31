// "use client";
// import { useEffect, useState } from "react";

// function MovieCard({ movie, onRemove }: { movie: any; onRemove: (id: string) => void }) {
//   const [removing, setRemoving] = useState(false);
//   const [error, setError] = useState("");
//   const handleRemove = async () => {
//     setRemoving(true);
//     setError("");
//     try {
//       const res = await fetch("/api/watchlist", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ movieId: movie.id }),
//       });
//       if (!res.ok) throw new Error("Failed to remove");
//       onRemove(movie.id);
//     } catch (err: any) {
//       setError(err.message);
//     }
//     setRemoving(false);
//   };
//   return (
//     <div className="bg-zinc-900 rounded overflow-hidden shadow hover:scale-105 transition-transform flex flex-col">
//       {movie.poster && (
//         <img
//           src={`https://image.tmdb.org/t/p/w300${movie.poster}`}
//           alt={movie.title}
//           className="w-full h-44 object-cover"
//         />
//       )}
//       <div className="p-2 flex-1 flex flex-col justify-between">
//         <div>
//           <div className="font-bold text-sm truncate">{movie.title}</div>
//           <div className="text-xs text-gray-400">{movie.release}</div>
//         </div>
//         <button
//           className="w-full mt-2 py-1 rounded text-sm font-bold bg-red-700 hover:bg-red-800"
//           onClick={handleRemove}
//           disabled={removing}
//         >
//           {removing ? "Removing..." : "Remove from Watchlist"}
//         </button>
//         {error && <div className="text-xs text-red-400">{error}</div>}
//       </div>
//     </div>
//   );
// }

// // import ProtectedRoute from '../ProtectedRoute';

// import React, { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useMovieModal, MovieCard } from '../_components';
// import { Bookmark } from 'lucide-react';

// export default function WatchlistPage() {
//   const [watchlist, setWatchlist] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { data: session } = useSession();
//   const { openMovieModal } = useMovieModal();

//   useEffect(() => {
//     async function fetchWatchlist() {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch("/api/watchlist");
//         if (!res.ok) throw new Error("Not authenticated or error fetching");
//         const data = await res.json();
//         setWatchlist(data.map((entry: any) => entry.movie));
//       } catch (err: any) {
//         setError(err.message);
//       }
//       setLoading(false);
//     }
//     fetchWatchlist();
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white font-sans px-4 md:px-8 max-w-7xl mx-auto py-15">
//       <h1 className="text-2xl font-bold text-white mb-8">My Watchlist</h1>
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//         </div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : watchlist.length > 0 ? (
//         <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-20">
//           {watchlist.map((movie: any) => (
//             <MovieCard
//               key={movie.id}
//               movie={movie}
//               setSelectedMovie={openMovieModal}
//               watchlist={watchlist}
//               setWatchlist={setWatchlist}
//               favorites={[]}
//               setFavorites={() => {}}
//               session={session}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center text-gray-400 mt-16">
//           <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-50" />
//           <p className="text-xl">Your watchlist is empty</p>
//           <p className="mt-2">Add movies to watch them later</p>
//         </div>
//       )}
//     </div>
//   );
// }
//   const [watchlist, setWatchlist] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchWatchlist() {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch("/api/watchlist");
//         if (!res.ok) throw new Error("Not authenticated or error fetching");
//         const data = await res.json();
//         setWatchlist(data.map((entry: any) => entry.movie));
//       } catch (err: any) {
//         setError(err.message);
//       }
//       setLoading(false);
//     }
//     fetchWatchlist();
//   }, []);

//   const handleRemove = (id: string) => {
//     setWatchlist(watchlist => watchlist.filter(m => m.id !== id));
//   };

//   return (
//     <div className="bg-black min-h-screen text-white font-sans pb-20 px-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-extrabold text-red-600 tracking-tight py-8">My Watchlist</h1>
//       {loading && <div className="text-gray-400">Loading...</div>}
//       {error && <div className="text-red-500">{error}</div>}
//       {!loading && !error && watchlist.length === 0 && (
//         <div className="text-gray-400">No movies in your watchlist.</div>
//       )}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         {watchlist.map(movie => (
//           <MovieCard key={movie.id} movie={movie} onRemove={handleRemove} />
//         ))}
//       </div>
//     </div>
//   );
// }
