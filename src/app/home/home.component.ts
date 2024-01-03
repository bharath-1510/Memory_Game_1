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
    this.cardsType = ['Card6', 'Card12'];
  }
  constructor(private route: Router) {}
  private service = inject(SharedService);
  cards!: { [key: string]: Card };
  cardsType!: string[];
  navigate(page: string) {
    this.route.navigate(['/' + page]);
  }
}
