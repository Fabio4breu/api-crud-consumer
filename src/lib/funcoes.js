const input = require('readline-sync');
const axios = require('axios');

const Produto = require('../classes/produto');
const Fornecedor = require('../classes/fornecedor');
async function listarFornecedores() {
  console.log('------------------------------');
  console.log(' FORNECEDORES');
  console.log('------------------------------');
  console.log('ID - NOME');
  console.log('------------------------------');

  try {
    const result = await axios.get('http://localhost:3000/fornecedores');
    result.data.forEach(({ _id, nome }) => {
      console.log(`${_id} - ${nome}`);
    });
  } catch (error) {
    console.log('ERRO:', error.message);
  }
}
async function listarProdutosComFornecedores() {
  console.log('--------------------------------------------');
  console.log(' PRODUTOS COM FORNECEDORES');
  console.log('--------------------------------------------');

  try {
    const [produtosRes, fornecedoresRes] = await Promise.all([
      axios.get('http://localhost:3000/produtos'),
      axios.get('http://localhost:3000/fornecedores')
    ]);

    const produtos = produtosRes.data;
    const fornecedores = fornecedoresRes.data;

    produtos.forEach(prod => {
      const fornecedor = fornecedores.find(f => f._id === prod._idFornFK);
      const nomeForn = fornecedor ? fornecedor.nome : 'N/A';

      console.log(`${prod._id} - ${prod.nome} (${nomeForn})`);
    });
  } catch (error) {
    console.log('ERRO:', error.message);
  }
}
async function adicionarProduto() {
  const produto = new Produto();

  produto.nome = input.question('Nome do produto: ');
  produto.qtdeEstoque = parseInt(input.question('Quantidade em estoque: '));
  produto.preco = parseFloat(input.question('Preço: '));

  try {
    const fornecedoresRes = await axios.get('http://localhost:3000/fornecedores');
    const nomes = fornecedoresRes.data.map(f => f.nome);

    const opcao = input.keyInSelect(nomes, 'Escolha o fornecedor: ');
    produto._idFornFK = opcao >= 0 ? opcao + 1 : null;

    const result = await axios.post('http://localhost:3000/produtos', produto);
    console.log(result.data.message);
  } catch (error) {
    console.log('ERRO:', error.message);
  }
}
async function listarEditarProdutos() {
  try {
    const result = await axios.get('http://localhost:3000/produtos');
    const produtos = result.data;

    const opcoes = produtos.map(p => `${p._id} - ${p.nome}`);
    const escolha = input.keyInSelect(opcoes, 'Selecione um produto: ');

    if (escolha === -1) return;

    const produtoId = produtos[escolha]._id;
    const produtoRes = await axios.get(`http://localhost:3000/produtos/${produtoId}`);
    let produto = produtoRes.data;

    console.log(produto);

    const acao = input.keyInSelect(['Alterar', 'Excluir'], 'O que deseja fazer? ');

    if (acao === 0) {
      produto.nome = input.question('Novo nome: ');
      produto.qtdeEstoque = parseInt(input.question('Nova quantidade: '));
      produto.preco = parseFloat(input.question('Novo preço: '));
      produto._idFornFK = parseInt(input.question('ID do fornecedor: '));

      const update = await axios.put(`http://localhost:3000/produtos/${produto._id}`, produto);
      console.log(update.data.message);
    }

    if (acao === 1) {
      const confirmar = input.keyInYN('Confirmar exclusão? ');
      if (confirmar) {
        const del = await axios.delete(`http://localhost:3000/produtos/${produto._id}`);
        console.log(del.data.message);
      }
    }

  } catch (error) {
    console.log('ERRO:', error.message);
  }
}
module.exports = {
  listarFornecedores,
  listarProdutosComFornecedores,
  adicionarProduto,
  listarEditarProdutos
};
