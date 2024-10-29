const fs = require("fs");
const { JSDOM } = require("jsdom");

const ar_path = "src/CairoUrbanNews/articles/arabic";
const ota_path = "src/CairoUrbanNews/articles/ottoman";
if (!fs.existsSync(`${ar_path}/pages`)) {
  fs.mkdirSync(`${ar_path}/pages`);
}
if (!fs.existsSync(`${ota_path}/pages`)) {
  fs.mkdirSync(`${ota_path}/pages`);
}

splitDir(ar_path);
splitDir(ota_path);

function splitDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    for (const filepath of files) {
      if(!filepath.endsWith("xml")) {
        continue;
      }
      const file = fs.readFileSync(`${dir}/${filepath}`, 'utf8');
      const jdom = new JSDOM(file, { contentType: "text/xml" });
      if (!jdom.window.document.querySelector("TEI")) {
        continue; 
      }
      const divs = jdom.window.document.querySelectorAll("TEI > text > body > div");
      let i = 0;
      for (const div of divs) {
        i++;
        const dom = new JSDOM();
        const root = dom.window.document.createElement("TEI");
        root.setAttribute("xmlns", "http://www.tei-c.org/ns/1.0");
        const head = jdom.window.document.querySelector("TEI > teiHeader");
        root.appendChild(dom.window.document.importNode(head, true));
        const text = dom.window.document.createElementNS("http://www.tei-c.org/ns/1.0", "text");
        text.setAttribute("xml:lang", "ar");
        text.appendChild(dom.window.document.importNode(div, true));
        root.appendChild(text);
        fs.writeFileSync(`${dir}/pages/${filepath.replace(/\.xml/, '')}-${i}.xml`, serialize(root), 'utf8');
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function serialize(el) {
  let str = "";
  const ignorable = (txt) => {
    return !(/[^\t\n\r ]/.test(txt));
  }
  if (el.nodeType === 9 || el.nodeType === 11) { // nodeType 9 is Node.DOCUMENT_NODE; nodeType 11 is Node.DOCUMENT_FRAGMENT_NODE
    str += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
  }
  // nodeType 1 is Node.ELEMENT_NODE
  if (el.nodeType == 1) {
    str += `<${el.nodeName}`;
    for (let attr of Array.from(el.attributes)) {
      str += ` ${attr.name}="${attr.value.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`;
    }
    if (el.childNodes.length > 0) {
      str += ">";
    } else {
      str += "/>";
    }
  }
  for (let node of Array.from(el.childNodes)) {
    // nodeType 1 is Node.ELEMENT_NODE
    // nodeType 7 is Node.PROCESSING_INSTRUCTION_NODE
    // nodeType 8 is Node.COMMENT_NODE
    switch (node.nodeType) {
      case 1:
        str += serialize(node);
        break;
      case 7:
        str += `<?${node.nodeName} ${node.nodeValue}?>`;
        if (el.nodeType === 9 || el.nodeType === 11) {
          str += "\n";
        }
        break;
      case 8:
        str += `<!--${node.nodeValue}-->`;
        if (el.nodeType === 9 || el.nodeType === 11) {
          str += "\n";
        }
        break;
      default:
        str += node.nodeValue.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }
  if (el.nodeType == 1 && el.childNodes.length > 0) {
    str += `</${el.nodeName}>`;
  }
  if (el.nodeType === 9 || el.nodeType === 11) {
    str += "\n";
  }
  return str;
}
