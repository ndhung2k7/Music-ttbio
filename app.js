let products = [];
let categories = [];
let shopSettings = {
    rating: 4.9,
    reviewCount: 2300
};

const badgeIcons = {
    'favorite': 'https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lyb3m8mjjmape6',
    'sale': 'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mfjl4hy7rsi3b3',
    'gift': 'https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lyb3kdam2qw17d'
};

const badgeNames = {
    'favorite': 'Yêu thích',
    'sale': 'Ưu đãi sốc',
    'gift': 'Quà tặng'
};

// Biến toàn cục
let currentFilter = 'popular';
let searchKeyword = '';
let currentCategory = null;
let currentProduct = null;
let currentImageIndex = 0;
let activeCategoryFilter = 'all';

// DOM Elements
let productsGrid, skeletonGrid, noResults, searchInput, clearSearch, toast, loadingOverlay, backBtn, modal;

// Load shop settings
function loadShopSettings() {
    const stored = localStorage.getItem('shop_settings');
    if (stored) {
        shopSettings = JSON.parse(stored);
    } else {
        localStorage.setItem('shop_settings', JSON.stringify(shopSettings));
    }
    updateShopRatingDisplay();
}

function updateShopRatingDisplay() {
    const ratingSpan = document.getElementById('shopRatingDisplay');
    const reviewSpan = document.getElementById('shopReviewCountDisplay');
    if (ratingSpan && reviewSpan) {
        ratingSpan.textContent = shopSettings.rating;
        reviewSpan.textContent = shopSettings.reviewCount >= 1000 
            ? (shopSettings.reviewCount / 1000).toFixed(1) + 'k' 
            : shopSettings.reviewCount;
    }
}

