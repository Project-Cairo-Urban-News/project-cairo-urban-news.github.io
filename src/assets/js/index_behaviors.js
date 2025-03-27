const index_behaviors = {
  "tei": {
    "ref": function(elt) {
      const ref = document.createElement("a");
      let target = elt.getAttribute("target").replace(/^[^-]*-/, "");
      let lang = target.substr(0, 2) == "WA" ? "arabic" : "ottoman";
      target = `../articles/${lang}/pages/${target.substr(2, 4)}-${target.replace(/^[^-]*-/, "").replace(/_.*/, "")}.html#${elt.getAttribute("target")}`;
      ref.setAttribute("href", target);
      ref.innerHTML = elt.innerHTML;
      return ref;
    },

    "addDataLetter": function() {
      const teiItems = document.querySelectorAll('.tei-item[data-origatts="xml:id"]');
      teiItems.forEach(item => {
        if (!item.hasAttribute('data-letter')) {
          const teiName = item.querySelector('tei-name');
          if (teiName) {
            const firstLetter = teiName.textContent.trim().charAt(0);
            item.setAttribute('data-letter', firstLetter);
          }
        }
      });
    }
  }
};

// Automatically run addDataLetter when the script is executed
index_behaviors["tei"].addDataLetter();
