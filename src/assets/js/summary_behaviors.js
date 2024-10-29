const summary_behaviors = {
  "tei": {
    "text": ['<ol>','</ol>'],
    "div": [
      ["tei-body > tei-div", function(elt) {
        const li = document.createElement('li');
        const month = Number.parseInt(elt.querySelector('tei-head tei-date[when-custom]').getAttribute('when-custom').substring(5, 7));
        li.setAttribute('class', `month_${month}`);
        const link = document.createElement('a');
        link.setAttribute('href', `pages/${elt.getAttribute('xml:id').substring(2, 6)}-${this.getOrdinality(elt)}.html`);
        link.innerHTML = `${elt.querySelector('tei-head').outerHTML}`;
        li.appendChild(link);
        return li;
      }]]
  }
}