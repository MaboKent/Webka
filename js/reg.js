
  // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDSyvQcQ09MxokfvHStaiy-uoVy-g8inpI",
    authDomain: "webinternetmarket.firebaseapp.com",
    databaseURL: "https://webinternetmarket-default-rtdb.firebaseio.com",
    projectId: "webinternetmarket",
    storageBucket: "webinternetmarket.firebasestorage.app",
    messagingSenderId: "1021043818901",
    appId: "1:1021043818901:web:a9a4936d56dad3a03a769c",
    measurementId: "G-P370T6VPZQ"
  };

  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Функция для входа пользователя
async function loginUser() {
    // Получение email и пароля из формы
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Простая валидация формы
    if (!email || !password) {
        Swal.fire({
            icon: "error",
            title: "Ошибка...",
            text: "Введите логин и пароль!",
          });
        return;
    }

    try {
        // Получение данных из коллекции "Authorization"
        const snapshot = await get(ref(database, 'Authoreizaion'));
        const users = snapshot.val();

        // Фильтрация потенциальных пустых элементов
        const filteredUsers = Object.values(users).filter(u => u);

        // Поиск пользователя с соответствующим email и паролем (без учета регистра)
        const user = filteredUsers.find(u => u.Login.toLowerCase() === email.toLowerCase() && u.Password === password);

        if (user) {
            // Сохранение данных пользователя в localStorage
            //localStorage.setItem('userID', user.ID_PersonalAccount);
            //localStorage.setItem('userEmail', email);

            // Проверка, является ли пользователь администратором
            const isAdmin = user.ID_Post === "1";
            // Проверка, является ли пользователь тренером
            const isCoach = user.ID_Post === "3";

            if (isAdmin) {
                // Перенаправление на страницу администратора
                window.location.href = 'index.html';
            } else if (isCoach) {
                // Перенаправление на страницу тренера
                window.location.href = 'coach.html';
            } else {
                // Перенаправление на страницу спортсмена
                window.location.href = 'personalaccount.html';
            }
        } else {
            // Пользователь не найден или неверный email/пароль
            console.error('Пользователь не найден или неверный логин/пароль.');
            Swal.fire({
                icon: "error",
                title: "Ошибка...",
                text: "Неправильный логин или пароль!",
              });
        }
    } catch (error) {
        // Обработка ошибок при получении данных пользователя
        console.error('Ошибка при получении данных пользователя:', error);
    }
}

// Добавление слушателя события click к кнопке входа
document.getElementById('loginButton').addEventListener('click', loginUser);