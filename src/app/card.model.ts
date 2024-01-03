export class Card {
  moves!: number;
  misses!: number;
  roundsPlayed!: number;
  constructor(moves: number, misses: number, roundsPlayed: number) {
    this.moves = moves;
    this.misses = misses;
    this.roundsPlayed = roundsPlayed;
  }
}
