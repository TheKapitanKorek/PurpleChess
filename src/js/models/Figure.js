export default class Figure {
  constructor(color, position, type, id) {
    this.color = color;
    this.position = { x: position[0], y: position[1] };
    this.type = type;
    this.id = id;
  }
}
