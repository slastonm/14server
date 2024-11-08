
#
Опис проекту
це простий сервер для автентифікації та авторизації користувачів з використанням JWT (JSON Web Tokens). Сервер підтримує 14 користувачів з унікальними логінами та спільним паролем. Проект реалізовано з використанням Netlify Functions та Express.js.

#
Демо-версія додатку доступна за посиланням: https://classy-tulumba-9633dc.netlify.app/

Облікові дані користувачів
Користувачі: admin1, admin2, admin3, ..., admin14
Пароль для всіх користувачів: Qwerty123456!
Примітка: Кожен користувач має унікальний логін та спільний пароль.

#
API Ендпоінти
##
POST /login
Опис: Маршрут для входу користувача. Приймає логін та пароль, повертає JWT токен при успішному вході.

#
Запит:

##
Метод: POST
```
URL: https://classy-tulumba-9633dc.netlify.app/.netlify/functions/auth/login
```
###
Тіло запиту (JSON):
```
{
  "username": "admin1",
  "password": "Qwerty123456!"
}
```

###
Відповідь при успіху (HTTP 200):

Тіло відповіді (JSON):

```
{
  "message": "Успішний вхід",
  "token": "<JWT токен>"
}
```

Відповідь при помилці (HTTP 401):
Тіло відповіді (JSON):

```
{
  "message": "Невірний логін або пароль"
}
```
Приклад запиту за допомогою curl:
```
  -H "Content-Type: application/json"
  -d '{
        "username": "admin1",
        "password": "Qwerty123456!"
      }'
```
##
GET /protected
Опис: Захищений маршрут, доступний лише для автентифікованих користувачів. Повертає привітання з логіном користувача.

###
Метод: GET
```
URL: https://classy-tulumba-9633dc.netlify.app/.netlify/functions/auth/protected
```
Заголовки:
Authorization: Bearer <JWT токен>
Відповідь при успіху (HTTP 200):

Тіло відповіді (JSON):

```
{
  "message": "Привіт, admin1! Це захищений маршрут."
}
```

Відповіь при помилці (HTTP 401 або 403):
Тіло відповіді (JSON):
```
{
  "message": "Авторизація потрібна" // або "Помилка автентифікації"
}
```
Приклад запиту з

```
 https://classy-tulumba-9633dc.netlify.app/.netlify/functions/auth/protected \
  -H "Authorization: Bearer <JWT токен>"
```  

##
POST /logout
Опис: Маршрут для виходу користувача. Очищує токен на клієнті.
Запит:

##
Метод: POST
URL: https://classy-tulumba-9633dc.netlify.app/.netlify/functions/auth/logout
Заголовки:
Authorization: Bearer <JWT токен>
Відповідь при успіху (HTTP 200):

Тіло відповіді (JSON):
```
{
  "message": "Вихід успішний"
}
```


POST
```
 https://classy-tulumba-9633dc.netlify.app/.netlify/functions/auth/logout \
  -H "Authorization: Bearer <JWT токен>"

```

###
Використання на фронтенді
Фронтенд додатку знаходиться у файлі public/index.html. Він дозволяє користувачам виконувати вхід, отримувати доступ до захищених даних та виконувати вихід.

###
Основні функції
Вхід:

Користувач вводить логін та пароль, які надсилаються на сервер для автентифікації.
Запит надсилається на маршрут /login.
При успішному вході сервер повертає JWT токен, який зберігається на клієнті.
Отримання захищених даних:

Після входу користувач може отримати доступ до захищеного маршруту /protected.
Токен передається в заголовку Authorization при виконанні запиту.
Сервер перевіряє токен і повертає захищені дані.
Вихід:

Користувач може виконати вихід, після чого токен видаляється на клієнті.
Запит надсилається на маршрут /logout.
