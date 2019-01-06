function syntaxHighlight(json) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="JSON__' + cls + '">' + match + "</span>";
    }
  );
}

function jsonViewer(json, collapsible = false) {
  const TEMPLATES = {
    item:
      '<div class="json__item"><div class="json__key">%KEY%</div><div class="json__value json__value--%TYPE%">%VALUE%</div></div>',
    itemCollapsible:
      '<label class="json__item json__item--collapsible json__item--closed"><input type="checkbox" class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
    itemCollapsibleOpen:
      '<label class="json__item json__item--collapsible json__item--open"><input type="checkbox" checked class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>'
  };

  function createItem(key, value, type) {
    let element = TEMPLATES.item.replace("%KEY%", key);

    if (type == "string") {
      element = element.replace("%VALUE%", '"' + value + '"');
    } else {
      element = element.replace("%VALUE%", value);
    }

    element = element.replace("%TYPE%", type);

    return element;
  }

  function createCollapsibleItem(key, value, type, children) {
    let tpl = "itemCollapsible";

    if (collapsible) {
      tpl = "itemCollapsibleOpen";
    }

    let element = TEMPLATES[tpl].replace("%KEY%", key);

    element = element.replace("%VALUE%", type);
    element = element.replace("%TYPE%", type);
    element = element.replace("%CHILDREN%", children);

    return element;
  }

  function handleChildren(key, value, type) {
    let html = "";

    for (let item in value) {
      let _key = item,
        _val = value[item];

      html += handleItem(_key, _val);
    }

    return createCollapsibleItem(key, value, type, html);
  }

  function handleItem(key, value) {
    let type = typeof value;

    if (typeof value === "object") {
      return handleChildren(key, value, type);
    }

    return createItem(key, value, type);
  }

  function parseObject(obj) {
    _result = '<div class="json">';

    for (let item in obj) {
      let key = item,
        value = obj[item];

      _result += handleItem(key, value);
    }

    _result += "</div>";

    return _result;
  }

  return parseObject(json);
}

// var json = {
//   User: {
//     "Personal Info": {
//       Name: "Eddy",
//       Age: 3
//     },
//     Active: true,
//     Messages: ["Message 1", "Message 2", "Message 3"]
//   },
//   Total: 1
// };

// var el = document.querySelector(".target");
// el.innerHTML = jsonViewer(json, true);
