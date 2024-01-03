import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Game } from '../game.model';
import { SharedService } from '../shared.service';
import { Card } from '../card.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card6',
  templateUrl: './card6.component.html',
  styleUrls: ['./card6.component.scss'],
})
export class Card6Component implements OnInit, OnDestroy {
  private service = inject(SharedService);

  box: Game[] = [
    new Game(1, '../../assets/img/game1.png'),
    new Game(2, '../../assets/img/game1.png'),
    new Game(3, '../../assets/img/game2.jpg'),
    new Game(4, '../../assets/img/game2.jpg'),
    new Game(5, '../../assets/img/game3.png'),
    new Game(6, '../../assets/img/game3.png'),
  ];
  openBox: Game[] = [];
  cardStat!: Card;
  ngOnInit(): void {
    this.shuffle(this.box);
    this.cardStat = this.service.getData()['Card 6'];
  }
  ngOnDestroy(): void {
    if (this.cardStat.moves != 0) {
      let rounds = this.cardStat.roundsPlayed + 1;
      this.service.setData(new Card(0, 0, rounds), 'Card 6');
    }
  }
  constructor(private route: Router) {}
  navigate() {
    this.route.navigate(['/']);
  }
  onRestart() {
    if (this.cardStat.moves != 0) {
      let rounds = this.cardStat.roundsPlayed + 1;
      this.service.setData(new Card(0, 0, rounds), 'Card 6');
      this.box = [
        new Game(1, '../../assets/img/game1.png'),
        new Game(2, '../../assets/img/game1.png'),
        new Game(3, '../../assets/img/game2.jpg'),
        new Game(4, '../../assets/img/game2.jpg'),
        new Game(5, '../../assets/img/game3.png'),
        new Game(6, '../../assets/img/game3.png'),
      ];
      this.shuffle(this.box);
      this.openBox = [];
      this.cardStat = this.service.getData()['Card 6'];
    } else {
      this.box = [
        new Game(1, '../../assets/img/game1.png'),
        new Game(2, '../../assets/img/game1.png'),
        new Game(3, '../../assets/img/game2.jpg'),
        new Game(4, '../../assets/img/game2.jpg'),
        new Game(5, '../../assets/img/game3.png'),
        new Game(6, '../../assets/img/game3.png'),
      ];
      this.shuffle(this.box);
      this.openBox = [];
      this.cardStat = this.service.getData()['Card 6'];
    }
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
    setTimeout(() => {
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
