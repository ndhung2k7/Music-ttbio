let products = [];
let categories = [];
let shopSettings = { rating: 4.9, reviewCount: 2300 };

const badgeIcons = {
    'favorite': 'https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lyb3m8mjjmape6',
    'sale': 'https://down-vn.img.susercontent.com/file/vn-11134258-820l4-mfjl4hy7rsi3b3',
    'gift': 'https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-lyb3kdam2qw17d'
};

let selectedBadge = '';
let selectedImages = [];

// DOM Elements
let productsTableBody, cancelEditBtn, formTitle;

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadShopSettings();
    initDarkMode();
    initElements();
    initImageUpload();
    initBadgeSelection();
    renderProductsTable();
    renderCategoriesList();
    loadCategoriesToSelect();
    
    const productForm = document.getElementById('productForm');
    const cancelEditBtnElem = document.getElementById('cancelEdit');
    
    productForm.addEventListener('submit', handleSubmit);
    cancelEditBtnElem.addEventListener('click', cancelEdit);
});

// Dark Mode cho Admin
function initDarkMode() {
    const darkModeBtn = document.getElementById('adminDarkModeToggle');
    if (localStorage.getItem('adminDarkMode') === 'enabled') {
        document.body.classList.add('dark');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('adminDarkMode', 'enabled');
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('adminDarkMode', 'disabled');
            darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

function loadShopSettings() {
    const stored = localStorage.getItem('shop_settings');
    if (stored) {
        shopSettings = JSON.parse(stored);
    }
    const ratingInput = document.getElementById('shopRating');
    const reviewInput = document.getElementById('shopReviewCount');
    if (ratingInput) ratingInput.value = shopSettings.rating;
    if (reviewInput) reviewInput.value = shopSettings.reviewCount;
}

window.saveShopSettings = function() {
    const rating = parseFloat(document.getElementById('shopRating').value);
    const reviewCount = parseInt(document.getElementById('shopReviewCount').value);
    
    if (isNaN(rating) || rating < 0 || rating > 5) {
        showNotification('Điểm đánh giá phải từ 0 đến 5!', 'error');
        return;
    }
    
    shopSettings = { rating, reviewCount };
    localStorage.setItem('shop_settings', JSON.stringify(shopSettings));
    showNotification('✅ Lưu cài đặt đánh giá thành công!', 'success');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <div class="message">${message}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function loadData() {
    const stored = localStorage.getItem('shop_products');
    const storedCategories = localStorage.getItem('shop_categories');
    
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = [];
    }
    
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        categories = ["Decor phòng", "Bàn gaming", "Setup PC", "Đèn LED", "Phụ kiện", "Nội thất", "Thảm", "Gương", "Kệ đồ"];
        localStorage.setItem('shop_categories', JSON.stringify(categories));
    }
}

function saveProducts() {
    localStorage.setItem('shop_products', JSON.stringify(products));
}

function saveCategories() {
    localStorage.setItem('shop_categories', JSON.stringify(categories));
}

function initElements() {
    productsTableBody = document.getElementById('productsTableBody');
    cancelEditBtn = document.getElementById('cancelEdit');
    formTitle = document.getElementById('formTitle');
}

function initBadgeSelection() {
    const badgeOptions = document.querySelectorAll('.badge-option');
    const selectedBadgeInput = document.getElementById('selectedBadge');
    
    badgeOptions.forEach(option => {
        option.addEventListener('click', () => {
            badgeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedBadge = option.dataset.badge;
            selectedBadgeInput.value = selectedBadge;
        });
    });
}

function loadCategoriesToSelect() {
    const productCategory = document.getElementById('productCategory');
    productCategory.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// Hàm cắt ảnh về tỷ lệ 1:1
function cropToSquare(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const size = Math.min(img.width, img.height);
            canvas.width = 400;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;
            
            ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400);
            callback(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function initImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');
    const imageUrls = document.getElementById('imageUrls');
    const imagePreview = document.getElementById('imagePreview');
    
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        uploadArea.style.background = 'rgba(102,126,234,0.1)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--admin-border)';
        uploadArea.style.background = 'rgba(102,126,234,0.05)';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleImageFiles(files);
        uploadArea.style.borderColor = 'var(--admin-border)';
        uploadArea.style.background = 'rgba(102,126,234,0.05)';
    });
    
    imageInput.addEventListener('change', (e) => {
        handleImageFiles(Array.from(e.target.files));
    });
    
    imageUrls.addEventListener('input', () => {
        const urls = imageUrls.value.split(',').map(u => u.trim()).filter(u => u);
        displayImagePreviews(urls);
    });
}

function handleImageFiles(files) {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    let processedCount = 0;
    
    imageFiles.forEach(file => {
        cropToSquare(file, (croppedImage) => {
            selectedImages.push(croppedImage);
            processedCount++;
            if (processedCount === imageFiles.length) {
                displayImagePreviews(selectedImages);
            }
        });
    });
}

function displayImagePreviews(images) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = images.map(img => `
        <img src="${img}" class="preview-img" alt="preview">
    `).join('');
}

