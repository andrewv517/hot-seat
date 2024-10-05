export interface PlayerData {
  socketId: string,
  name: string,
  points: number,
  response: string | undefined,
  vote: PlayerData | undefined,
}

export interface Game {
  id: string,
  players: PlayerData[],
  randomizedPlayers: PlayerData[],
  host: PlayerData,
  playerInHotSeat: PlayerData,
  responseIndex: number,
  readingCards: boolean,
  countdownGoing: boolean,
  countdownFinished: boolean,
  started: boolean,
  choseCard: boolean,
  seconds: number,
}

export const API_URL = 'https://hotseatapi.andrewvadeika.com'
export const COOKIE_NAME = 'hot-seat-cookie';