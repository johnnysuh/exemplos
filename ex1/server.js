const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Criar uma nova tarefa
app.post('/tasks', async (req, res) => {
    const { title, description, due_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *',
            [title, description, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Listar todas as tarefas
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Atualizar uma tarefa
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, due_date, completed } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, due_date = $3, completed = $4 WHERE id = $5 RETURNING *',
            [title, description, due_date, completed, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Excluir uma tarefa
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.send({ message: 'Tarefa excluída com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});