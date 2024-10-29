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
      return Array.from(new Set(pages.filter(item => {
        return item.url != false;
      }).map(item => {
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

  eleventyConfig.addFilter("toArabicNumerals", function(num) {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num.toString().split("").map(digit => {
      return arabicNumerals[digit];
    }).join("");
  });

  eleventyConfig.addCollection("years_en", function(collectionsApi) {
    return collectionsApi.getFilteredByGlob("src/CairoUrbanNews/articles/*/*.xml");
  });

  eleventyConfig.addCollection("years_ar", function(collectionsApi) {
    return collectionsApi.getFilteredByTag("year_ar").filter(item => {
      return !item.data.tags.includes("page_ar");
    });
  });

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
        return async (data) => {
          if (!data.jdom.window.document.querySelector("TEI")) {
            return false;
          }
          const finalized = data.jdom.window.document.querySelector('revisionDesc[status="cleared"]');
          if (!finalized) {
            return false;
          }
          const path = inputPath.replace(/src\/CairoUrbanNews\//, 'en/').replace(/src\/CairoUrbanNews-ar\//, 'ar/');
          return path.replace(/\.xml$/, ".html");
        }
      }
    },
    compile: function(contents, inputPath) {
      return async (data) => {
        if (!data.jdom) {
          return;
        }
        if (!data.jdom.window.document.querySelector("TEI")) {
          return;
        }
        const finalized = data.jdom.window.document.querySelector('revisionDesc[status="cleared"]');
        if (!finalized) {
          return;
        }
        const cetei = new CETEI({ documentObject: data.jdom.window.document });
        const doc = await cetei.domToHTML5(data.jdom.window.document);
        return cetei.utilities.serializeHTML(doc, true);
      };
    },
    getData: async function(inputPath) {
      const file = fs.readFileSync(inputPath, 'utf8');
      const jdom = new JSDOM(file, { contentType: "text/xml" });
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
        doc_lang: lang,
        jdom: jdom
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