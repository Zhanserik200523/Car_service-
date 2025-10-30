
const token = localStorage.getItem("token");

document.getElementById("productForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseInt(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;

    const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, description, price, quantity, category, image })
    });

    if (res.ok) {
        alert("Товар добавлен");
        e.target.reset();
        loadProducts();
    } else {
        const data = await res.json();
        alert(data.error || "Ошибка при добавлении");
    }
});

async function loadProducts() {
    const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const list = document.getElementById("productsList");
    list.innerHTML = '';

    data.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm";

        card.innerHTML = `
  <img src="${product.image || 'https://via.placeholder.com/300x200?text=Нет+фото'}"
       class="card-img-top"
       style="max-height: 250px; object-fit: contain; background-color: #f8f9fa;"
       alt="${product.name}"
       onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=Нет+фото';">
  <div class="card-body d-flex flex-column">
    <h5 class="card-title">${product.name}</h5>
    <p class="card-text text-muted">${product.description}</p>
    <p class="card-text"><strong>Категория:</strong> <span class="badge bg-secondary">${product.category}</span></p>
    <p class="card-text"><strong>Цена:</strong> ${product.price} ₸</p>
    <p class="card-text"><strong>Остаток:</strong> 
      ${product.quantity > 0
            ? `<span class="text-success">${product.quantity} шт.</span>`
            : `<span class="text-danger">Нет в наличии</span>`}
    </p>
    <button class="btn btn-outline-danger mt-auto" onclick="deleteProduct(${product.id})">🗑 Удалить</button>
    <button class="btn btn-sm btn-outline-primary mt-2" onclick='openEditModal(${JSON.stringify(product)})'>Изменить</button>

  </div>
`;



        col.appendChild(card);
        list.appendChild(col);
    });
}

async function deleteProduct(id) {
    const ok = confirm("Удалить этот товар?");
    if (!ok) return;

    const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
        alert("Удалено");
        loadProducts();
    } else {
        const data = await res.json();
        alert(data.error || "Ошибка при удалении");
    }
}

loadProducts();

function openEditModal(product) {
    document.getElementById("editId").value = product.id;
    document.getElementById("editName").value = product.name;
    document.getElementById("editImage").value = product.image;
    document.getElementById("editDescription").value = product.description;
    document.getElementById("editPrice").value = product.price;
    document.getElementById("editQuantity").value = product.quantity;
    document.getElementById("editCategory").value = product.category;

    const modal = new bootstrap.Modal(document.getElementById("editProductModal"));
    modal.show();
}

document.getElementById("editProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("editId").value;
    const data = {
        name: document.getElementById("editName").value,
        image: document.getElementById("editImage").value,
        description: document.getElementById("editDescription").value,
        price: parseInt(document.getElementById("editPrice").value),
        quantity: parseInt(document.getElementById("editQuantity").value),
        category: document.getElementById("editCategory").value,
    };

    const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Товар обновлён");
        bootstrap.Modal.getInstance(document.getElementById("editProductModal")).hide();
        loadProducts();
    } else {
        alert("Ошибка при обновлении");
    }
});
