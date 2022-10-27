import template from "./template";

describe("template", () => {
  const data = {
    NAME: "Bob",
    AGE: "18",
    TEAM: "Core",
    items: [
      { A: 1, B: 2 },
      { A: 11, B: 22 },
      { A: 111, B: 222 },
    ],
  };

  describe("basic data placing", () => {
    it("puts data into placeholders", () => {
      expect(template("Hi, {{NAME}}", data)).toBe("Hi, Bob");
    });

    it("puts empty string into placeholders in no data provided", () => {
      expect(template("Hi, {{NAME}} {{SURNAME}}", data)).toBe("Hi, Bob ");
    });

    it("replaces all placeholders", () => {
      expect(template("Hi, {{NAME}}. My name is {{NAME}} too", data)).toBe(
        "Hi, Bob. My name is Bob too"
      );
    });
  });

  describe("loops", () => {
    it("puts values from list elements inside loop", () => {
      expect(
        template("{{NAME}}{{for items}}{{NAME}},{{endfor}}", {
          NAME: "0 ",
          items: [{ NAME: "1" }, { NAME: "2" }],
        })
      ).toBe("0 1,2,");
    });

    it("handles basic loops", () => {
      expect(template("{{for items}}{{A}},{{endfor}}", data)).toBe("1,11,111,");
    });
  });

  describe("if", () => {
    it("handles basic if", () => {
      expect(
        template("{{if FLAG}},{{NAME}},{{endif}}", { NAME: "A", FLAG: true })
      ).toBe(",A,");
      expect(
        template("{{if FLAG}},{{NAME}},{{endif}}", { NAME: "A", FLAG: false })
      ).toBe("");
      expect(
        template("{{if FLAG}},{{NAME}},{{endif}}s", { NAME: "A", FLAG: false })
      ).toBe("s");
      expect(
        template("{{if FLAG}},{{NAME}},{{endif}}s", { NAME: "A", FLAG: true })
      ).toBe(",A,s");
    });

    it("handles if-else", () => {
      const data = {
        NAME: "A",
        SURNAME: "B",
        FLAG: true,
      };
      expect(
        template("{{if FLAG}},{{NAME}},{{else}}.{{SURNAME}}.{{endif}}!", data)
      ).toBe(",A,!");
      expect(
        template("{{if FLAG}},{{NAME}},{{else}}.{{SURNAME}}.{{endif}}!", {
          ...data,
          FLAG: false,
        })
      ).toBe(".B.!");
    });
  });

  describe("mix if and loop", () => {
    const data = {
      NAME: "Bob",
      friends: [
        {
          NAME: "Sam",
          AGE: 21,
          FLAG: false,
        },
        {
          NAME: "Alice",
          AGE: 23,
          FLAG: true,
        },
      ],
    };

    it("handles with if inside loop", () => {
      expect(
        template(
          `<p>My name is {{NAME}}. And my friend are:</p><ul>{{for friends}}<li>{{NAME}}, {{AGE}} y.o.{{if FLAG}}!{{endif}}</li>{{endfor}}</ul>`,
          data
        )
      ).toBe(
        `<p>My name is Bob. And my friend are:</p><ul><li>Sam, 21 y.o.</li><li>Alice, 23 y.o.!</li></ul>`
      );
    });

    it("supports isFirst inside loop", () => {
      expect(
        template(
          `<p>My name is {{NAME}}. And my friend are:</p><ul>{{for friends}}<li>{{NAME}}, {{AGE}} y.o.{{if --isFirst}}!{{endif}}</li>{{endfor}}</ul>`,
          data
        )
      ).toBe(
        `<p>My name is Bob. And my friend are:</p><ul><li>Sam, 21 y.o.!</li><li>Alice, 23 y.o.</li></ul>`
      );
    });
  });
});
