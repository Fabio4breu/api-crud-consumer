// INTRODUÇÃO-2 AO EXPRESS - WEB API

const express = require('express');
const app = express();
const port = 3000;

// Middleware para JSON
app.use(express.json());

// "Banco de dados" em memória
let fornecedores = [
  { _id: 1, nome: 'Mundo da Construção' },
  { _id: 2, nome: 'Cimento & Cia' }
];

let produtos = [
  { _id: 1, nome: 'Tijolo', qtdeEstoque: 1000, preco: 0.90, _idFornFK: 1 },
  { _id: 2, nome: 'Cimento', qtdeEstoque: 200, preco: 25.00, _idFornFK: 2 }
];

// Classe Produto
class Produto {
  constructor(id, nome, qtdeEstoque, preco, _idFornFK) {
    this._id = id;
    this.nome = nome;
    this.qtdeEstoque = qtdeEstoque;
    this.preco = preco;
    this._idFornFK = _idFornFK;
  }
}

/* ================= ROTAS DA API ================= */

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    apiName: 'Catálogo de Produtos!',
    greetingMessage: 'Bem-vindo!'
  });
});

/* ---------- FORNECEDORES ---------- */

// Listar fornecedores
app.get('/fornecedores', (req, res) => {
  res.json(fornecedores);
});

/* ---------- PRODUTOS ---------- */

// CREATE - Cadastrar produto
app.post('/produtos', (req, res) => {
  try {
    const { nome, qtdeEstoque, preco, _idFornFK } = req.body;

    if (!nome) {
      return res.json({ message: 'Dados inválidos. Produto não cadastrado.' });
    }

    const id = produtos.length > 0
      ? produtos[produtos.length - 1]._id + 1
      : 1;

    const novoProduto = new Produto(id, nome, qtdeEstoque, preco, _idFornFK);
    produtos.push(novoProduto);

    res.json({ message: 'Produto cadastrado com sucesso!' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// READ ALL - Listar produtos
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// READ - Detalhe do produto
app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p._id === id);

  if (produto) {
    res.json(produto);
  } else {
    res.json({ message: 'Produto não encontrado!' });
  }
});

// UPDATE - Alterar produto
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, qtdeEstoque, preco, _idFornFK } = req.body;

  const produto = produtos.find(p => p._id === id);

  if (produto) {
    produto.nome = nome;
    produto.qtdeEstoque = qtdeEstoque;
    produto.preco = preco;
    produto._idFornFK = _idFornFK;

    res.json({ message: 'Produto alterado com sucesso!' });
  } else {
    res.json({ message: 'Produto não encontrado!' });
  }
});

// DELETE - Excluir produto
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  produtos = produtos.filter(p => p._id !== id);

  res.json({ message: 'Produto excluído com sucesso!' });
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`API "Catálogo de Produtos" rodando na porta ${port}`);
});