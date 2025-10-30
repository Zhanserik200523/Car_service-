const token = localStorage.getItem("token");

async function fetchAppointments() {
    const res = await fetch("/api/appointments", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const appointments = await res.json();
    const list = document.getElementById("appointmentsList");
    list.innerHTML = '';

    if (appointments.length === 0) {
        list.innerHTML = "<li>Записей нет</li>";
        return;
    }

    appointments.forEach(app => {
        const item = document.createElement("li");

        // 🛠 app.Service должен быть доступен с backend-а
        const serviceName = app.Service?.name || "Услуга не найдена";

        item.innerHTML = `
            <b>${app.date}</b> в <b>${app.time}</b><br>
            🚘 ${app.Car.brand} ${app.Car.model}<br>
            🛠 Услуга: <b>${serviceName}</b><br>
            💬 ${app.comment || "Комментарий отсутствует"}
        `;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Отменить";
        deleteBtn.onclick = async function () {
            if (confirm("Вы точно хотите отменить запись?")) {
                await deleteAppointment(app.ID);
            }
        };

        item.appendChild(deleteBtn);
        list.appendChild(item);
    });
}

async function deleteAppointment(id) {
    const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await res.json();

    if (res.ok) {
        alert("Запись отменена");
        fetchAppointments();
    } else {
        alert(data.error || "Ошибка при удалении");
    }
}

fetchAppointments();
