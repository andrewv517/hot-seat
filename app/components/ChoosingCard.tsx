import { headers, socket } from "../socket";
import { API_URL, Game } from "../types";

export default function ChoosingCard({ game, isInHotSeat }: { game: Game, isInHotSeat: boolean }) {

    function choseCard() {
        fetch(`${API_URL}/choseCard`, {
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
                isInHotSeat ?
                    <div className="flex justify-center flex-col space-y-5 mt-5">
                        <p className="font-semibold text-xl text-amber-50 text-center">Choose a card, then click when you&#39;re ready</p>
                        <button
                            className="bg-green-500 text-white m-auto w-fit font-semibold p-3 pl-4 pr-4 drop-shadow-xl rounded-lg"
                            onClick={choseCard}
                        >
                            I chose my card
                        </button>
                    </div> :
                    <div className="flex justify-center flex-col space-y-5 mt-5">
                        <p className="font-semibold text-2xl text-amber-50 text-center">
                            Wait for {game.playerInHotSeat.name} to choose a card!
                        </p>
                    </div>
            }
        </div>
    )
}
