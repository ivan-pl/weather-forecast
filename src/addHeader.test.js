import { addHeader } from "./addHeader";

describe("addHeader", () => {
  it("adds h1 with text = Test", () => {
    const div = document.createElement("div");
    document.body.append(div);
    addHeader(div);
    const h1 = document.querySelector("h1");
    expect(h1.innerText).toBe("Test");
  });
});
