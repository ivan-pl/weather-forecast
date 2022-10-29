export declare class Component<State = {}> {
  private el;
  state: State;
  events: {
    [key: string]: (ev: Event) => void;
  };
  constructor(el: HTMLElement, initialState?: Partial<State>);
  subscribeToEvents(): void;
  setState(patch: any): void;
  onMount(): void;
  render(): string;
}
