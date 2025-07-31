import { Heart, Play, Plus, X } from "lucide-react";

type MovieModalProps = {
  movie: any;
  onClose: any;
};

export const MovieModal = ({ movie, onClose }: MovieModalProps) => (

    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </button>
          {movie.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="h-80 bg-gradient-to-b from-gray-600 to-gray-800 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-white text-center px-4">{movie.title ? movie.title : movie.name}</h2>
            </div>
          )}
          <div className="absolute bottom-4 left-8">
            <h2 className="text-4xl font-bold text-white mb-4">{movie.title ? movie.title : movie.name}</h2>
          </div>
        </div>
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-6">
            <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 font-semibold">
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </button>
            <button className="p-3 rounded-full border-2 border-gray-600 hover:border-white transition-colors">
              <Plus className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 rounded-full border-2 border-gray-600 hover:border-white transition-colors">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {movie.overview}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-gray-400">Rating: </span>
                <span className="text-white font-semibold">{movie.vote_average}/10</span>
              </div>
              <div>
                <span className="text-gray-400">Release Date: </span>
                <span className="text-white font-semibold">{movie.release_date ? movie.release_date : movie.first_air_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );