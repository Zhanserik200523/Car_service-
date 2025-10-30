// async function loadCatalogServices() {
//     const res = await fetch("/api/services");
//     const services = await res.json();
//
//     const list = document.getElementById("catalogList");
//     list.innerHTML = '';
//
//     services.forEach(service => {
//         const item = document.createElement("div");
//         item.className = "catalog-card";
//
//         item.innerHTML = `
//             <h3>${service.name}</h3>
//             <p><b>Категория:</b> ${service.category}</p>
//             <p><b>Описание:</b> ${service.description}</p>
//             <p><b>Цена:</b> ${service.price} ₸</p>
//             <p><b>Длительность:</b> ${service.duration} мин</p>
//             <button onclick="openAppointment(${service.ID})">Записаться</button>
//         `;
//
//         list.appendChild(item);
//     });
// }
//
// async function openAppointment(serviceId) {
//     const token = localStorage.getItem("token");
//
//     const date = prompt("Введите дату записи (например, 2025-05-03):");
//     if (!date) return;
//
//     // Шаг 1: выбор машины
//     const carsRes = await fetch("/api/cars", {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     const cars = await carsRes.json();
//
//     if (cars.length === 0) {
//         alert("У вас нет машин для записи");
//         return;
//     }
//
//     const carOptions = cars.map(car => `${car.ID}: ${car.brand} ${car.model}`).join("\n");
//     const carId = parseInt(prompt("Выберите ID машины:\n" + carOptions));
//     if (!carId) return;
//
//     // Шаг 2: выбор времени (слоты)
//     const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
//     const slotOptions = timeSlots.map(t => `${t}`).join(", ");
//     const time = prompt(`Выберите время (слот):\n${slotOptions}`);
//     if (!time || !timeSlots.includes(time)) {
//         alert("Неверный слот времени");
//         return;
//     }
//
//     const comment = prompt("Комментарий (необязательно):");
//
//     const res = await fetch("/api/appointment", {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             car_id: carId,
//             date,
//             time,
//             comment,
//             service_id: serviceId
//         })
//     });
//
//     const data = await res.json();
//
//     if (res.ok) {
//         alert("Вы успешно записались на услугу!");
//     } else {
//         alert(data.error || "Ошибка при записи");
//     }
// }
//
//
// loadCatalogServices();
let allServices = [];
let selectedCategory = "all";
let selectedSort = "default";
let currentModal = null;

// Загрузка всех услуг
async function loadCatalogServices() {
    const res = await fetch("/api/services");
    allServices = await res.json();
    renderServices();
}

// Отображение услуг с учетом фильтра и сортировки
function renderServices() {
    let filtered = [...allServices];

    // Фильтрация по категории
    if (selectedCategory !== "all") {
        filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Сортировка
    if (selectedSort === "price") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "duration") {
        filtered.sort((a, b) => a.duration - b.duration);
    }

    const list = document.getElementById("catalogList");
    list.innerHTML = '';

    filtered.forEach(service => {
        const item = document.createElement("div");
        item.className = "col-md-6 col-lg-4";
        item.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${service.image || '/default.jpg'}" class="card-img-top" onerror="this.src='/default.jpg'" style="height: 180px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${service.name}</h5>
                    <p class="card-text"><strong>Категория:</strong> ${service.category}</p>
                    <p class="card-text"><strong>Описание:</strong> ${service.description}</p>
                    <p class="card-text"><strong>Цена:</strong> ${service.price} ₸</p>
                    <p class="card-text"><strong>Длительность:</strong> ${service.duration} мин</p>
                    <button class="btn btn-primary mt-auto" onclick="openAppointment(${service.ID})">Записаться</button>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

// Обработка фильтра по категориям
document.querySelectorAll("#categoryFilter .list-group-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll("#categoryFilter .list-group-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        selectedCategory = item.dataset.category;
        renderServices();
    });
});

// Обработка сортировки
document.getElementById("sortSelect").addEventListener("change", (e) => {
    selectedSort = e.target.value;
    renderServices();
});

// Открытие модального окна записи
async function openAppointment(serviceId) {
    const token = localStorage.getItem("token");
    document.getElementById("modalServiceId").value = serviceId;

    const carsRes = await fetch("/api/cars", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const cars = await carsRes.json();

    const carSelect = document.getElementById("modalCar");
    carSelect.innerHTML = '';

    if (cars.length === 0) {
        carSelect.innerHTML = '<option disabled>Нет доступных машин</option>';
    } else {
        cars.forEach(car => {
            const opt = document.createElement("option");
            opt.value = car.ID;
            opt.textContent = `${car.brand} ${car.model}`;
            carSelect.appendChild(opt);
        });
    }

    const modal = new bootstrap.Modal(document.getElementById('appointmentModal'));
    modal.show();
    currentModal = modal;
}

// Отправка формы записи
document.getElementById("appointmentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const serviceId = document.getElementById("modalServiceId").value;
    const carId = document.getElementById("modalCar").value;
    const date = document.getElementById("modalDate").value;
    const time = document.getElementById("modalTime").value;
    const comment = document.getElementById("modalComment").value;

    const res = await fetch("/api/appointment", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            car_id: parseInt(carId),
            date,
            time,
            comment,
            service_id: parseInt(serviceId)
        })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Запись успешно создана!");
        currentModal.hide();
    } else {
        alert(data.error || "Ошибка при записи");
    }
});

// Загрузка при открытии страницы
loadCatalogServices();
