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
  title = 'Home Page';
  ngOnInit(): void {
    this.cards = this.service.getData();
    this.cardsType = ['Card 6', 'Card 12'];
  }
  constructor(private route: Router) {}
  private service = inject(SharedService);
  cards!: { [key: string]: Card };
  cardsType!: string[];
  navigate(type: string) {
    let num = type === 'Card 6' ? 6 : 12;
    this.route.navigate(['/card'], {
      queryParams: { card: num },
    });
  }
}
