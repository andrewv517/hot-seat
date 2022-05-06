export interface PlayerData {
    name: string,
    number: number,
    response: string,
    vote: PlayerData,
}

export interface GameState {
    players: { [id: string]: PlayerData },
    playerInHotSeat: number,
    responseIndex: number,
    readingCards: boolean,
    countdownGoing: boolean,
    countdownFinished: boolean,
}