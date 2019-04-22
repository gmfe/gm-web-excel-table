


export class ISize{
  public width: number;
  public height: number;

  constructor(width?: number, height?: number) {
    this.width = width === undefined ? 0 : width;
    this.height = height === undefined ? 0 : height;
  }
}