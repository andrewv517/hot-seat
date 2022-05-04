export interface PlayerData {
    name: string,
    number: number,
    response: string,
}

export interface GameState {
    players: { [id: string]: PlayerData },
    playerInHotSeat: number,
    responseIndex: number,
    readingCards: boolean,
}