// Load dữ liệu từ localStorage
function loadProductsFromStorage() {
    const stored = localStorage.getItem('shop_products');
    const storedCategories = localStorage.getItem('shop_categories');
    
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [
            {
                id: 1,
                name: "Bàn Gaming Cao Cấp LED",
                price: 1250000,
                description: "Bàn gaming cao cấp với đèn LED 7 màu, mặt bàn chống trầy, khung thép chắc chắn, chịu lực tốt lên đến 100kg. Sản phẩm được thiết kế hiện đại, phù hợp cho game thủ chuyên nghiệp.",
                shopeeLink: "https://shopee.vn/product/1",
                sold: 234,
                discount: 15,
                category: "Bàn gaming",
                images: ["https://picsum.photos/id/1/400/400", "https://picsum.photos/id/10/400/400"],
                createdAt: new Date("2024-01-15"),
                selectedBadge: "favorite"
            },
            {
                id: 2,
                name: "Ghế Công Thái Học Ergonomic",
                price: 2890000,
                description: "Ghế công thái học cao cấp, tựa lưng điều chỉnh linh hoạt, đệm ngồi êm ái, hỗ trợ tốt cho cột sống.",
                shopeeLink: "https://shopee.vn/product/2",
                sold: 189,
                discount: 20,
                category: "Setup PC",
                images: ["https://picsum.photos/id/2/400/400"],
                createdAt: new Date("2024-01-20"),
                selectedBadge: "sale"
            },
            {
                id: 3,
                name: "Đèn LED Dây 5m RGB",
                price: 199000,
                description: "Đèn LED dây RGB 5m, điều khiển từ xa, 16 triệu màu, có thể đồng bộ theo nhạc.",
                shopeeLink: "https://shopee.vn/product/3",
                sold: 567,
                discount: 10,
                category: "Đèn LED",
                images: ["https://picsum.photos/id/3/400/400"],
                createdAt: new Date("2024-02-01"),
                selectedBadge: "gift"
            },
            {
                id: 4,
                name: "Bàn Phím Cơ RGB",
                price: 899000,
                description: "Bàn phím cơ RGB 104 phím, switch xanh, đèn LED RGB, phím bấm êm ái.",
                shopeeLink: "https://shopee.vn/product/4",
                sold: 432,
                discount: 5,
                category: "Phụ kiện",
                images: ["https://picsum.photos/id/4/400/400"],
                createdAt: new Date("2024-02-10"),
                selectedBadge: "favorite"
            },
            {
                id: 5,
                name: "Tủ Kệ Gỗ Để Đồ",
                price: 1850000,
                description: "Tủ kệ gỗ công nghiệp cao cấp, 5 ngăn để đồ, chịu lực tốt, thiết kế hiện đại.",
                shopeeLink: "https://shopee.vn/product/5",
                sold: 89,
                discount: 12,
                category: "Kệ đồ",
                images: ["https://picsum.photos/id/5/400/400"],
                createdAt: new Date("2024-02-15"),
                selectedBadge: "sale"
            },
            {
                id: 6,
                name: "Thảm Trải Sàn Cao Cấp",
                price: 450000,
                description: "Thảm lông mềm mại, kích thước 1.2m x 1.6m, chống trơn trượt.",
                shopeeLink: "https://shopee.vn/product/6",
                sold: 345,
                discount: 0,
                category: "Thảm",
                images: ["https://picsum.photos/id/6/400/400"],
                createdAt: new Date("2024-02-20"),
                selectedBadge: null
            },
            {
                id: 7,
                name: "Gương Trang Trí Phòng Ngủ",
                price: 650000,
                description: "Gương trang trí khung gỗ, kích thước 60x90cm, thiết kế tối giản, sang trọng.",
                shopeeLink: "https://shopee.vn/product/7",
                sold: 123,
                discount: 8,
                category: "Gương",
                images: ["https://picsum.photos/id/7/400/400"],
                createdAt: new Date("2024-03-01"),
                selectedBadge: "gift"
            },
            {
                id: 8,
                name: "Khung Ảnh Trang Trí",
                price: 125000,
                description: "Khung ảnh gỗ 20x30cm, nhiều màu sắc, treo tường hoặc để bàn.",
                shopeeLink: "https://shopee.vn/product/8",
                sold: 678,
                discount: 0,
                category: "Decor phòng",
                images: ["https://picsum.photos/id/8/400/400"],
                createdAt: new Date("2024-03-05"),
                selectedBadge: "favorite"
            },
            {
                id: 9,
                name: "CPU Gaming i7 RTX 3060",
                price: 15999000,
                description: "CPU Gaming cao cấp, Intel Core i7, RAM 16GB DDR4, SSD 512GB, VGA RTX 3060 12GB.",
                shopeeLink: "https://shopee.vn/product/9",
                sold: 45,
                discount: 25,
                category: "Setup PC",
                images: ["https://picsum.photos/id/9/400/400"],
                createdAt: new Date("2024-03-10"),
                selectedBadge: "sale"
            },
            {
                id: 10,
                name: "Bàn Phím Cơ Custom",
                price: 1290000,
                description: "Bàn phím cơ custom, switch Gateron Yellow, keycap PBT, khung nhôm.",
                shopeeLink: "https://shopee.vn/product/10",
                sold: 234,
                discount: 10,
                category: "Phụ kiện",
                images: ["https://picsum.photos/id/10/400/400"],
                createdAt: new Date("2024-03-12"),
                selectedBadge: "gift"
            },
            {
                id: 11,
                name: "Đèn Bàn Học LED",
                price: 249000,
                description: "Đèn bàn học chống cận, 3 chế độ ánh sáng, cảm ứng chạm.",
                shopeeLink: "https://shopee.vn/product/11",
                sold: 890,
                discount: 5,
                category: "Đèn LED",
                images: ["https://picsum.photos/id/11/400/400"],
                createdAt: new Date("2024-03-15"),
                selectedBadge: "favorite"
            },
            {
                id: 12,
                name: "Kệ Treo Tường Trang Trí",
                price: 189000,
                description: "Kệ treo tường 3 tầng, chịu lực tốt, thiết kế hiện đại.",
                shopeeLink: "https://shopee.vn/product/12",
                sold: 456,
                discount: 0,
                category: "Kệ đồ",
                images: ["https://picsum.photos/id/12/400/400"],
                createdAt: new Date("2024-03-18"),
                selectedBadge: null
            }
        ];
        saveProductsToStorage();
    }
    
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        categories = ["Decor phòng", "Bàn gaming", "Setup PC", "Đèn LED", "Phụ kiện", "Nội thất", "Thảm", "Gương", "Kệ đồ"];
        localStorage.setItem('shop_categories', JSON.stringify(categories));
    }
}

function saveProductsToStorage() {
    localStorage.setItem('shop_products', JSON.stringify(products));
    updateProductCount();
}

function updateProductCount() {
    const countSpan = document.getElementById('productCount');
    if (countSpan) {
        countSpan.textContent = products.length;
    }
}