function handleSubmit(e) {
    e.preventDefault();
    
    const productId = document.getElementById('productId');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productDesc = document.getElementById('productDesc');
    const productLink = document.getElementById('productLink');
    const productSold = document.getElementById('productSold');
    const productDiscount = document.getElementById('productDiscount');
    const productCategory = document.getElementById('productCategory');
    const imageUrls = document.getElementById('imageUrls');
    
    const id = productId.value;
    const images = imageUrls.value ? imageUrls.value.split(',').map(u => u.trim()).filter(u => u) : 
                   (selectedImages.length ? selectedImages : ['https://picsum.photos/id/1/400/400']);
    
    const productData = {
        id: id ? parseInt(id) : Date.now(),
        name: productName.value,
        price: parseInt(productPrice.value),
        description: productDesc.value,
        shopeeLink: productLink.value,
        sold: parseInt(productSold.value) || 0,
        discount: parseInt(productDiscount.value) || 0,
        category: productCategory.value,
        images: images,
        selectedBadge: selectedBadge || null,
        createdAt: id ? products.find(p => p.id == id).createdAt : new Date()
    };
    
    if (id) {
        const index = products.findIndex(p => p.id == id);
        products[index] = productData;
        showNotification('✏️ Cập nhật sản phẩm thành công!', 'success');
    } else {
        products.push(productData);
        showNotification('✅ Thêm sản phẩm mới thành công!', 'success');
    }
    
    saveProducts();
    renderProductsTable();
    renderCategoriesList();
    resetForm();
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    selectedImages = [];
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageUrls').value = '';
    cancelEditBtn.style.display = 'none';
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Thêm Sản Phẩm Mới';
    selectedBadge = '';
    document.querySelectorAll('.badge-option').forEach(opt => opt.classList.remove('selected'));
}

function cancelEdit() {
    resetForm();
}

function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDesc').value = product.description;
    document.getElementById('productLink').value = product.shopeeLink;
    document.getElementById('productSold').value = product.sold;
    document.getElementById('productDiscount').value = product.discount;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('imageUrls').value = product.images.join(', ');
    displayImagePreviews(product.images);
    
    if (product.selectedBadge) {
        selectedBadge = product.selectedBadge;
        document.querySelectorAll('.badge-option').forEach(opt => {
            if (opt.dataset.badge === product.selectedBadge) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
        document.getElementById('selectedBadge').value = product.selectedBadge;
    }
    
    cancelEditBtn.style.display = 'inline-block';
    formTitle.innerHTML = '<i class="fas fa-edit"></i> Sửa Sản Phẩm';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        products = products.filter(p => p.id != id);
        saveProducts();
        renderProductsTable();
        renderCategoriesList();
        showNotification('🗑️ Xóa sản phẩm thành công!', 'success');
    }
}

function renderProductsTable() {
    if (!productsTableBody) return;
    
    productsTableBody.innerHTML = products.map(product => {
        const badgeIcon = product.selectedBadge ? badgeIcons[product.selectedBadge] : null;
        return `
        <tr>
            <td><img src="${product.images[0]}" class="product-img" alt="${product.name}"></td>
            <td>
                <strong>${product.name}</strong>
                ${badgeIcon ? `<div class="badge-preview"><img src="${badgeIcon}" alt="badge"></div>` : ''}
            </td>
            <td style="color: var(--primary-color); font-weight: bold;">${new Intl.NumberFormat('vi-VN').format(product.price)}đ</td>
            <td>${product.category}</td>
            <td>${product.sold}</td>
            <td class="action-btns">
                <button class="btn btn-warning" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
             </td>
         </tr>
        `;
    }).join('');
}

function renderCategoriesList() {
    const container = document.getElementById('categoriesList');
    if (!container) return;
    
    container.innerHTML = categories.map((cat, index) => {
        const productCount = products.filter(p => p.category === cat).length;
        return `
            <div class="category-admin-card">
                <div>
                    <span>${cat}</span>
                    <small style="color: var(--admin-text-light); margin-left: 10px;">${productCount} sản phẩm</small>
                </div>
                <div>
                    <button class="btn btn-warning" onclick="editCategory(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteCategory(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.addNewCategory = function() {
    const newCatInput = document.getElementById('newCategoryName');
    const newCat = newCatInput.value.trim();
    
    if (!newCat) {
        showNotification('Vui lòng nhập tên danh mục!', 'error');
        return;
    }
    
    if (categories.includes(newCat)) {
        showNotification('Danh mục đã tồn tại!', 'error');
        return;
    }
    
    categories.push(newCat);
    saveCategories();
    renderCategoriesList();
    loadCategoriesToSelect();
    newCatInput.value = '';
    showNotification('✅ Thêm danh mục thành công!', 'success');
}

window.editCategory = function(index) {
    const newName = prompt('Nhập tên danh mục mới:', categories[index]);
    if (newName && newName.trim()) {
        const oldName = categories[index];
        categories[index] = newName.trim();
        
        products.forEach(product => {
            if (product.category === oldName) {
                product.category = newName.trim();
            }
        });
        
        saveCategories();
        saveProducts();
        renderCategoriesList();
        loadCategoriesToSelect();
        renderProductsTable();
        showNotification('✏️ Cập nhật danh mục thành công!', 'success');
    }
}

window.deleteCategory = function(index) {
    const categoryToDelete = categories[index];
    const productCount = products.filter(p => p.category === categoryToDelete).length;
    
    if (productCount > 0) {
        if (!confirm(`Danh mục "${categoryToDelete}" đang có ${productCount} sản phẩm. Xóa danh mục sẽ ảnh hưởng đến các sản phẩm này. Bạn có chắc chắn?`)) {
            return;
        }
        products = products.filter(p => p.category !== categoryToDelete);
        saveProducts();
    } else {
        if (!confirm(`Xóa danh mục "${categoryToDelete}"?`)) {
            return;
        }
    }
    
    categories.splice(index, 1);
    saveCategories();
    renderCategoriesList();
    loadCategoriesToSelect();
    renderProductsTable();
    showNotification('🗑️ Xóa danh mục thành công!', 'success');
}
