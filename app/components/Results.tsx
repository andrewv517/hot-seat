import { socket } from "../socket";
import { Game } from "../types";

export default function Results({ game, isInHotSeat }: { game: Game, isInHotSeat: boolean }) {
    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <p className="font-semibold text-2xl text-slate-400 text-center">
                {game.playerInHotSeat.name} wrote <span className="text-green-600">{game.playerInHotSeat.response}</span>
            </p>
            <p className="font-semibold text-2xl text-slate-300 text-center underline">
                Leaderboard
            </p>

            <div className="w-full space-y-4">
                {
                    [...game.players]
                        .sort((a, b) => b.points - a.points)
                        .map((p, index) => (
                            <div className="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 flex flex-row justify-between items-center">
                                <span className="w-1/6">{index + 1}.</span>
                                <span className="w-1/2 text-left">
                                    {p.name}
                                </span>
                                <span className="bg-slate-500 px-2 py-1 text-gray-300 rounded-lg">Response: {p.response}</span>
                                <span className="w-1/3 flex justify-end">{p.points}pts</span>
                            </div>
                        ))
                }
            </div>


            {
                isInHotSeat ?
                    <button
                        className="bg-green-500 text-white w-fit font-semibold py-2 px-4 drop-shadow-xl rounded-lg"
                        onClick={() => socket.emit('nextRound', { game })}
                    >
                        Next round
                    </button> : null
            }

        </div>
    )
}