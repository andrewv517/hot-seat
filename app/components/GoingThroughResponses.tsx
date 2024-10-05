import { socket } from "../socket";
import { Game, PlayerData } from "../types";

export default function GoingThroughResponses({ isInHotSeat, game }: { isInHotSeat: boolean, game: Game }) {
    console.log(game);
    return (
        <div className="mt-3 space-y-3 flex flex-col justify-center">
            <p className="font-semibold text-2xl text-amber-50 text-center">Responses:</p>
            {
                isInHotSeat ?
                    <p
                        className="text-md text-gray-400 text-center"
                    >
                        It's your job to scroll through and read them!
                    </p> :
                    <p
                        className="text-md text-gray-400 text-center"
                    >
                        {game.playerInHotSeat.name} will scroll through them...
                    </p>
            }

            <div className="flex justify-between items-center">
                {
                    isInHotSeat ?
                        <button
                            className="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
                            onClick={() => socket.emit('changeResponseIndex', { index: game.responseIndex - 1, game })}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                        </button> : null
                }

                <div
                    className="bg-slate-400 font-semibold rounded-lg p-2 drop-shadow-xl text-slate-800 text-center w-2/3 m-auto"
                >
                    { game.randomizedPlayers[game.responseIndex].response }
                </div>
                {
                    isInHotSeat ?
                        <button
                            className="bg-neutral-500 p-2 rounded-full drop-shadow-xl h-fit"
                            onClick={() => socket.emit('changeResponseIndex', { index: game.responseIndex + 1, game })}
                        >

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                            </svg>
                        </button> : null
                }
            </div >
            <p className="font-semibold text-md text-slate-400 text-center">{ game.responseIndex + 1 } / { game.players.length }</p>

            {
                isInHotSeat ?
                    <>
                        <p
                            className="font-semibold text-md text-slate-400 text-center"
                        >
                            Once you're done reading, click below.
                        </p>
                        <button
                            className="bg-cyan-500 m-auto p-2 pl-3 pr-3 h-fit text-white font-semibold rounded-lg drop-shadow-xl"
                            onClick={() => socket.emit('doneReading', { game })}
                        >
                            I am done reading
                        </button >
                    </> :
                    null
            }
        </div>
    )
}