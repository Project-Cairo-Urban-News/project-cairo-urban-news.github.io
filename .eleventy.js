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
      lang = inputPath.includes('-ar') ? 'ar' : 'en';
      return {
        title: inputPath.replace(/.*\/([^.]+)\.xml$/, "$1"),
        layout: `doc-${lang}.njk`
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