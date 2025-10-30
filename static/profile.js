async function fetchProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById('email').textContent = data.email;
        document.getElementById('role').textContent = data.role;
        document.getElementById("avatarImage").src = data.avatar || "/static/avatars/default.png";
        document.getElementById("firstName").value = data.first_name || '';
        document.getElementById("lastName").value = data.last_name || '';
        document.getElementById("phone").value = data.phone || '';

    } else {
        alert('Ошибка загрузки профиля');
        window.location.href = "/login";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

fetchProfile();
document.getElementById('changePasswordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = localStorage.getItem("token");
    const msg = document.getElementById('changePasswordMessage');

    if (newPassword !== confirmPassword) {
        msg.textContent = "❌ Новый пароль и подтверждение не совпадают!";
        msg.style.color = "red";
        return;
    }

    const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });

    const data = await response.json();

    if (response.ok) {
        msg.textContent = "✅ Пароль успешно изменён!";
        msg.style.color = "green";
    } else {
        msg.textContent = `❌ ${data.error || "Ошибка при смене пароля"}`;
        msg.style.color = "red";
    }

    // Очистить поля
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
});




document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("avatarFile");
    const file = fileInput.files[0];
    const token = localStorage.getItem("token");

    if (!file) {
        alert("Выберите файл");
        return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch("/api/upload-avatar", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById("avatarImage").src = data.avatar;
        alert("Аватар загружен!");
    } else {
        alert(data.error);
    }
});
document.getElementById("userDetailsForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const token = localStorage.getItem("token");

    const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, phone: phone })
    });

    const msg = document.getElementById("userDetailsMessage");
    const dataRes = await response.json();

    if (response.ok) {
        msg.textContent = "Данные обновлены!";
        msg.style.color = "green";
    } else {
        msg.textContent = dataRes.error;
        msg.style.color = "red";
    }
});

