"use client";

import { useEffect, useRef, useState } from "react";

type Song = {
  id: number;
  title: string;
  artist: string;
  file_url: string;
  cover_url?: string | null;
};

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchSongs() {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
    }
    fetchSongs();
  }, []);

  const currentSong = songs[currentIndex];

  // Update progress bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
    };
  }, [currentSong]);

  const playPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (Number(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 text-3xl font-bold bg-gray-800 shadow-md">
        🎵 My Music Player
      </header>

      {/* Song List */}
      <main className="flex-1 overflow-y-auto p-6">
        <ul className="space-y-4">
          {songs.map((song, index) => (
            <li
              key={song.id}
              className={`flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition ${
                index === currentIndex ? "ring-2 ring-green-500" : ""
              }`}
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

              {/* Select button */}
              <button
                onClick={() => {
                  setCurrentIndex(index);
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
          <div className="flex flex-col items-center w-1/2">
            <div className="flex space-x-6 mb-2">
              <button onClick={prevSong}>⏮</button>
              <button
                onClick={playPause}
                className="px-4 py-2 bg-green-500 hover:bg-green-400 rounded-full text-black"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button onClick={nextSong}>⏭</button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-xs">{formatTime(currentTime)}</span>
              <input
                type="range"
                value={progress}
                onChange={handleSeek}
                className="w-full"
              />
              <span className="text-xs">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src={currentSong.file_url}
            autoPlay={isPlaying}
            onEnded={nextSong}
          />
        </footer>
      )}
    </div>
  );
}