// Khởi tạo DOM
function initElements() {
    productsGrid = document.getElementById('productsGrid');
    skeletonGrid = document.getElementById('skeletonGrid');
    noResults = document.getElementById('noResults');
    searchInput = document.getElementById('searchInput');
    clearSearch = document.getElementById('clearSearch');
    toast = document.getElementById('toast');
    loadingOverlay = document.getElementById('loadingOverlay');
    backBtn = document.getElementById('backBtn');
    modal = document.getElementById('productModal');
    
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchKeyword = '';
            clearSearch.style.display = 'none';
            renderProducts();
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', closeProductDetail);
    }
    
    const clearCategoryFilter = document.getElementById('clearCategoryFilter');
    if (clearCategoryFilter) {
        clearCategoryFilter.addEventListener('click', clearCategoryFilterClick);
    }
}

function initModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeProductDetail);
    }
}

// Dark Mode
function initDarkMode() {
    const themeSwitch = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark');
    }
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
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
            } else if (tabId === 'categories') {
                renderCategoriesGrid();
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

// Category Filter Tags
function initCategoryFilterTags() {
    const dynamicTags = document.getElementById('dynamicCategoryTags');
    if (!dynamicTags) return;
    
    dynamicTags.innerHTML = categories.map(cat => `
        <button class="category-tag" data-category="${cat}">${cat}</button>
    `).join('');
    
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = tag.dataset.category;
            if (category) {
                setCategoryFilter(category);
            }
        });
    });
    
    const allTag = document.querySelector('#allCategoryTag');
    if (allTag) {
        const newAllTag = allTag.cloneNode(true);
        allTag.parentNode.replaceChild(newAllTag, allTag);
        newAllTag.addEventListener('click', (e) => {
            e.stopPropagation();
            setCategoryFilter('all');
        });
    }
}

// Set category filter
function setCategoryFilter(category) {
    activeCategoryFilter = category;
    
    document.querySelectorAll('.category-tag').forEach(tag => {
        if (tag.dataset.category === category) {
            tag.classList.add('active');
        } else {
            tag.classList.remove('active');
        }
    });
    
    const allTag = document.querySelector('#allCategoryTag');
    if (allTag) {
        if (category === 'all') {
            allTag.classList.add('active');
        } else {
            allTag.classList.remove('active');
        }
    }
    
    const filterTagsContainer = document.getElementById('categoryFilterTags');
    if (filterTagsContainer) {
        if (category !== 'all') {
            filterTagsContainer.style.display = 'flex';
            let banner = document.getElementById('activeCategoryBanner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'activeCategoryBanner';
                banner.className = 'active-category-banner';
                filterTagsContainer.parentNode.insertBefore(banner, filterTagsContainer.nextSibling);
            }
            const productCount = products.filter(p => p.category === category).length;
            banner.innerHTML = `
                <span><i class="fas fa-tag"></i> Đang xem danh mục: <strong>${category}</strong> (${productCount} sản phẩm)</span>
                <button onclick="clearCategoryFilterClick()"><i class="fas fa-times"></i> Xóa lọc</button>
            `;
        } else {
            filterTagsContainer.style.display = 'none';
            const banner = document.getElementById('activeCategoryBanner');
            if (banner) banner.remove();
        }
    }
    
    renderProducts();
}

function clearCategoryFilterClick() {
    setCategoryFilter('all');
    renderProducts();
}

// Lọc sản phẩm
function filterProducts() {
    let filtered = [...products];
    
    if (searchKeyword) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchKeyword) ||
            p.description.toLowerCase().includes(searchKeyword) ||
            p.category.toLowerCase().includes(searchKeyword)
        );
    }
    
    if (activeCategoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategoryFilter);
    }
    
    if (currentCategory) {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
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

// Render sản phẩm
function renderProducts() {
    if (!productsGrid) return;
    
    if (skeletonGrid) skeletonGrid.style.display = 'grid';
    if (productsGrid) productsGrid.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    
    setTimeout(() => {
        const filtered = filterProducts();
        
        if (skeletonGrid) skeletonGrid.style.display = 'none';
        
        if (filtered.length === 0) {
            if (productsGrid) productsGrid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (productsGrid) {
            productsGrid.style.display = 'grid';
            productsGrid.innerHTML = filtered.map(product => createProductCard(product)).join('');
            
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('buy-btn')) {
                        const productId = parseInt(card.dataset.id);
                        showProductDetail(productId);
                    }
                });
            });
            
            document.querySelectorAll('.buy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const link = btn.dataset.link;
                    if (link) window.open(link, '_blank');
                });
            });
        }
    }, 300);
}

