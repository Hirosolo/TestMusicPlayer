"use client";

import { useEffect, useState } from "react";

type Song = {
  id: number;
  title: string;
  artist: string;
  file_url: string;
  cover_url?: string | null;
};

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
    }
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 text-3xl font-bold bg-gray-800 shadow-md">
        🎵 My Music Player
      </header>

      {/* Song List */}
      <main className="flex-1 overflow-y-auto p-6">
        <ul className="space-y-4">
          {songs.map((song) => (
            <li
              key={song.id}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
            >
              {/* Song info */}
              <div className="flex items-center space-x-4">
                {song.cover_url ? (
                  <img
                    src={song.cover_url}
                    alt={song.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-md flex items-center justify-center">
                    🎶
                  </div>
                )}
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={() => {
                  setCurrentSong(song);
                  setIsPlaying(true);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-lg text-black font-semibold"
              >
                ▶ Play
              </button>
            </li>
          ))}
        </ul>
      </main>

      {/* Player Bar */}
      {currentSong && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between">
          {/* Song details */}
          <div className="flex items-center space-x-4">
            {currentSong.cover_url ? (
              <img
                src={currentSong.cover_url}
                alt={currentSong.title}
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center">
                🎶
              </div>
            )}
            <div>
              <p className="font-semibold">{currentSong.title}</p>
              <p className="text-sm text-gray-400">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div>
            <audio
              controls
              autoPlay
              src={currentSong.file_url}
              className="w-64"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </footer>
      )}
    </div>
  );
}
