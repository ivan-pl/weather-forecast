export default function template(
  tpl: string,
  data: { [key: string]: any }
): string {
  let newTpl = "";
  newTpl = loopReplace(tpl, data);
  newTpl = ifReplace(newTpl, data);
  newTpl = variableReplace(newTpl, data);

  return newTpl;
}

function variableReplace(tpl: string, data: { [key: string]: any }) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, propName) => {
    if (propName in data) {
      return data[propName];
    }
    return "";
  });
}

function loopReplace(tpl: string, data: { [key: string]: any }) {
  return tpl.replace(
    /\{\{for (\w+)\}\}(.+?)\{\{endfor\}\}/g,
    (_, propName, subTemplate) => {
      if (Array.isArray(data[propName])) {
        return data[propName].reduce(
          (prev: string, item: { [key: string]: any }, ind: number) =>
            prev +
            template(
              subTemplate,
              ind > 0 ? item : { ...item, "--isFirst": true }
            ),
          ""
        );
      }
      return "";
    }
  );
}

function ifReplace(tpl: string, data: { [key: string]: any }) {
  return tpl.replace(
    /\{\{if ((?:--)?\w+)\}\}(.+?)(?:\{\{else\}\}(.+?))?\{\{endif\}\}/g,
    (_, flagName, subTemplateTrue, subTemplateFalse) => {
      return data[flagName]
        ? template(subTemplateTrue, data)
        : template(subTemplateFalse || "", data);
    }
  );
}
