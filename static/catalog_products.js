let allProducts = [];

async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    allProducts = data;
    renderProducts(data);
}

function renderProducts(products) {
    const list = document.getElementById("productList");
    list.innerHTML = '';

    if (products.length === 0) {
        list.innerHTML = '<p class="text-muted">Ничего не найдено</p>';
        return;
    }

    products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        col.innerHTML = `
      <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="card-img-top">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title mb-1">${product.name}</h5>
          <p class="card-text text-muted small">${product.description}</p>
          <p class="card-text mb-1"><strong>Категория:</strong> 
            <span class="badge bg-secondary">${product.category}</span>
          </p>
          <p class="card-text mb-1"><strong>Цена:</strong> ${product.price} ₸</p>
          <p class="card-text mb-2"><strong>Остаток:</strong> 
            ${product.quantity > 0
            ? `<span class="text-success">${product.quantity} шт.</span>`
            : `<span class="text-danger">Нет в наличии</span>`}
          </p>
        </div>
      </div>
    `;
        list.appendChild(col);
    });
}

function filterProducts() {
    const selectedCategory = document.querySelector(".category-link.active").dataset.category;
    const searchText = document.getElementById("searchInput").value.toLowerCase();

    const filtered = allProducts.filter(p => {
        const matchCategory = selectedCategory === "Все" || p.category === selectedCategory;
        const matchSearch = p.name.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });

    renderProducts(filtered);
}

document.getElementById("searchInput").addEventListener("input", filterProducts);

document.querySelectorAll(".category-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".category-link").forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        filterProducts();
    });
});

loadProducts();
