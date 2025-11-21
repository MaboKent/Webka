import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

let editKey = null; // Ключ товара, который редактируется

// Обработчик отправки формы
productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productName = document.getElementById("productName").value.trim();
    const Cost = document.getElementById("productPrice").value;
    const productDescription = document.getElementById("productDescription").value.trim();

    if (!productName || !Cost) {
        alert("Пожалуйста, введите корректные данные товара.");
        return;
    }

    try {
        if (editKey) {
            // Обновление существующего товара
            await update(ref(database, `Tovar/${editKey}`), {
                productName: productName,
                Cost: Cost,
                productDescription: productDescription,
                updatedAt: Date.now()
            });
            editKey = null;
            productForm.querySelector("button[type='submit']").textContent = "Добавить товар";
        } else {
            // Добавление нового товара
            await push(ref(database, "Tovar"), {
                productName: productName,
                Cost: Cost,
                productDescription: productDescription,
                createdAt: Date.now()
            });
        }

        productForm.reset();
    } catch (error) {
        console.error("Ошибка при сохранении товара:", error);
        alert("Ошибка при сохранении товара. Попробуйте позже.");
    }
});

// Функция отображения списка товаров
function displayProducts(products) {
    productList.innerHTML = "";
    if (!products) {
        productList.innerHTML = "<li>Товары не найдены.</li>";
        return;
    }
    Object.entries(products).forEach(([key, product]) => {
        const li = document.createElement("li");
        li.className = "border p-4 rounded shadow bg-white flex justify-between items-center";

        li.innerHTML = `
            <div>
                <p><strong>Название товара:</strong> ${product.productName}</p>
                <p><strong>Стоимость:</strong> ${product.Cost}</p>
                <p><strong>Описание:</strong> ${product.productDescription || "Нет описания"}</p>
            </div>
            <div class="flex space-x-2">
                <button data-key="${key}" class="editBtn bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Изменить</button>
                <button data-key="${key}" class="deleteBtn bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Удалить</button>
            </div>
        `;
        productList.appendChild(li);
    });

    // Добавляем обработчики кнопок удаления
    const deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", async (e) => {
            const key = e.target.getAttribute("data-key");
            if (key) {
                try {
                    await remove(ref(database, `Tovar/${key}`));
                } catch (error) {
                    console.error("Ошибка при удалении товара:", error);
                    alert("Ошибка при удалении товара. Попробуйте позже.");
                }
            }
        });
    });

    // Добавляем обработчики кнопок изменения
    const editButtons = document.querySelectorAll(".editBtn");
    editButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const key = e.target.getAttribute("data-key");
            if (key && products[key]) {
                const product = products[key];
                document.getElementById("productName").value = product.productName;
                document.getElementById("productPrice").value = product.Cost;
                document.getElementById("productDescription").value = product.productDescription || "";
                editKey = key;
                productForm.querySelector("button[type='submit']").textContent = "Сохранить изменения";
            }
        });
    });
}

// Подписка на изменения в базе данных
const tovarRef = ref(database, "Tovar");
onValue(tovarRef, (snapshot) => {
    const products = snapshot.val();
    displayProducts(products);
});
