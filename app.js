// Dữ liệu sản phẩm mẫu
let products = [
    {
        id: 1,
        name: "Bàn Gaming Cao Cấp LED",
        price: 1250000,
        description: "Bàn gaming với đèn LED 7 màu, mặt bàn chống trầy",
        shopeeLink: "https://shopee.vn/product/1",
        sold: 234,
        discount: 15,
        category: "Bàn gaming",
        images: ["https://picsum.photos/id/1/300/300"],
        createdAt: new Date("2024-01-15")
    },
    {
        id: 2,
        name: "Ghế Công Thái Học Ergonomic",
        price: 2890000,
        description: "Ghế xoay cao cấp, nâng đỡ cột sống",
        shopeeLink: "https://shopee.vn/product/2",
        sold: 189,
        discount: 20,
        category: "Setup PC",
        images: ["https://picsum.photos/id/2/300/300"],
        createdAt: new Date("2024-01-20")
    },
    {
        id: 3,
        name: "Đèn LED Dây 5m",
        price: 199000,
        description: "Đèn LED dây đổi màu điều khiển từ xa",
        shopeeLink: "https://shopee.vn/product/3",
        sold: 567,
        discount: 10,
        category: "Đèn LED",
        images: ["https://picsum.photos/id/3/300/300"],
        createdAt: new Date("2024-02-01")
    },
    {
        id: 4,
        name: "Bàn Phím Cơ RGB",
        price: 899000,
        description: "Bàn phím cơ với 104 phím, switch xanh",
        shopeeLink: "https://shopee.vn/product/4",
        sold: 432,
        discount: 5,
        category: "Phụ kiện",
        images: ["https://picsum.photos/id/4/300/300"],
        createdAt: new Date("2024-02-10")
    },
    {
        id: 5,
        name: "Tủ Kệ Gỗ Để Đồ",
        price: 1850000,
        description: "Kệ gỗ công nghiệp, 5 ngăn để đồ",
        shopeeLink: "https://shopee.vn/product/5",
        sold: 89,
        discount: 12,
        category: "Kệ đồ",
        images: ["https://picsum.photos/id/5/300/300"],
        createdAt: new Date("2024-02-15")
    },
    {
        id: 6,
        name: "Thảm Trải Sàn Cao Cấp",
        price: 450000,
        description: "Thảm lông mềm mại, kích thước 1.2m x 1.6m",
        shopeeLink: "https://shopee.vn/product/6",
        sold: 345,
        discount: 0,
        category: "Thảm",
        images: ["https://picsum.photos/id/6/300/300"],
        createdAt: new Date("2024-02-20")
    },
    {
        id: 7,
        name: "Gương Trang Trí Phòng Ngủ",
        price: 650000,
        description: "Gương trang trí khung gỗ, kích thước 60x90cm",
        shopeeLink: "https://shopee.vn/product/7",
        sold: 123,
        discount: 8,
        category: "Gương",
        images: ["https://picsum.photos/id/7/300/300"],
        createdAt: new Date("2024-03-01")
    },
    {
        id: 8,
        name: "Khung Ảnh Trang Trí",
        price: 125000,
        description: "Khung ảnh gỗ 20x30cm, nhiều màu",
        shopeeLink: "https://shopee.vn/product/8",
        sold: 678,
        discount: 0,
        category: "Decor phòng",
        images: ["https://picsum.photos/id/8/300/300"],
        createdAt: new Date("2024-03-05")
    },
    {
        id: 9,
        name: "CPU Gaming i7 RTX 3060",
        price: 15999000,
        description: "CPU Gaming cao cấp, RAM 16GB, SSD 512GB",
        shopeeLink: "https://shopee.vn/product/9",
        sold: 45,
        discount: 25,
        category: "Setup PC",
        images: ["https://picsum.photos/id/9/300/300"],
        createdAt: new Date("2024-03-10")
    },
    {
        id: 10,
        name: "Bàn Phím Cơ Gateron Yellow",
        price: 1290000,
        description: "Bàn phím cơ custom, switch Gateron Yellow",
        shopeeLink: "https://shopee.vn/product/10",
        sold: 234,
        discount: 10,
        category: "Phụ kiện",
        images: ["https://picsum.photos/id/10/300/300"],
        createdAt: new Date("2024-03-12")
    },
    {
        id: 11,
        name: "Đèn Bàn Học LED",
        price: 249000,
        description: "Đèn bàn học chống cận, 3 chế độ ánh sáng",
        shopeeLink: "https://shopee.vn/product/11",
        sold: 890,
        discount: 5,
        category: "Đèn LED",
        images: ["https://picsum.photos/id/11/300/300"],
        createdAt: new Date("2024-03-15")
    },
    {
        id: 12,
        name: "Kệ Treo Tường Trang Trí",
        price: 189000,
        description: "Kệ treo tường 3 tầng, chịu lực tốt",
        shopeeLink: "https://shopee.vn/product/12",
        sold: 456,
        discount: 0,
        category: "Kệ đồ",
        images: ["https://picsum.photos/id/12/300/300"],
        createdAt: new Date("2024-03-18")
    }
];

