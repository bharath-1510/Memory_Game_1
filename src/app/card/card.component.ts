import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../card.model';
import { Game } from '../game.model';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, OnDestroy, AfterViewInit {
  private service = inject(SharedService);
  private cards: { [key: string]: Game[] } = {
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
  title!: string;
  cardType!: number;
  cardName!: string;
  foundCount: number = 0;
  acc1: number = 0;
  box!: Game[];
  openBox: Game[] = [];
  cardStat!: Card;
  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      this.cardType = params['card'];
    });
    this.title =
      this.cardType == 6 ? '6 Cards Memory Game' : '12 Cards Memory Game';
    this.cardName = this.cardType == 6 ? 'Card 6' : 'Card 12';
    this.box = this.cards[this.cardName];
    this.shuffle(this.box);
    this.cardStat = this.service.getData()[this.cardName];
    let rounds = this.cardStat.roundsPlayed;
    let acc = this.cardStat.accuracy;
    if (rounds !== 0) this.acc1 = Math.round(acc / rounds);
  }
  ngOnDestroy(): void {
    if (this.cardStat.moves != 0) {
      let rounds = this.cardStat.roundsPlayed + 1;
      let acc = this.cardStat.accuracy;
      if (this.foundCount == Math.round(this.cardType / 2)) acc = acc + 100;
      this.acc1 = Math.round(acc / rounds);
      this.service.setData(new Card(0, 0, rounds, acc), this.cardName);
    }
  }
  constructor(private route: Router, private router: ActivatedRoute) {}
  ngAfterViewInit(): void {
    const gameSize = document.getElementById('game-container') as HTMLElement;
    gameSize.style.width = this.cardType == 6 ? '400px' : '500px';
    gameSize.style.margin = this.cardType == 6 ? '50px auto' : '0px auto';
  }

  onRestart() {
    if (this.foundCount != 0) {
      let rounds = this.cardStat.roundsPlayed + 1;
      let acc = this.cardStat.accuracy;
      if (this.foundCount == Math.round(this.cardType / 2)) acc = acc + 100;
      this.acc1 = Math.round(acc / rounds);
      this.service.setData(new Card(0, 0, rounds, acc), this.cardName);
      this.box =
        this.cardType == 6
          ? [
              new Game(1, '../../assets/img/game1.png'),
              new Game(2, '../../assets/img/game1.png'),
              new Game(3, '../../assets/img/game2.jpg'),
              new Game(4, '../../assets/img/game2.jpg'),
              new Game(5, '../../assets/img/game3.png'),
              new Game(6, '../../assets/img/game3.png'),
            ]
          : [
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
      this.cards[this.cardName] = this.box;
      this.shuffle(this.box);
      this.openBox = [];
      this.foundCount = 0;
      this.cardStat = this.service.getData()[this.cardName];
      console.log(this.box);
    } else {
      let rounds = this.cardStat.roundsPlayed;
      let acc = this.cardStat.accuracy;
      this.service.setData(new Card(0, 0, rounds, acc), this.cardName);
      this.box =
        this.cardType == 6
          ? [
              new Game(1, '../../assets/img/game1.png'),
              new Game(2, '../../assets/img/game1.png'),
              new Game(3, '../../assets/img/game2.jpg'),
              new Game(4, '../../assets/img/game2.jpg'),
              new Game(5, '../../assets/img/game3.png'),
              new Game(6, '../../assets/img/game3.png'),
            ]
          : [
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
      this.cards[this.cardName] = this.box;

      this.shuffle(this.box);
      this.openBox = [];
      this.cardStat = this.service.getData()[this.cardName];
    }
  }
  onClick(game: Game) {
    if (game != undefined && this.openBox.length != 2) {
      this.box.filter((x) => {
        if (x.id === game.id) game.isVisible = true;
      });
      this.openBox.push(game);
    }
  }
  navigate() {
    this.route.navigate(['/']);
  }
  onSection() {
    this.checkEquality();
  }

  async checkEquality() {
    if (this.openBox != undefined) {
      if (this.openBox.length === 2) {
        await sleep(2000);
        let box1 = this.openBox[0];
        let box2 = this.openBox[1];
        if (box1.path == box2.path) {
          this.box.filter((x) => {
            if (x.path === box1.path) x.isFound = true;
          });
          this.foundCount++;
          if (this.foundCount == Math.round(this.cardType / 2)) {
            this.onRestart();
            return;
          }
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
  shuffle = (array: Game[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
}
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
