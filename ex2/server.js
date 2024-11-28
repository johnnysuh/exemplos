const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Cadastrar um novo contato
app.post('/contacts', async (req, res) => {
    const { name, email, phone, birth_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, email, phone, birth_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, birth_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Listar todos os contatos
app.get('/contacts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Atualizar um contato
app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, birth_date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE contacts SET name = $1, email = $2, phone = $3, birth_date = $4 WHERE id = $5 RETURNING *',
            [name, email, phone, birth_date, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Excluir um contato
app.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
        res.send({ message: 'Contato excluído com sucesso!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});