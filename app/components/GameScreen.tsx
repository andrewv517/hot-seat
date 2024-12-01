import { headers, socket } from "../socket";
import { API_URL, Game, PlayerData } from "../types";
import Lobby from "./Lobby";
import ChoosingCard from "./ChoosingCard";
import WaitingForResponses from "./WaitingForResponses";
import EnteringResponses from "./EnteringResponses";
import GoingThroughResponses from "./GoingThroughResponses";
import AllResponses from "./AllResponses";
import Results from "./Results";

export default function GameScreen({ game, player }: { game: Game, player: PlayerData }) {
    const isInHotSeat = () => {
        return player.name === game.playerInHotSeat.name;
    }
    function renderScreen() {
        if (!game.choseCard) {
            return <ChoosingCard game={game} isInHotSeat={isInHotSeat()} />
        } else if (!player.response) {
            return <EnteringResponses isInHotSeat={isInHotSeat()} game={game} player={player} />
        } else if (game.players.filter(p => !p.response).length > 0) {
            return <WaitingForResponses game={game} />
        } else if (game.readingCards) {
            return <GoingThroughResponses isInHotSeat={isInHotSeat()} game={game} />
        } else if (game.seconds > 0) {
            return <AllResponses game={game} player={player} isInHotSeat={isInHotSeat()} />
        }
        return <Results game={game} isInHotSeat={isInHotSeat()} />
    }

    function handleEnd() {
        fetch(`${API_URL}/end`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                gameName: game.id,
            })
        })
    }

    return (
        <div>
            {
                game.host.name === player.name ?
                    <button className="absolute bottom-0 right-0 m-3 p-2 pl-4 pr-4 rounded-xl drop-shadow-lg bg-red-500 font-semibold" onClick={handleEnd}>Delete</button>
                    : null
            }
            {
                game.started ?
                    <div className="flex justify-center items-center flex-col mx-auto mt-5 w-5/6 sm:w-2/3 md:w-1/3">

                        {
                            isInHotSeat() ? <p
                                className="font-semibold text-2xl text-center text-amber-50"
                            >
                                {player.name}, you are in the <span className="text-red-400">hot seat</span>!
                            </p> : null
                        }

                        {
                            renderScreen()
                        }


                    </div> : <Lobby game={game} player={player} />
            }
        </div>
    )
}
