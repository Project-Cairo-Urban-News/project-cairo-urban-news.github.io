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
    "addDataLetterToTeiItems": function() {
      const teiItems = document.querySelectorAll('tei-item');
      
      teiItems.forEach(item => {
        const teiName = item.querySelector('tei-name');
        if (teiName) {
          const firstLetter = teiName.textContent.trim().charAt(0); // Get the first letter
          if (firstLetter) {
            item.setAttribute('data-letter', firstLetter); // Set the data-letter attribute
          } else {
            item.removeAttribute('data-letter'); // Remove if empty
          }
        } else {
          item.removeAttribute('data-letter'); // Remove if no tei-name exists
        }
      });
    },
    "filterItems": function(letter) {
      const items = document.querySelectorAll(".tei-item");
      items.forEach(item => {
        if (item.getAttribute("data-letter") === letter || letter === "all") {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    },
    "setupAlphabetFilter": function() {
      const buttons = document.querySelectorAll(".alphabet-bar button");
      buttons.forEach(button => {
        button.addEventListener("click", function() {
          const letter = this.getAttribute("data-letter");
          index_behaviors["tei"].filterItems(letter);
        });
      });
    }
  }
};

// Run functions on page load
document.addEventListener("DOMContentLoaded", function() {
  index_behaviors["tei"].addDataLetterToTeiItems();
  index_behaviors["tei"].setupAlphabetFilter();
});
