
const token = localStorage.getItem("token");

document.getElementById("serviceForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: parseInt(document.getElementById("price").value),
        duration: parseInt(document.getElementById("duration").value),
        category: document.getElementById("category").value,
        image: document.getElementById("photo").value,
        specialist: document.getElementById("expert").value,
        available: document.getElementById("available").checked
    };

    const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Услуга добавлена");
        e.target.reset();
        loadServices();
    } else {
        alert("Ошибка при добавлении");
    }
});

async function loadServices() {
    const res = await fetch("/api/admin/services", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    const list = document.getElementById("servicesList");
    list.innerHTML = '';

    data.forEach(service => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card shadow-sm h-100";

        card.innerHTML = `
          <img src="${service.image}" class="card-img-top" style="height:200px; object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${service.name}</h5>
            <p class="card-text"><strong>Категория:</strong> ${service.category}</p>
            <p class="card-text">${service.description}</p>
            <p class="card-text">💰 ${service.price} ₸</p>
            <p class="card-text">⏱ ${service.duration} мин</p>
            <p class="card-text">👨‍🔧 ${service.specialist || 'Не указан'}</p>
            <p class="card-text">${service.available ? '✅ Доступна' : '❌ Недоступна'}</p>
          </div>
        `;

        const delBtn = document.createElement("button");
        delBtn.className = "btn btn-danger mt-auto";
        delBtn.textContent = "Удалить";
        delBtn.onclick = () => deleteService(service.ID);

        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-sm btn-outline-primary mt-2";
        editBtn.textContent = "Изменить";
        editBtn.onclick = () => openEditModal(service);

        card.querySelector(".card-body").appendChild(delBtn);
        card.querySelector(".card-body").appendChild(editBtn);

        col.appendChild(card);
        list.appendChild(col);
    });
}


async function deleteService(id) {
    const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
        alert("Удалено");
        loadServices();
    } else {
        alert("Ошибка при удалении");
    }
}

loadServices();
function openEditModal(service) {
    document.getElementById("editId").value = service.ID;
    document.getElementById("editName").value = service.name;
    document.getElementById("editDescription").value = service.description;
    document.getElementById("editPrice").value = service.price;
    document.getElementById("editDuration").value = service.duration;
    document.getElementById("editCategory").value = service.category;
    document.getElementById("editPhoto").value = service.image || '';
    document.getElementById("editExpert").value = service.specialist || '';
    document.getElementById("editAvailable").checked = service.available;

    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
}

document.getElementById("editServiceForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("editId").value;

    const updated = {
        name: document.getElementById("editName").value,
        description: document.getElementById("editDescription").value,
        price: parseInt(document.getElementById("editPrice").value),
        duration: parseInt(document.getElementById("editDuration").value),
        category: document.getElementById("editCategory").value,
        image: document.getElementById("editPhoto").value,
        specialist: document.getElementById("editExpert").value,
        available: document.getElementById("editAvailable").checked
    };

    const res = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
    });

    if (res.ok) {
        alert("Услуга обновлена");
        const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        modal.hide();
        loadServices();
    } else {
        alert("Ошибка при обновлении");
    }
});
