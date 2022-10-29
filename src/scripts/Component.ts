export class Component {
  constructor(
    private el: HTMLElement,
    public state: { [key: string]: any } = {}
  ) {
    el.innerHTML = this.render();
  }

  render() {
    return "";
  }

  setState(patch: any): void {
    this.state = { ...this.state, ...patch };
    this.el.innerHTML = this.render();
  }
}
