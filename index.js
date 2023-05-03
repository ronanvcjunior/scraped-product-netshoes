const ObjectsToCsv = require("objects-to-csv");
const Produto = require("./Produto");
const fs = require("fs/promises");

const PRODUCTS_URL = [
  "https://www.netshoes.com.br/tenis-mizuno-wave-titan-2-preto-2FU-6367-006",
  "https://www.netshoes.com.br/creatine-turbo-300g-black-skull-natural-G54-4177-001",
  "https://www.netshoes.com.br/tenis-adidas-runfalcon-30-masculino-preto+branco-FB8-4501-026",
  "https://www.netshoes.com.br/tenis-adidas-runfalcon-30-masculino-preto-FB8-4501-006",
  "https://www.netshoes.com.br/creatina-monohidratada-500g-100-pura-importada-soldiers-nutrition-sem+sabor-I0Y-0012-289"
];

async function main() {
  try {
    const produtos = PRODUCTS_URL.map(async (value) => {
      const produto = new Produto(value);
      await produto.extrairInformacoes();
      return produto;
    });
  
    const PRODUTOS = await Promise.all(produtos);
    
    await salvarDadosColetadosCsv(PRODUTOS);
    await salvarDadosColetadosJson(PRODUTOS);
    
    console.log('\x1b[33m', `Quantidade de produtos coletados: ${PRODUTOS.length}`, '\n', '\x1b[0m');
    
    console.log('\u001b[34m', "Extração de dados finalizada com sucesso!", '\n', '\x1b[0m');
  } catch (error) {
    console.error('\u001b[31m', `Erro ao extrair informações do produto: ${error}`, '\n', '\x1b[0m');
  }
}

async function salvarDadosColetadosCsv(dados) {
  try {
    const csv = new ObjectsToCsv(dados);
    await csv.toDisk("./dados_coletados.csv");
    console.log('\u001b[32m', "Dados coletados gravados com sucesso em CSV!",  '\n', '\x1b[0m');
  } catch (error) {
    console.error('\u001b[31m', `Erro ao gravar dados coletados em CSV: ${error}`, '\n', '\x1b[0m');
  }
}

async function salvarDadosColetadosJson(dados) {
  try {
    const jsonString = JSON.stringify(dados, null, 2);
    await fs.writeFile("dados_coletados.json", jsonString);
    console.log('\u001b[32m', "Dados coletados gravados com sucesso em JSON!", '\n', '\x1b[0m');
  } catch (error) {
    console.error('\u001b[31m', `Erro ao gravar dados coletados em JSON: ${error}`, '\n', '\x1b[0m');
  }
}

main();