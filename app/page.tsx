"use client";

import { useEffect, useState } from "react";
import useSocket from "./hooks/useSocket";
import Modal from "./components/Modal";

interface Game {
  id: string,
  users: string[],
  host: string,
}

export default function Home() {
  const { connected, on, emit } = useSocket();
  const [games, setGames] = useState<Game[]>([])
  const [showingModal, setShowingModal] = useState(false);

  useEffect(() => {
    const getGames = async () => {
      const res = await fetch("localhost:8080/games");
      const json: { games: Game[] } = await res.json();
      setGames(json.games);
    }
    getGames();
  }, [])

  useEffect(() => {
    if (connected) {
      on('gamesInformation', (gameInfo: Game[]) => {
        console.log(gameInfo);
        setGames(gameInfo);
      })
    }
  }, [connected])

  const handleCreateGame = (name: string) => {
    emit('createGame', { name })
    setShowingModal(false);
  }

  // const handleJoin = (game: string) => {
    // setShowingModal(true);
  // }

  return (
    <>
      {
        showingModal ? <Modal onClose={handleCreateGame} /> : null
      }
      <header className="flex justify-center items-center space-x-2 mt-6">
        <h1 className="text-6xl text-amber-50 font-semibold">Hot Seat</h1>
      </header>
      <div className="grid grid-cols-1 w-5/6 sm:w-2/3 m-auto space-y-5 mt-10 text-center">
        <p className="text-2xl text-amber-50 font-semibold">Join a game...</p>
        <div className="grid grid-cols-2 gap-4">
          {
            games.map((game, index) => (
              <div
                key={index}
                className="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 flex flex-row justify-between"
              >
                <div>Host: {game.host}</div>
                <div className="flex flex-row space-x-2 items-center">
                  <span>
                    {game.users.length}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
              </div>
            ))
          }
        </div>
        <p className="text-2xl text-amber-50 font-semibold">Or Create Your Own!</p>
        <button
          className="w-fit m-auto pl-4 pr-4 pt-2 pb-2 rounded-xl text-white drop-shadow-xl bg-cyan-600"
          onClick={() => setShowingModal(true)}
        >
          Create
        </button>
      </div>
    </>

  );
}
