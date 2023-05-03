const needle = require("needle");
const cheerio = require("cheerio");
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');

const url = "https://www.netshoes.com.br/tenis-mizuno-wave-titan-2-preto-2FU-6367-006";

const scrapedResults = [];

async function scrapedProduct() {
  try {
    const response = await needle("get", url);

    const $ = cheerio.load(response.body);

    const title = $("[data-productname]").text();

    const price = $("div.price.price-box > .default-price > span > strong")
        .text()
        .replace("R$", "")
        .trim();

    const description = $("[itemprop='description']").text();

    const images = [];
    $("[data-swiper-wrapper-thumbs] > li").each((index, element) => {
      const image = $(element)
          .find("img")
          .attr("data-src");

      images.push(image);
    });

    const attributes = {};
    $("#features > .attributes > li").each((index, element) => {
      const resultAttributeTag = $(element)
          .children("strong")
          .text();

      const attributeTag = resultAttributeTag.replace(":", "");

      const attributeValue = $(element)
          .text()
          .replace(resultAttributeTag, "")
          .trim();

      attributes[attributeTag] = attributeValue;
    });
    
    const scrapedResult = { title, price, description, attributes, images };

    scrapedResults.push(scrapedResult);
  } catch (error) {
    console.error(error);
  }

}

async function createCsvFile() {
  const csv = new ObjectsToCsv(scrapedResults);

  await csv.toDisk('./test.csv');
}

async function createJsonFile() {
  const jsonString = JSON.stringify(scrapedResults, null, 2);

  fs.writeFile('data.json', jsonString, (err) => {
    if (err) {
      console.error('Erro ao escrever arquivo:', err);
    } else {
      console.log('Arquivo gravado com sucesso!');
    }
  });
}

async function main () {
  await scrapedProduct();
  await createCsvFile();
  await createJsonFile();
}

main();

