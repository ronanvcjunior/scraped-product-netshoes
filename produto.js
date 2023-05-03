const needle = require("needle");
const cheerio = require("cheerio");

class Produto {
  constructor(url) {
    this.url = url;
    this.titulo = "";
    this.preco = 0;
    this.descricao = "";
    this.images = [];
    this.atributos = {};
  }

  async extrairInformacoes() {
    try {
      const response = await needle("get", this.url);
      const $ = cheerio.load(response.body);

      this.titulo = this.obterTitulo($);
      this.preco = this.obterPreco($);
      this.descricao = this.obterDescricao($);
      this.images = this.obterdescricao($);
      this.atributos = await this.obterAtributos($);
    } catch (error) {
      console.error(`Erro ao extrair informações do produto: ${error}`);
    }
  }

  obterTitulo($) {
    return $("[data-productname]").text().trim();
  }

  obterPreco($) {
    return parseFloat(
      $("div.price.price-box > .default-price > span > strong")
        .text()
        .replace("R$", "")
        .trim()
    );
  }

  obterDescricao($) {
    return $("[itemprop='description']").text().trim();
  }

  obterdescricao($) {
    return $("[data-swiper-wrapper-thumbs] > li img")
      .map((_, element) => $(element).attr("data-src"))
      .get();
  }

  async obterAtributos($) {
    const atributos = $("#features > .attributes > li")
      .map((_, element) => {
        const attributeTag = $(element)
          .children("strong")
          .text()
          .replace(":", "")
          .trim();
        const attributeValue = $(element)
          .text()
          .replace(attributeTag, "")
          .trim();
        return { [attributeTag]: attributeValue };
      })
      .get()
      .reduce((result, attribute) => ({ ...result, ...attribute }), {});

    return atributos;
  }
}

module.exports = Produto;
