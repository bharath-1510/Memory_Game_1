export class Card {
  moves!: number;
  misses!: number;
  roundsPlayed!: number;
  accuracy!: number;
  constructor(
    moves: number,
    misses: number,
    roundsPlayed: number,
    acc: number
  ) {
    this.moves = moves;
    this.misses = misses;
    this.roundsPlayed = roundsPlayed;
    this.accuracy = acc;
  }
}
