const token = localStorage.getItem("token");

async function loadCars() {
    const res = await fetch("/api/cars", {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const cars = await res.json();
    const select = document.getElementById("carSelect");
    cars.forEach(car => {
        const opt = document.createElement("option");
        opt.value = car.ID;
        opt.textContent = `${car.brand} ${car.model}`;
        select.appendChild(opt);
    });
}

document.getElementById("appointmentForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const carId = document.getElementById("carSelect").value;
    const date = document.getElementById("date").value;
    const comment = document.getElementById("comment").value;

    const res = await fetch("/api/appointment", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ car_id: Number(carId), date, comment })
    });

    const data = await res.json();
    const msg = document.getElementById("message");
    if (res.ok) {
        msg.textContent = "Вы успешно записались!";
        msg.style.color = "green";
    } else {
        msg.textContent = data.error;
        msg.style.color = "red";
    }
});

loadCars();
