const input = require('readline-sync');

const {
  listarFornecedores,
  listarProdutosComFornecedores,
  adicionarProduto,
  listarEditarProdutos
} = require('./src/lib/funcoes');

const menu = [
  'Listar Fornecedores',
  'Listar Produtos com Fornecedores',
  'Cadastrar Produto',
  'Listar/Editar Produtos'
];

async function main() {
  let sair = false;

  while (!sair) {
    console.clear();
    const opcao = input.keyInSelect(menu, 'Escolha uma opção: ', { cancel: 'Sair' });

    switch (opcao) {
      case 0:
        await listarFornecedores();
        break;
      case 1:
        await listarProdutosComFornecedores();
        break;
      case 2:
        await adicionarProduto();
        break;
      case 3:
        await listarEditarProdutos();
        break;
      case -1:
        sair = true;
        break;
    }

    input.question('\nPressione ENTER para continuar...');
  }
}

main();