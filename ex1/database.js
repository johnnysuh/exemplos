const { Pool } = require('pg');

// Configure os parâmetros de conexão
const pool = new Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'gerenciador_tarefas',
    password: 'sua_senha',
    port: 5432,
});

module.exports = pool;