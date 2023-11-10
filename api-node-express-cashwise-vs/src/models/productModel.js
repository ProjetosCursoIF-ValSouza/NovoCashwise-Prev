import db from '../database/db.js' // Importa o módulo 'db' que representa a conexão com o banco de dados.

// Função para obter um produto pelo ID.
const getById = async (id) => {
    return await db.query("SELECT name, descricao, preco FROM product Where id = ?", [id])
}

// Função para criar um novo produto.
const create = async (product) => {
    const { name, descricao, preco } = product;
    return await db.query("INSERT INTO product (name, descricao, preco) VALUES (?, ?, ?);", [name, descricao, preco]);
}

// Função para atualizar informações de um produto existente.
const update = async (product) => {
    const { id, name, descricao, preco } = product;
    return await db.query("UPDATE product SET name = ?, descricao = ?, preco = ? WHERE id = ?;", [name, descricao, preco, id]);
}

// Função para remover um produto pelo ID.
const remove = async (id) => {
    return await db.query("DELETE FROM product WHERE id = ?", [id])
}

// Exporta um objeto com as funções definidas acima para que possam ser usadas em outros lugares do código.
export default { getById, create, update, remove }


// O arquivo 'productModel.js' é um modelo de dados para a entidade 'produto' nessa aplicação. Assim como o arquivo
// 'userModel', ele contém funções que interagem com o banco de dados MySQL para realizar operações como obter informações
// de um produto por ID, criar um novo produto, atualizar informações de um produto existente e excluir um produto.