export class Component {
  events: { [key: string]: (e: Event) => void } = {};

  constructor(
    private root: HTMLElement,
    public state: { [key: string]: any } = {}
  ) {
    root.innerHTML = this.render();
    Promise.resolve().then(() => this.subscribeToEvents());
  }

  render() {
    return "";
  }

  setState(patch: any): void {
    this.state = { ...this.state, ...patch };
    this.root.innerHTML = this.render();
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    for (let [eventDesc, handler] of Object.entries(this.events)) {
      const [event, query] = eventDesc.split("@");
      const emitter = this.root.querySelector(query);
      emitter?.addEventListener(event, handler);
    }
  }
}
