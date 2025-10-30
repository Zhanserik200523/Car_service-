// document.getElementById('addCarForm').addEventListener('submit', async function (e) {
//     e.preventDefault();
//
//     const brand = document.getElementById('brand').value;
//     const model = document.getElementById('model').value;
//     const year = parseInt(document.getElementById('year').value);
//
//     const token = localStorage.getItem("token");
//
//     const response = await fetch('/api/add-car', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ brand, model, year })
//     });
//
//     const data = await response.json();
//
//     if (response.ok) {
//         alert("Машина добавлена успешно!");
//         window.location.href = "/";
//     } else {
//         alert(data.error);
//     }
// });
// if (!localStorage.getItem("token")) {
//     window.location.href = "/login"; // если нет токена ➔ перебросить на логин
// }
document.getElementById('addCarForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = parseInt(document.getElementById('year').value);
    const token = localStorage.getItem("token");

    const response = await fetch('/api/add-car', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ brand, model, year })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Машина добавлена успешно!");
        window.location.href = "/cars"; // можно сразу на список машин
    } else {
        alert(data.error || "Ошибка при добавлении");
    }
});

if (!localStorage.getItem("token")) {
    window.location.href = "/login";
}
