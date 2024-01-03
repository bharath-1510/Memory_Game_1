import { Injectable } from '@angular/core';
import { Card } from './card.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private data: { [key: string]: Card } = {
    'Card 6': new Card(0, 0, 0),
    'Card 12': new Card(0, 0, 0),
  };
  getData(): any {
    return this.data;
  }
  setData(card: Card, cardType: string) {
    this.data[cardType] = card;
  }
}
