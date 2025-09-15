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

  // Fetch songs from API
  useEffect(() => {
    async function fetchSongs() {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
    }
    fetchSongs();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎵 Demo Music Player</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {songs.map((song) => (
          <li
            key={song.id}
            style={{
              marginBottom: "1rem",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <strong>{song.title}</strong> — {song.artist}
            <div>
              <button
                style={{ marginTop: "0.5rem", padding: "0.3rem 0.8rem" }}
                onClick={() => setCurrentSong(song)}
              >
                ▶ Play
              </button>
            </div>
          </li>
        ))}
      </ul>

      {currentSong && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Now Playing: {currentSong.title}</h2>
          <audio controls autoPlay src={currentSong.file_url} />
        </div>
      )}
    </div>
  );
}
