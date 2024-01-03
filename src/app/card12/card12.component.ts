import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Game } from '../game.model';
import { SharedService } from '../shared.service';
import { Card } from '../card.model';

@Component({
  selector: 'app-card12',
  templateUrl: './card12.component.html',
  styleUrls: ['./card12.component.scss'],
})
export class Card12Component implements OnInit, OnDestroy {
  private service = inject(SharedService);
  cardStat!: Card;
  box: Game[] = [
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
  ];
  openBox: Game[] = [];
  ngOnDestroy(): void {
    if (this.cardStat.moves != 0) {
      let rounds = this.cardStat.roundsPlayed + 1;
      this.service.setData(new Card(0, 0, rounds), 'Card12');
    }
  }

  ngOnInit(): void {
    this.shuffle(this.box);
    this.cardStat = this.service.getData().Card12;
  }

  onClick(game: Game) {
    if (game != undefined) {
      this.box.filter((x) => {
        if (x.id === game.id) game.isVisible = true;
      });
      this.openBox.push(game);
    }
  }

  onSection() {
    setInterval(() => {
      this.checkEquality();
    }, 2000);
  }
  shuffle = (array: Game[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  checkEquality() {
    if (this.openBox != undefined) {
      if (this.openBox.length === 2) {
        let box1 = this.openBox[0];
        let box2 = this.openBox[1];
        if (box1.path == box2.path) {
          this.box.filter((x) => {
            if (x.path === box1.path) x.isFound = true;
          });
        } else {
          this.cardStat['misses']++;
        }
        this.cardStat['moves']++;
        this.box.filter((x) => {
          if (x.id === box1.id) x.isVisible = false;
          if (x.id === box2.id) x.isVisible = false;
        });
        this.openBox = [];
      }
    }
  }
}
