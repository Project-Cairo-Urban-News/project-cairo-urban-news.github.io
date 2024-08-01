const path = require('node:path');
const { JSDOM } = require("jsdom");
const fs = require('fs');
const sass = require('sass');
// CommonJS can't require ESM modules, so we have to use an import() hack instead
let CETEI;
import("CETEIcean").then((ceteicean) => {
  CETEI = ceteicean.default;
})
module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({ "src/assets/images": "images" });

  eleventyConfig.addFilter("getYears",
    function(pages) {
      return Array.from(new Set(pages.map(item => {
        let date = item.data.date;
        if (date instanceof Date) {
          date = date.toISOString().replace(/:.*$/, "").replace(/T.*$/, "");
        }
        return date.replace(/-.*$/, "");
      })));
    }
  );

  eleventyConfig.addFilter("pagesByYear",
    function(pages, year) {
      return pages.filter(item => {
        let date = item.data.date;
        if (date instanceof Date) {
          date = date.toISOString().replace(/:.*$/, "").replace(/T.*$/, "");
        }
        return date.startsWith(year);
      });
    }
  );

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addTemplateFormats("xml");

  eleventyConfig.addExtension("scss", {

    compileOptions: {
      permalink: function(contents, inputPath) {
        return (data) => {
          return inputPath.replace("src/assets/scss", "css").replace(".scss", ".css");
        }
      }
    },

    compile: async function(inputContent, inputPath) {
      let parsed = path.parse(inputPath);
      if (parsed.name.startsWith("_")) {
        return;
      }
      let result = sass.compileString(inputContent, {
        loadPaths: [
          parsed.dir || ".",
          this.config.dir.includes
        ]
      });

      return async (data) => {
        return result.css;
      };
    }
  });

  eleventyConfig.addExtension("xml", {

    compileOptions: {
      permalink: function(contents, inputPath) {
        const path = inputPath.replace(/src\/CairoUrbanNews\//, 'en/').replace(/src\/CairoUrbanNews-ar\//, 'ar/');
        return path.replace(/\.xml$/, ".html");
      }
    },
    compile: async function(contents, inputPath) {
      const jdom = new JSDOM(contents, { contentType: "text/xml" });
      if (!jdom.window.document.querySelector("TEI")) {
        return;
      }
      const finalized = jdom.window.document.querySelector('revisionDesc[status="cleared"]');
      if (!finalized) {
        return;
      }
      let cetei = new CETEI({ documentObject: jdom.window.document });
      let doc = await cetei.domToHTML5(jdom.window.document);
      return async (data) => {
        return cetei.utilities.serializeHTML(doc, true);
      };
    },
    getData: async function(inputPath) {
      const file = fs.readFileSync(inputPath, 'utf8');
      const jdom = new JSDOM(file, { contentType: "text/xml" });
      if (!jdom.window.document.querySelector("TEI")) {
        return;
      }
      const dateElements = Array.from(jdom.window.document.querySelectorAll('TEI > text > body > div > head > date[when]'));
      const dates = dateElements.map(date => {
        return date.getAttribute('when').replace(/^(\d{4})-.*$/, "$1");
      }).reduce((acc, date) => {
        if (acc.includes(date)) {
          return acc;
        }
        return acc.concat(date);
      }, []).join('/');
      const lang = jdom.window.document.querySelectorAll('TEI > text')[0].getAttribute('xml:lang');
      const year = inputPath.replace(/.*\/([^.]+)\.xml$/, "$1").substr(0, 4);
      const css_class = `col${year.substr(3, 1)}`;
      return {
        title: inputPath.replace(/.*\/([^.]+)\.xml$/, "$1"),
        gregorian_dates: dates,
        date: year,
        class: css_class,
        doc_lang: lang
      };
    }    
  });
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: '_includes',
      layouts: '_layouts'
    }
  };
}