// Load dữ liệu từ localStorage nếu có
function loadProductsFromStorage() {
    const stored = localStorage.getItem('shop_products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        localStorage.setItem('shop_products', JSON.stringify(products));
    }
}

// Lưu dữ liệu
function saveProductsToStorage() {
    localStorage.setItem('shop_products', JSON.stringify(products));
}

// Biến toàn cục
let currentFilter = 'popular';
let searchKeyword = '';
let currentCategory = null;

// DOM Elements
let productsGrid, skeletonGrid, noResults, searchInput, clearSearch, toast;

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromStorage();
    initElements();
    initDarkMode();
    initScrollTop();
    initCarousel();
    initTabs();
    initFilters();
    initSearch();
    loadCategories();
    renderProducts();
});

function initElements() {
    productsGrid = document.getElementById('productsGrid');
    skeletonGrid = document.getElementById('skeletonGrid');
    noResults = document.getElementById('noResults');
    searchInput = document.getElementById('searchInput');
    clearSearch = document.getElementById('clearSearch');
    toast = document.getElementById('toast');
}

// Dark Mode
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('darkMode', 'enabled');
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Scroll Top
function initScrollTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Carousel
function initCarousel() {
    let currentSlide = 0;
    const slides = document.querySelector('.carousel-slides');
    const slideCount = document.querySelectorAll('.carousel-slide').length;
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!slides) return;
    
    // Tạo dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    function updateSlides() {
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlides();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlides();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    setInterval(nextSlide, 5000);
}

// Tabs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}Tab`).classList.add('active');
            
            if (tabId === 'products') {
                renderProducts();
            }
        });
    });
}

// Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.sort;
            renderProducts();
        });
    });
}

// Search
function initSearch() {
    searchInput.addEventListener('input', (e) => {
        searchKeyword = e.target.value.toLowerCase();
        clearSearch.style.display = searchKeyword ? 'block' : 'none';
        renderProducts();
    });
    
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        searchKeyword = '';
        clearSearch.style.display = 'none';
        renderProducts();
    });
}

// Lọc sản phẩm
function filterProducts() {
    let filtered = [...products];
    
    // Lọc theo search
    if (searchKeyword) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchKeyword) ||
            p.description.toLowerCase().includes(searchKeyword) ||
            p.category.toLowerCase().includes(searchKeyword)
        );
    }
    
    // Lọc theo category
    if (currentCategory) {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    // Sắp xếp
    switch(currentFilter) {
        case 'popular':
            filtered.sort((a, b) => b.sold - a.sold);
            break;
        case 'newest':
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'bestseller':
            filtered.sort((a, b) => b.sold - a.sold);
            break;
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
    }
    
    return filtered;
}

// Hiển thị sản phẩm
function renderProducts() {
    if (!productsGrid) return;
    
    // Show skeleton
    skeletonGrid.style.display = 'grid';
    productsGrid.style.display = 'none';
    noResults.style.display = 'none';
    
    setTimeout(() => {
        const filtered = filterProducts();
        
        skeletonGrid.style.display = 'none';
        
        if (filtered.length === 0) {
            productsGrid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }
        
        productsGrid.style.display = 'grid';
        productsGrid.innerHTML = filtered.map(product => createProductCard(product)).join('');
        
        // Gắn sự kiện cho nút mua
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const link = btn.dataset.link;
                if (link) window.open(link, '_blank');
            });
        });
    }, 300);
}

// Tạo card sản phẩm
function createProductCard(product) {
    const discountedPrice = product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
    
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${new Intl.NumberFormat('vi-VN').format(discountedPrice)}đ
                    ${product.discount > 0 ? `<span class="original-price">${new Intl.NumberFormat('vi-VN').format(product.price)}đ</span>` : ''}
                </div>
                <div class="product-sold">Đã bán ${product.sold}</div>
                <button class="buy-btn" data-link="${product.shopeeLink}">Mua ngay</button>
            </div>
        </div>
    `;
}

// Load categories
function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    const categories = [...new Set(products.map(p => p.category))];
    
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card" data-category="${cat}">
            <i class="fas fa-tag"></i>
            <h3>${cat}</h3>
        </div>
    `).join('');
    
    // Gắn sự kiện click category
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            currentCategory = category;
            document.getElementById('categoryTitle').innerHTML = `<i class="fas fa-tag"></i> ${category}`;
            
            // Chuyển sang tab sản phẩm và hiển thị sản phẩm theo danh mục
            document.querySelector('[data-tab="products"]').click();
            renderProducts();
            currentCategory = null;
        });
    });
}

// Hiển thị toast
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.background = type === 'success' ? '#4caf50' : '#f44336';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
