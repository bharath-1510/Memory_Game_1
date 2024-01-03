export class Game {
  id!: number;
  path!: string;
  isVisible!: boolean;
  isFound!: boolean;
  constructor(id: number, path: string) {
    this.path = path;
    this.id = id;
  }
}
