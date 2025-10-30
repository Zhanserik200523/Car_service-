async function protectPage({ onlyAdmin = false } = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login";
        return;
    }

    const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        window.location.href = "/login";
        return;
    }

    const data = await res.json();


    if (onlyAdmin && data.role !== "admin") {
        alert("Доступ запрещён. Только для администратора.");
        window.location.href = "/profile";
    }
}
