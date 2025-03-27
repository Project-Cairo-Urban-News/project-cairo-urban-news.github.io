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

    // Add a method to handle adding the data-letter attribute
    "addDataLetter": function() {
      updateTeiItems(); // Immediately run updateTeiItems when the content is ready
    }
  }
};

// Function to update the data-letter for all tei-items with data-origatts="xml:id"
function updateTeiItems() {
  const teiItems = document.querySelectorAll('.tei-item[data-origatts="xml:id"]');
  
  teiItems.forEach(item => {
    // Check if the data-letter already exists to prevent unnecessary updates
    if (!item.hasAttribute('data-letter')) {
      const teiName = item.querySelector('tei-name');
      if (teiName) {
        // Get the first letter of the name
        const firstLetter = teiName.textContent.trim().charAt(0);
        // Set the data-letter attribute with the first letter of the name
        item.setAttribute('data-letter', firstLetter);
      }
    }
  });
}

// Call the addDataLetter function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  index_behaviors["tei"].addDataLetter();
});
