import { Component, OnInit, inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { Card } from '../card.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.cards = this.service.getData();
    this.cardsType = ['Card 6', 'Card 12'];
    this.cardRoute = ['card6', 'card12'];
  }
  constructor(private route: Router) {}
  private service = inject(SharedService);
  cards!: { [key: string]: Card };
  cardRoute!: string[];
  cardsType!: string[];
  navigate(type: string) {
    let page = this.cardRoute[this.cardsType.indexOf(type)];
    this.route.navigate(['/' + page]);
  }
}
