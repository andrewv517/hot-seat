import { headers, socket } from "../socket";
import { API_URL, Game, PlayerData } from "../types";

export default function AllResponses({ game, player, isInHotSeat }: { game: Game, player: PlayerData, isInHotSeat: boolean }) {
    const amountOfVotes = (p: PlayerData) => {
        let sum = 0;
        for (let i = 0; i < game.players.length; i++) {
            if (game.players[i].vote === p.name) {
                sum++;
            }
        }
        return sum;
    }

    const handleVote = (p: PlayerData) => {
        if (isInHotSeat) return;
        fetch(`${API_URL}/vote`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                socketId: socket.id,
                gameName: game.id,
                playerName: player.name,
                votingForPlayerName: p.name,
            })
        })
    }

    return (
        <div className="space-y-4">
            <p className="font-semibold text-2xl text-slate-400 text-center">
                All Responses:
            </p>
            <div className="grid grid-cols-2 gap-4">
                {
                    game.randomizedPlayers.map((p, index) => (
                        <div
                            className={`bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 ${player.vote === p.name ? 'ring-4 ring-cyan-400' : ''}`}
                            onClick={() => handleVote(p)}
                            key={index}
                        >
                            <span>{p.response}</span>
                            <span className="float-right text-slate-600">{amountOfVotes(p)}</span>
                        </div>
                    ))
                }
            </div>
            <p className="font-semibold text-2xl text-slate-300 text-center">
                {
                    isInHotSeat ?
                        <span>Wait for everyone to vote!</span> :
                        <span>Vote for the response you think was left by {game.playerInHotSeat.name}!</span>
                }
            </p>
            {
                game.seconds > 0 ?
                    <p className="font-semibold text-lg text-slate-400 text-center" v-if="gameState.countdownGoing">
                        {game.seconds} seconds left!
                    </p> :
                    <p className="font-semibold text-lg text-slate-400 text-center">
                        Out of time!
                    </p>
            }

        </div>
    )
}