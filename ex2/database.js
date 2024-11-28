const { Pool } = require('pg');

// Configuração de conexão com o banco de dados
const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'gerenciador_contatos',
    password: 'sua_senha',
    port: 5432,
});

module.exports = pool;