const express = require('express');

const server = express();

server.use(express.json());

const users = ['Maria', 'João', 'Pedro'];

server.use((req, res, next) => {
    console.time('Request');
    console.log(`Request: ${req.method} ${req.url}`);
    next();
    console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res
            .status(400)
            .json({ error: 'Name is required' });
    }

    return next();
}

function userExists(req, res, next) {
    const { index } = req.params;
    const user = users[index];

    if (!user) {
        return res
            .status(400)
            .json({ error: 'User not found' });
    }

    req.user = user;

    return next();
}

server.get('/users', (req, res) => {
    return res.json(users);
});

server.get('/users/:index', userExists, (req, res) => {
    return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;
    users.push(name);
    return res.sendStatus(200);
});

server.put('/users/:index', checkUserExists, userExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;
    users[index] = name;
    return res.sendStatus(200);
});

server.delete('/users/:index', userExists, (req, res) => {
    const { index } = req.params;
    users.splice(index, 1);
    return res.sendStatus(200);
});

server.listen(3000);