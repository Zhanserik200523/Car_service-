// async function fetchCars() {
//     const token = localStorage.getItem("token");
//
//     if (!token) {
//         window.location.href = "/login";
//         return;
//     }
//
//     const response = await fetch('/api/cars', {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
//
//     if (response.ok) {
//         const cars = await response.json();
//         const list = document.getElementById('carsList');
//         list.innerHTML = '';
//
//         cars.forEach(car => {
//             const item = document.createElement('li');
//             item.textContent = `${car.brand} ${car.model} (${car.year}) `;
//
//             const editBtn = document.createElement('button');
//             editBtn.textContent = 'Редактировать';
//             editBtn.onclick = function () {
//                 editCar(car);
//             };
//
//             const deleteBtn = document.createElement('button');
//             deleteBtn.textContent = 'Удалить';
//             deleteBtn.onclick = async function () {
//                 if (confirm('Вы точно хотите удалить эту машину?')) {
//                     await deleteCar(car.ID);
//                 }
//             };
//
//             item.appendChild(editBtn);
//             item.appendChild(deleteBtn);
//             list.appendChild(item);
//         });
//     } else {
//         alert('Ошибка загрузки списка машин');
//     }
// }
//
// async function deleteCar(carId) {
//     const token = localStorage.getItem("token");
//
//     const response = await fetch(`/api/cars/${carId}`, {
//         method: 'DELETE',
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
//
//     if (response.ok) {
//         alert('Машина удалена!');
//         fetchCars(); // Перезагрузить список после удаления
//     } else {
//         alert('Ошибка при удалении машины');
//     }
// }
// function editCar(car) {
//     const newBrand = prompt("Введите новую марку машины:", car.brand);
//     const newModel = prompt("Введите новую модель машины:", car.model);
//     const newYear = prompt("Введите новый год выпуска:", car.year);
//
//     if (newBrand && newModel && newYear) {
//         updateCar(car.ID, newBrand, newModel, parseInt(newYear));
//     }
// }
// async function updateCar(carId, brand, model, year) {
//     const token = localStorage.getItem("token");
//
//     const response = await fetch(`/api/cars/${carId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ brand, model, year })
//     });
//
//     if (response.ok) {
//         alert('Машина обновлена!');
//         fetchCars();
//     } else {
//         alert('Ошибка при обновлении машины');
//     }
// }
//
// fetchCars();
const token = localStorage.getItem("token");
let currentModal = null;

async function fetchCars() {
    const response = await fetch('/api/cars', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const list = document.getElementById('carsList');
    list.innerHTML = '';

    if (response.ok) {
        const cars = await response.json();

        cars.forEach(car => {
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4";

            const card = document.createElement("div");
            card.className = "card shadow-sm";

            card.innerHTML = `
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${car.brand} ${car.model}</h5>
          <p class="card-text">Год выпуска: ${car.year}</p>
          <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-sm btn-outline-primary" onclick='editCar(${JSON.stringify(car)})'>Редактировать</button>
            <button class="btn btn-sm btn-outline-danger" onclick='deleteCar(${car.ID})'>Удалить</button>
          </div>
        </div>
      `;

            col.appendChild(card);
            list.appendChild(col);
        });
    } else {
        alert('Ошибка загрузки списка машин');
    }
}

async function deleteCar(carId) {
    if (!confirm("Вы точно хотите удалить эту машину?")) return;

    const response = await fetch(`/api/cars/${carId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        alert('Машина удалена!');
        fetchCars();
    } else {
        alert('Ошибка при удалении машины');
    }
}

function editCar(car) {
    document.getElementById("editCarId").value = car.ID;
    document.getElementById("editBrand").value = car.brand;
    document.getElementById("editModel").value = car.model;
    document.getElementById("editYear").value = car.year;

    const modalEl = document.getElementById("editCarModal");
    currentModal = new bootstrap.Modal(modalEl);
    currentModal.show();
}

document.getElementById("editCarForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const carId = document.getElementById("editCarId").value;
    const brand = document.getElementById("editBrand").value;
    const model = document.getElementById("editModel").value;
    const year = parseInt(document.getElementById("editYear").value);

    const response = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ brand, model, year })
    });

    if (response.ok) {
        alert("Машина обновлена!");
        currentModal.hide();
        fetchCars();
    } else {
        alert("Ошибка при обновлении машины");
    }
});
document.getElementById("addCarForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const brand = document.getElementById("addBrand").value;
    const model = document.getElementById("addModel").value;
    const year = parseInt(document.getElementById("addYear").value);
    const token = localStorage.getItem("token");

    const response = await fetch('/api/add-car', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ brand, model, year })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Машина добавлена!");
        bootstrap.Modal.getInstance(document.getElementById("addCarModal")).hide();
        e.target.reset();
        fetchCars();
    } else {
        alert(data.error || "Ошибка при добавлении машины");
    }
});

fetchCars();
