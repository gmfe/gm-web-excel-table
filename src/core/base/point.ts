

export class Point2D {
  public x: number;
  public y: number;

  constructor(x?: number, y?: number) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
  }
  
  public distanceTo(point: Point2D) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
  }
}