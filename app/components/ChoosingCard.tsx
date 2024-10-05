import { socket } from "../socket";
import { Game } from "../types";

export default function ChoosingCard({ game, isInHotSeat }: { game: Game, isInHotSeat: boolean }) {
    return (
        <div>
            {
                isInHotSeat ?
                    <div className="flex justify-center flex-col space-y-5 mt-5">
                        <p className="font-semibold text-xl text-amber-50 text-center">Choose a card, then click when you're ready</p>
                        <button
                            className="bg-green-500 text-white m-auto w-fit font-semibold p-3 pl-4 pr-4 drop-shadow-xl rounded-lg"
                            onClick={() => socket.emit('choseCard', { game })}
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