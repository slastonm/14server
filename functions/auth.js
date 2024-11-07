// functions/auth.js

const express = require('express');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const router = express.Router();

// Секретний ключ для JWT
const SECRET_KEY = 'your-secret-key'; // Замініть на свій секретний ключ

// Фіксовані облікові дані користувачів
const USERS = [];
const PASSWORD = 'Qwerty123456!'; // Однаковий пароль для всіх

// Створюємо 14 користувачів admin1 - admin14
for (let i = 1; i <= 14; i++) {
    USERS.push({ username: `admin${i}`, password: PASSWORD });
}

// Маршрут для логіну
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Пошук користувача за логіном та паролем
    const user = USERS.find(u => u.username === username && u.password === password);

    // Перевірка облікових даних
    if (user) {
        // Створення JWT токену
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Успішний вхід', token });
    } else {
        res.status(401).json({ message: 'Невірний логін або пароль' });
    }
});

// Middleware для перевірки токену
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

// Захищений маршрут (приклад)
router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: `Привіт, ${req.user.username}! Це захищений маршрут.` });
});

// Маршрут для виходу (logout)
router.post('/logout', (req, res) => {
    // Оскільки ми не зберігаємо стан на сервері, просто повертаємо успіх
    res.json({ message: 'Вихід успішний' });
});

app.use('/.netlify/functions/auth', router);

module.exports.handler = serverless(app);
