import { Component } from "./Component";

const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

describe("Component", () => {
  let el: HTMLElement;
  let text: string;

  beforeEach(() => {
    el = document.createElement("div");
    text = Math.random().toString();
  });

  it("returns instatiating", () => {
    class TestComponent extends Component {
      render() {
        return `<h1>${text}</h1>`;
      }
    }

    new TestComponent(el);
    expect(el.innerHTML).toBe(`<h1>${text}</h1>`);
  });

  it("updates html on setState call", () => {
    class TestComponent extends Component {
      render() {
        return `<h1>${text} ${this.state.name}</h1>`;
      }
    }

    const cmp = new TestComponent(el);
    expect(el.innerHTML).toBe(`<h1>${text} undefined</h1>`);
    cmp.setState({ name: "Sam" });
    expect(el.innerHTML).toBe(`<h1>${text} Sam</h1>`);
  });

  it("can instantiate component with initial state", () => {
    class TestComponent extends Component {
      render() {
        return `<h1>${text} ${this.state.name}</h1>`;
      }
    }

    const cmp = new TestComponent(el, { name: "Sam" });
    expect(el.innerHTML).toBe(`<h1>${text} Sam</h1>`);
    cmp.setState({ name: "Bob" });
    expect(el.innerHTML).toBe(`<h1>${text} Bob</h1>`);
  });

  it("handles events based on the mapping", async () => {
    class TestComponent extends Component {
      handleClickH1: (e: Event) => void;

      handleClickH2: (e: Event) => void;

      constructor(...args: ConstructorParameters<typeof Component>) {
        super(...args);
        this.handleClickH1 = jest.fn();
        this.handleClickH2 = jest.fn();

        this.events = {
          "click@h1": this.handleClickH1,
          "click@h2": this.handleClickH2,
        };
      }

      render() {
        return `<h1>${text} ${this.state.name}</h1><h2></h2>`;
      }
    }

    const cmp = new TestComponent(el, { name: "Bob" });
    const h1 = el.querySelector("h1");
    const h2 = el.querySelector("h2");

    await sleep(10);
    h1?.click();
    expect(cmp.handleClickH1).toHaveBeenCalledTimes(1);
    expect(cmp.handleClickH2).not.toHaveBeenCalled();

    h2?.click();
    expect(cmp.handleClickH1).toHaveBeenCalledTimes(1);
    expect(cmp.handleClickH2).toHaveBeenCalledTimes(1);
  });

  it("handles events based on the mapping after rerender", async () => {
    class TestComponent extends Component {
      handleClickH1: (e: Event) => void;

      constructor(...args: ConstructorParameters<typeof Component>) {
        super(...args);
        this.handleClickH1 = jest.fn(() =>
          this.setState({
            counter: this.state.counter + 1,
          })
        );
        this.events = {
          "click@h1": this.handleClickH1,
        };
      }

      render() {
        return `<h1>${this.state.counter}</h1>`;
      }
    }
    const cmp = new TestComponent(el, {
      counter: 3,
    });
    await sleep(10);
    el.querySelector("h1")?.click();
    expect(cmp.handleClickH1).toHaveBeenCalledTimes(1);
    expect(el.innerHTML).toBe(`<h1>4</h1>`);

    el.querySelector("h1")?.click();
    expect(cmp.handleClickH1).toHaveBeenCalledTimes(2);
    expect(el.innerHTML).toBe(`<h1>5</h1>`);
  });

  it("calls .onMount on first rendering only", () => {
    class TestComponent extends Component {
      onMount() {
        this.setState({ name: "Bob" });
      }

      render() {
        return `<h1>${text}${this.state.name}</h1>`;
      }
    }

    const onMountMock = jest.spyOn(TestComponent.prototype, "onMount");

    const cmp = new TestComponent(el);
    expect(el.innerHTML).toBe(`<h1>${text}Bob</h1>`);
    expect(onMountMock).toHaveBeenCalledTimes(1);

    cmp.setState({ name: "Mark" });
    expect(el.innerHTML).toBe(`<h1>${text}Mark</h1>`);
    expect(onMountMock).toHaveBeenCalledTimes(1);
  });
});
