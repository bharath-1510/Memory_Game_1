import { Injectable } from '@angular/core';
import { Card } from './card.model';
import { Game } from './game.model';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private data: { [key: string]: Game[] } = {
    'Card 6': [
      new Game(1, '../../assets/img/game1.png'),
      new Game(2, '../../assets/img/game1.png'),
      new Game(3, '../../assets/img/game2.jpg'),
      new Game(4, '../../assets/img/game2.jpg'),
      new Game(5, '../../assets/img/game3.png'),
      new Game(6, '../../assets/img/game3.png'),
    ],
    'Card 12': [
      new Game(1, '../../assets/img/game1.png'),
      new Game(2, '../../assets/img/game1.png'),
      new Game(3, '../../assets/img/game2.jpg'),
      new Game(4, '../../assets/img/game2.jpg'),
      new Game(5, '../../assets/img/game3.png'),
      new Game(6, '../../assets/img/game3.png'),
      new Game(7, '../../assets/img/game4.jpg'),
      new Game(8, '../../assets/img/game4.jpg'),
      new Game(9, '../../assets/img/game5.jpg'),
      new Game(10, '../../assets/img/game5.jpg'),
      new Game(11, '../../assets/img/game6.jpg'),
      new Game(12, '../../assets/img/game6.jpg'),
    ],
  };
  getData(): any {
    return this.data;
  }
  setData(game: Game[], cardType: string) {
    this.data[cardType] = game;
  }
}
