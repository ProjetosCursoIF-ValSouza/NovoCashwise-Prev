import db from '../database/db.js'  // Importa o módulo 'db' que representa a conexão com o banco de dados.

// Função para obter um usuário pelo ID.

const getById = async (id) => {
    return await db.query("SELECT name, email, photo FROM users Where id = ?", [id])
}

// Função para obter todos os usuários.
const getAll = async () => {
    return await db.query("SELECT id, name, email, photo FROM users")
}

// Função para criar um novo usuário.
const create = async (user) => {
    const {name, email, pass, photo} = user
    return await db.query("INSERT INTO users (name, email, pass, photo) VALUES (?, ?, ?, ?);", [name, email, pass, photo])
}

// Função para atualizar informações de um usuário existente.
const update = async (user) => {
    const {id, name, email, pass, photo} = user
    return await db.query("UPDATE users SET name = ?, email = ?, pass = ?, photo = ? WHERE id = ?;", [name, email, pass, photo, id])
}

// Função para remover um usuário pelo ID.
const remove = async (id) => {
    return await db.query("DELETE FROM users WHERE id = ?", [id])
}

// Exporta um objeto com todas as funções definidas acima para que possam ser usadas em outros lugares do código.
export default {getById, create, update, remove, getAll}


// O arquivo 'userModel.js' é um modelo de dados para a entidade 'usuário' nessa aplicação. Ele contém funções que interagem
// com o banco de dados MySQL para realizar operações como obter informações de um usuário por ID, listar todos os usuários, 
// criar um novo usuário, atualizar informações de um usuário existente e excluir um usuário. 