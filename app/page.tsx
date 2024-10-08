"use client";

import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import LandingPage from "./components/LandingPage";
import { API_URL, COOKIE_NAME, Game, PlayerData } from "./types";
import GameScreen from "./components/GameScreen";
import { socket } from "./socket";
import { useCookies } from "react-cookie";


export default function Home() {
  const [game, setGame] = useState<Game | undefined>();
  const [player, setPlayer] = useState<PlayerData | undefined>()
  const [cookies, setCookie, removeCookie] = useCookies([COOKIE_NAME]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on('player', (playerData: PlayerData) => {
      setPlayer(playerData);
    })

    const returnToGame = async () => {
      const oldName = cookies["hot-seat-cookie"];
      console.log({ name: oldName });
      if (oldName) {
        const res = await fetch(`${API_URL}/game?name=${oldName}`);
        const json: { game: Game | undefined, player: PlayerData | null } = await res.json();
        if (json.game && json.player) {
          socket.emit('rejoin', { game: json.game });
          setGame(json.game);
          setPlayer(json.player);
        } else {
          removeCookie(COOKIE_NAME);
        }
      } else {
        removeCookie(COOKIE_NAME);
      }
      setLoading(false);
    }

    socket.on('gameState', ({ game }: { game: Game | undefined }) => {
      setGame(game);
      if (game) {
        // update player
        setPlayer(prevPlayer => game.players.find(p => p.name === prevPlayer?.name))
      }
    });

    returnToGame();
  }, []);


  if (loading) {
    return <div className="flex justify-center items-center mt-10 relative">
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>;
  }

  return (
    <>
      {
        game && player ?
          <GameScreen game={game} player={player} /> :
          <LandingPage />
      }
    </>

  );
}
