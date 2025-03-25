document.addEventListener("DOMContentLoaded", function () {
  const productsContainer = document.getElementById("products");
  const categoriesContainer = document.getElementById("categories");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.querySelector(".search-button");

  let allProducts = [];
  let allCategories = [];
  let favoriteProducts = JSON.parse(localStorage.getItem("favorites")) || [];

  async function fetchData() {
    try {
      const productsResponse = await fetch("https://fakestoreapi.com/products");
      allProducts = await productsResponse.json();

      const categoriesResponse = await fetch(
        "https://fakestoreapi.com/products/categories"
      );
      allCategories = await categoriesResponse.json();

      displayCategories();
      displayProducts(allProducts);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      productsContainer.innerHTML =
        '<p class="text-red-500 text-center">Произошла ошибка при загрузке товаров. Пожалуйста, попробуйте позже.</p>';
    }
  }

  function displayCategories() {
    categoriesContainer.innerHTML = "";

    allCategories.forEach((category) => {
      const categoryCard = document.createElement("div");
      categoryCard.className =
        "w-36 h-36 flex flex-col items-center justify-center bg-gray-50 rounded-lg cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg border border-gray-200";
      categoryCard.setAttribute("data-category", category);

      let iconName;
      switch (category) {
        case "electronics":
          iconName = "devices";
          break;
        case "jewelery":
          iconName = "diamond";
          break;
        case "men's clothing":
          iconName = "male";
          break;
        case "women's clothing":
          iconName = "female";
          break;
        default:
          iconName = "shop";
      }

      let categoryRussian;
      switch (category) {
        case "electronics":
          categoryRussian = "Электроника";
          break;
        case "jewelery":
          categoryRussian = "Ювелирные изделия";
          break;
        case "men's clothing":
          categoryRussian = "Мужская одежда";
          break;
        case "women's clothing":
          categoryRussian = "Женская одежда";
          break;
        default:
          categoryRussian = category;
      }

      categoryCard.innerHTML = `
        <div class="w-12 h-12 mb-2">${iconName}</div>
        <div class="text-sm text-center">${categoryRussian}</div>
      `;

      categoryCard.addEventListener("click", () =>
        filterProductsByCategory(category)
      );
      categoriesContainer.appendChild(categoryCard);
    });

    const allCategoriesCard = document.createElement("div");
    allCategoriesCard.className =
      "w-36 h-36 flex flex-col items-center justify-center bg-gray-50 rounded-lg cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-lg border border-gray-200";
    allCategoriesCard.innerHTML = `
      <div class="w-12 h-12 mb-2">+</div>
      <div class="text-sm text-center">Смотреть все</div>
    `;
    allCategoriesCard.addEventListener("click", () =>
      displayProducts(allProducts)
    );
    categoriesContainer.appendChild(allCategoriesCard);
  }

  function displayProducts(products) {
    productsContainer.innerHTML = "";

    products.forEach((product) => {
      const isFavorite = favoriteProducts.includes(product.id);

      const productCard = document.createElement("div");
      productCard.className =
        "border border-gray-200 rounded-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg bg-white";

      let categoryRussian;
      switch (product.category) {
        case "electronics":
          categoryRussian = "Электроника";
          break;
        case "jewelery":
          categoryRussian = "Ювелирные изделия";
          break;
        case "men's clothing":
          categoryRussian = "Мужская одежда";
          break;
        case "women's clothing":
          categoryRussian = "Женская одежда";
          break;
        default:
          categoryRussian = product.category;
      }

      productCard.innerHTML = `
        <img src="${product.image}" alt="${
        product.title
      }" class="w-full h-48 object-contain p-4 bg-gray-50">
        <div class="p-4">
          <h3 class="text-base font-bold mb-2 text-gray-800 h-10 overflow-hidden">${
            product.title
          }</h3>
          <p class="text-xs text-gray-600 mb-2">Категория: ${categoryRussian}</p>
          <p class="text-lg font-bold text-indigo-600 mb-3">${product.price.toLocaleString()} ₽</p>
          <div class="flex justify-between items-center">
            <button class="favorite-button ${
              isFavorite ? "text-red-500" : "text-gray-300"
            } hover:text-red-500 transition-colors" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart${
                isFavorite ? "-fill" : ""
              }" viewBox="0 0 16 16">
                <path ${
                  isFavorite
                    ? 'd="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"'
                    : 'd="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"'
                }>
                </path>
              </svg>
            </button>
          </div>
        </div>
      `;

      productsContainer.appendChild(productCard);
    });

    document.querySelectorAll(".favorite-button").forEach((button) => {
      button.addEventListener("click", toggleFavorite);
    });
  }

  function filterProductsByCategory(category) {
    const filteredProducts = allProducts.filter(
      (product) => product.category === category
    );
    displayProducts(filteredProducts);
  }

  function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === "") {
      displayProducts(allProducts);
      return;
    }

    const filteredProducts = allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
  }

  function toggleFavorite(event) {
    const button = event.currentTarget;
    const productId = parseInt(button.getAttribute("data-id"));

    const index = favoriteProducts.indexOf(productId);

    if (index === -1) {
      favoriteProducts.push(productId);
      button.classList.remove("text-gray-300");
      button.classList.add("text-red-500");
      button.querySelector("svg").classList.remove("bi-heart");
      button.querySelector("svg").classList.add("bi-heart-fill");
      button
        .querySelector("path")
        .setAttribute(
          "d",
          "M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
        );
    } else {
      favoriteProducts.splice(index, 1);
      button.classList.remove("text-red-500");
      button.classList.add("text-gray-300");
      button.querySelector("svg").classList.remove("bi-heart-fill");
      button.querySelector("svg").classList.add("bi-heart");
      button
        .querySelector("path")
        .setAttribute(
          "d",
          "m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"
        );
    }

    localStorage.setItem("favorites", JSON.stringify(favoriteProducts));
  }

  searchButton.addEventListener("click", searchProducts);
  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchProducts();
    }
  });

  fetchData();
});