// Tạo card sản phẩm với class badge riêng
function createProductCard(product) {
    const discountedPrice = product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
    
    // Xác định class cho badge dựa trên loại
    let badgeClass = '';
    if (product.selectedBadge === 'favorite') {
        badgeClass = 'badge-favorite';
    } else if (product.selectedBadge === 'sale') {
        badgeClass = 'badge-sale';
    } else if (product.selectedBadge === 'gift') {
        badgeClass = 'badge-gift';
    }
    
    const badgeHtml = product.selectedBadge && badgeIcons[product.selectedBadge]
        ? `<div class="product-badge-inline ${badgeClass}" title="${badgeNames[product.selectedBadge] || ''}">
            <img src="${badgeIcons[product.selectedBadge]}" alt="${badgeNames[product.selectedBadge] || 'badge'}">
           </div>`
        : '';
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-title-wrapper">
                    ${badgeHtml}
                    <h3 class="product-title">${product.name}</h3>
                </div>
                <div class="product-price-wrapper">
                    <span class="product-price">${new Intl.NumberFormat('vi-VN').format(discountedPrice)}đ</span>
                    ${product.discount > 0 ? `<span class="original-price">${new Intl.NumberFormat('vi-VN').format(product.price)}đ</span>` : ''}
                </div>
                <div class="product-sold">
                    <i class="fas fa-chart-line"></i> Đã bán ${product.sold}
                </div>
                <button class="buy-btn" data-link="${product.shopeeLink}">
                    <i class="fas fa-bolt"></i> Mua ngay
                </button>
            </div>
        </div>
    `;
}

// Hiển thị ảnh phóng to
function showFullImage(index) {
    if (!currentProduct) return;
    
    currentImageIndex = index;
    const images = currentProduct.images;
    
    const imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
        <div class="image-modal-overlay"></div>
        <div class="image-modal-container">
            <button class="image-modal-close"><i class="fas fa-times"></i></button>
            <img class="image-modal-img" src="${images[currentImageIndex]}" alt="Product image">
            <button class="image-modal-nav image-modal-prev"><i class="fas fa-chevron-left"></i></button>
            <button class="image-modal-nav image-modal-next"><i class="fas fa-chevron-right"></i></button>
            <div class="image-modal-counter">${currentImageIndex + 1} / ${images.length}</div>
        </div>
    `;
    
    document.body.appendChild(imageModal);
    document.body.style.overflow = 'hidden';
    imageModal.classList.add('active');
    
    const closeBtn = imageModal.querySelector('.image-modal-close');
    const overlay = imageModal.querySelector('.image-modal-overlay');
    
    const closeModal = () => {
        imageModal.classList.remove('active');
        setTimeout(() => {
            imageModal.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    const prevBtn = imageModal.querySelector('.image-modal-prev');
    const nextBtn = imageModal.querySelector('.image-modal-next');
    const imgElement = imageModal.querySelector('.image-modal-img');
    const counter = imageModal.querySelector('.image-modal-counter');
    
    const updateImage = () => {
        imgElement.src = images[currentImageIndex];
        counter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    };
    
    prevBtn.addEventListener('click', () => {
        if (images.length > 1) {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateImage();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (images.length > 1) {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateImage();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (!imageModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
    });
}

// Hiển thị chi tiết sản phẩm
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    currentImageIndex = 0;
    
    const discountedPrice = product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
    
    // Xác định class cho badge detail
    let detailBadgeClass = '';
    if (product.selectedBadge === 'favorite') {
        detailBadgeClass = 'product-detail-badge-favorite';
    } else if (product.selectedBadge === 'sale') {
        detailBadgeClass = 'product-detail-badge-sale';
    } else if (product.selectedBadge === 'gift') {
        detailBadgeClass = 'product-detail-badge-gift';
    }
    
    const badgeHtml = product.selectedBadge && badgeIcons[product.selectedBadge]
        ? `<div class="product-detail-badge ${detailBadgeClass}">
            <img src="${badgeIcons[product.selectedBadge]}" alt="${badgeNames[product.selectedBadge]}">
            <span>${badgeNames[product.selectedBadge] || ''}</span>
           </div>`
        : '';
    
    const thumbsHtml = product.images.map((img, idx) => `
        <img src="${img}" alt="thumb ${idx}" onclick="changeMainImage(${idx})">
    `).join('');
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-gallery">
                <div class="product-detail-main-img" onclick="showFullImage(${currentImageIndex})">
                    <img src="${product.images[0]}" alt="${product.name}" id="mainImage">
                    <button class="gallery-nav-btn gallery-prev" onclick="event.stopPropagation(); navigateGallery(-1)"><i class="fas fa-chevron-left"></i></button>
                    <button class="gallery-nav-btn gallery-next" onclick="event.stopPropagation(); navigateGallery(1)"><i class="fas fa-chevron-right"></i></button>
                    <div class="zoom-hint"><i class="fas fa-search-plus"></i> Click để phóng to</div>
                </div>
                <div class="product-detail-thumbs" id="thumbContainer">
                    ${thumbsHtml}
                </div>
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                ${badgeHtml}
                <div class="product-detail-price">
                    <span class="current-price">${new Intl.NumberFormat('vi-VN').format(discountedPrice)}đ</span>
                    ${product.discount > 0 ? `<span class="original-price">${new Intl.NumberFormat('vi-VN').format(product.price)}đ</span>` : ''}
                    ${product.discount > 0 ? `<span class="discount">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-detail-stats">
                    <span><i class="fas fa-chart-line"></i> <strong>${product.sold}</strong> đã bán</span>
                    <span><i class="fas fa-star"></i> <strong>${shopSettings.rating}</strong> (${shopSettings.reviewCount.toLocaleString()} đánh giá)</span>
                    <span><i class="fas fa-truck"></i> <strong>Miễn phí</strong> vận chuyển</span>
                </div>
                <div class="product-detail-description">
                    <h4>Mô tả sản phẩm</h4>
                    <p>${product.description}</p>
                </div>
                <div class="product-detail-actions">
                    <button class="buy-now-btn" onclick="window.open('${product.shopeeLink}', '_blank')">
                        <i class="fas fa-bolt"></i> Mua ngay trên Shopee
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    backBtn.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateGallery(direction) {
    if (!currentProduct) return;
    
    const images = currentProduct.images;
    if (images.length <= 1) return;
    
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    
    const mainImage = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('#thumbContainer img');
    
    if (mainImage) {
        mainImage.src = images[currentImageIndex];
    }
    
    thumbs.forEach((thumb, i) => {
        if (i === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

window.changeMainImage = function(index) {
    if (!currentProduct) return;
    
    currentImageIndex = index;
    const mainImage = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('#thumbContainer img');
    
    if (mainImage) {
        mainImage.src = currentProduct.images[index];
    }
    
    thumbs.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

window.showFullImage = showFullImage;
window.navigateGallery = navigateGallery;
window.clearCategoryFilterClick = clearCategoryFilterClick;

function closeProductDetail() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    backBtn.style.display = 'none';
    currentProduct = null;
}

// Render categories grid
function renderCategoriesGrid() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;
    
    const categoryIcons = {
        'Decor phòng': 'fa-home',
        'Bàn gaming': 'fa-gamepad',
        'Setup PC': 'fa-desktop',
        'Đèn LED': 'fa-lightbulb',
        'Phụ kiện': 'fa-keyboard',
        'Nội thất': 'fa-couch',
        'Thảm': 'fa-rug',
        'Gương': 'fa-mirror',
        'Kệ đồ': 'fa-shelf'
    };
    
    categoriesGrid.innerHTML = categories.map(cat => {
        const productCount = products.filter(p => p.category === cat).length;
        return `
            <div class="category-card" data-category="${cat}">
                <i class="fas ${categoryIcons[cat] || 'fa-tag'}"></i>
                <h3>${cat}</h3>
                <p>${productCount} sản phẩm</p>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            const productsTabBtn = document.querySelector('[data-tab="products"]');
            if (productsTabBtn) {
                productsTabBtn.click();
            }
            setCategoryFilter(category);
        });
    });
}

function loadCategories() {
    renderCategoriesGrid();
    initCategoryFilterTags();
}

// Toast message
function showToast(message, type = 'success') {
    if (!toast) return;
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.background = type === 'success' 
        ? 'linear-gradient(135deg, #4caf50, #45a049)' 
        : 'linear-gradient(135deg, #f44336, #da190b)';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    loadShopSettings();
    loadProductsFromStorage();
    initElements();
    initDarkMode();
    initScrollTop();
    initTabs();
    initFilters();
    initSearch();
    initModal();
    loadCategories();
    renderProducts();
    updateProductCount();
});
