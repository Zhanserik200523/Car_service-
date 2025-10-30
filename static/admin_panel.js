const token = localStorage.getItem("token");

async function loadUsers() {
    const res = await fetch("/api/admin/users", {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const users = await res.json();
    const list = document.getElementById("usersList");
    list.innerHTML = '';

    users.forEach(user => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";

        const userInfo = document.createElement("div");
        userInfo.innerHTML = `<strong>${user.email}</strong> (${user.role})`;

        const btnGroup = document.createElement("div");

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-danger me-2";
        deleteBtn.textContent = "Удалить";
        deleteBtn.onclick = async () => {
            if (confirm(`Удалить пользователя ${user.email}?`)) {
                await deleteUser(user.ID);
            }
        };

        const roleBtn = document.createElement("button");
        roleBtn.className = "btn btn-sm btn-outline-primary";
        const newRole = user.role === "admin" ? "user" : "admin";
        roleBtn.textContent = `Сделать ${newRole}`;
        roleBtn.onclick = async () => {
            if (confirm(`Изменить роль ${user.email} на ${newRole}?`)) {
                await changeUserRole(user.ID, newRole);
            }
        };

        btnGroup.appendChild(deleteBtn);
        btnGroup.appendChild(roleBtn);

        item.appendChild(userInfo);
        item.appendChild(btnGroup);

        list.appendChild(item);
    });
}

async function loadAppointments() {
    const res = await fetch("/api/admin/appointments", {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const apps = await res.json();
    const list = document.getElementById("appointmentsList");
    list.innerHTML = '';

    if (apps.length === 0) {
        list.innerHTML = `<p class="text-muted">Записей пока нет</p>`;
        return;
    }

    apps.forEach(app => {
        const user = app.User;
        const car = app.Car;
        const service = app.Service;

        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        const phone = user.phone || '—';

        const card = document.createElement("div");
        card.className = "card shadow-sm mb-3";

        card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-primary mb-2">${user.email}</h5>
        <p class="mb-1"><strong>👤 Имя:</strong> ${fullName || '—'}</p>
        <p class="mb-1"><strong>📞 Телефон:</strong> ${phone}</p>
        <p class="mb-1"><strong>🚘 Машина:</strong> ${car.brand} ${car.model} (${car.year})</p>
        <p class="mb-1"><strong>🛠️ Услуга:</strong> ${service?.name || '—'}</p>
        <p class="mb-1"><strong>📅 Дата:</strong> ${formatDateTime(app.date, app.time)}</p>
        <p class="mb-0"><strong>💬 Комментарий:</strong> ${app.comment || '—'}</p>
      </div>
    `;

        list.appendChild(card);
    });

}

// Формат: 2025-05-20 → 20.05.2025  | time → HH:MM
function formatDateTime(date, time) {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year} в ${time}`;
}


async function deleteUser(id) {
    const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
        alert("Пользователь удалён");
        loadUsers();
    } else {
        const data = await res.json();
        alert(data.error || "Ошибка при удалении");
    }
}

async function changeUserRole(id, role) {
    const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Роль обновлена");
        loadUsers();
    } else {
        alert(data.error || "Ошибка при обновлении роли");
    }
}

loadUsers();
loadAppointments();
