import path from 'node:path';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import * as sass from 'sass';
import CETEI from 'CETEIcean';
import esbuild from 'esbuild';

export default function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy({ "src/assets/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js/*.map": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js/*.json": "js" });

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

  eleventyConfig.addFilter("getManifestYears",
    function(manifests) {
      return Array.from(new Set(manifests.filter(item => {
        return item.url != false;
      }).map(item => {
        let date = item.Hijri_Date;
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

  eleventyConfig.addFilter("manifestsByYearAndMonth",
    function(manifests, year, month) {
      return manifests.filter(item => {
        return item.Hijri_Date.startsWith(`${year}-${month < 10 ? '0' : ''}${month}`);  
      });
    }
  );

  eleventyConfig.addFilter("toArabicNumerals", function(num) {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num.toString().split("").map(digit => {
      return arabicNumerals[digit];
    }).join("");
  });

  eleventyConfig.addFilter("yearFromDate", function(date) {
    if (date instanceof Date) {
      date = date.toISOString().replace(/:.*$/, "").replace(/T.*$/, "");
    }
    return date.replace(/-.*$/, "");
  });

  eleventyConfig.addFilter("getPreviousView", function(manifestYears, date, field) {
    for (let index = 0; index < manifestYears.length; index++) {
      const element = manifestYears[index];
      if (element[field] == date && index > 0) {
        return manifestYears[index - 1][field];
      } 
    }
    return false;
  });

  eleventyConfig.addFilter("getNextView", function(manifestYears, date, field) {
    for (let index = 0; index < manifestYears.length; index++) {
      const element = manifestYears[index];
      if (element[field] == date && index < manifestYears.length - 1) {
        return manifestYears[index + 1][field];
      } 
    }
    return false;
  });

  eleventyConfig.addCollection("years_en", function(collectionsApi) {
    return collectionsApi.getFilteredByGlob("src/CairoUrbanNews/articles/*/*.xml");
  });

  eleventyConfig.addCollection("years_ar", function(collectionsApi) {
    return collectionsApi.getFilteredByGlob("src/CairoUrbanNews-ar/articles/*/*.xml");
  });

  eleventyConfig.addCollection("page_en_ar_sorted", function(collectionsApi) {  
    return collectionsApi.getFilteredByGlob("src/CairoUrbanNews/articles/arabic/*/*.xml")
      .filter((page) => {
        return page.data.doc_lang = 'ar';
      })
      .sort((a, b) => {
        const titleA = Number.parseInt(a.data.title.replace(/-/g, ""));
        const titleB = Number.parseInt(b.data.title.replace(/-/g, ""));
        return titleA - titleB;
    });
  });

  eleventyConfig.addCollection("page_en_ota_sorted", function(collectionsApi) {  
    return collectionsApi.getFilteredByGlob("src/CairoUrbanNews/articles/ottoman/*/*.xml")
    .filter((page) => {
      return page.data.doc_lang = 'ota';
    })
    .sort((a, b) => {
      const titleA = Number.parseInt(a.data.title.replace(/-/g, ""));
      const titleB = Number.parseInt(b.data.title.replace(/-/g, ""));
      return titleA - titleB;
    });
  });

  eleventyConfig.addCollection("page_ar_ar_sorted", function(collectionsApi) {  
    return collectionsApi.getFilteredByGlob("src/CairoUrbanNews-ar/articles/arabic/*/*.xml")
    .filter((page) => {
      return page.data.doc_lang = 'ar';
    })
    .sort((a, b) => {
      const titleA = Number.parseInt(a.data.title.replace(/-/g, ""));
      const titleB = Number.parseInt(b.data.title.replace(/-/g, ""));
      return titleA - titleB;
    });
  });

  eleventyConfig.addCollection("page_ar_ota_sorted", function(collectionsApi) {  
    return collectionsApi.getFilteredByGlob("src/CairoUrbanNews-ar/articles/ottoman/*/*.xml")
    .filter((page) => {
      return page.data.doc_lang = 'ota';
    })
    .sort((a, b) => {
      const titleA = Number.parseInt(a.data.title.replace(/-/g, ""));
      const titleB = Number.parseInt(b.data.title.replace(/-/g, ""));
      return titleA - titleB;
    });
  });

  eleventyConfig.addTemplateFormats("mjs");
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addTemplateFormats("xml");

  eleventyConfig.addExtension("mjs", {

    compileOptions: {
      permalink: function(contents, inputPath) {
        return (data) => {
          return inputPath.replace("src/assets/js", "js").replace(".mjs", ".js");
        }
      }
    },

    compile: async (content, path) => {
  
      return async () => {
        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          write: false,
        });
  
        return output.outputFiles[0].text;
      }
    }
  });

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

  const cetei = new CETEI({documentObject: new JSDOM(`<html></html>`).window.document});

  eleventyConfig.addExtension("xml", {

    read: false,

    compileOptions: {
      permalink: function(contents, inputPath) {
        return async (data) => {
          if (!data.jdom.window.document.querySelector("TEI")) {
            return false;
          }
          const finalized = data.jdom.window.document.querySelector('revisionDesc[status="cleared"]') || inputPath.includes("indexes");
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
        const finalized = data.jdom.window.document.querySelector('revisionDesc[status="cleared"]') || inputPath.includes("indexes");
        if (!finalized) {
          return;
        }
        const doc = await cetei.domToHTML5(data.jdom.window.document);
        return cetei.utilities.serializeHTML(doc, true);
      };
    },
    getData: async function(inputPath) {
      if (inputPath.includes("articles")) {
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
        const year = inputPath.replace(/.*\/([^-.]+).*\.xml$/, "$1").substr(0, 4);
        const css_class = `col${year.substr(3, 1)}`;
        let parent;
        if (inputPath.includes('-')) {
          parent = inputPath.replace(/.*\/pages\/([^-]+)-.*\.xml$/, "../$1.html");
        } else {
          parent = inputPath.replace(/(.*)\/articles\/.*/, "$1");
        }
        return {
          title: inputPath.replace(/.*\/([^.]+)\.xml$/, "$1"),
          gregorian_dates: dates,
          date: year,
          class: css_class,
          doc_lang: lang,
          jdom: jdom,
          parent: parent
        };
      } else {
        return {
          title: inputPath.replace(/.*\/([^.]+)\.xml$/, "$1"),
          jdom: new JSDOM(fs.readFileSync(inputPath, 'utf8'), { contentType: "text/xml" })
        };
      }
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