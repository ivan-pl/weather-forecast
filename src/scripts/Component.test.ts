import { Component } from "./Component";

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
        return `<h1>${text} ${this.state.name }</h1>`;
      }
    }

    const cmp = new TestComponent(el);
    expect(el.innerHTML).toBe(`<h1>${text} undefined</h1>`);
    cmp.setState({ name: "Sam" });
    expect(el.innerHTML).toBe(`<h1>${text} Sam</h1>`);
  });
});
