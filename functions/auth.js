const express = require('express');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors'); // Додали пакет cors

const app = express();
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();

const SECRET_KEY = 'your-secret-key'; 


const USERS = [];
const PASSWORD = 'Qwerty123456!'; 

for (let i = 1; i <= 14; i++) {
    USERS.push({ username: `admin${i}`, password: PASSWORD });
}


router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Успішний вхід', token });
    } else {
        res.status(401).json({ message: 'Невірний логін або пароль' });
    }
});

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Помилка автентифікації' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Авторизація потрібна' });
    }
}

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Привіт, ${req.user.username}! Це захищений маршрут.` });
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Вихід успішний' });
});

app.use('/.netlify/functions/auth', router);

module.exports.handler = serverless(app);
