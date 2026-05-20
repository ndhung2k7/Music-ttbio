// Kế thừa dữ liệu từ localStorage
let products = [];

// DOM Elements
let productForm, productId, productName, productPrice, productDesc, productLink;
let productSold, productDiscount, productCategory, imageUrls, imagePreview;
let productsTableBody, cancelEditBtn, formTitle;
let selectedImages = [];

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initElements();
    initImageUpload();
    renderProductsTable();
    
    productForm.addEventListener('submit', handleSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
});

function loadProducts() {
    const stored = localStorage.getItem('shop_products');
    if (stored) {
        products = JSON.parse(stored);
    } else {
        // Dữ liệu mẫu
        products = [
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
            // ... thêm các sản phẩm mẫu khác
        ];
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem('shop_products', JSON.stringify(products));
}

function initElements() {
    productForm = document.getElementById('productForm');
    productId = document.getElementById('productId');
    productName = document.getElementById('productName');
    productPrice = document.getElementById('productPrice');
    productDesc = document.getElementById('productDesc');
    productLink = document.getElementById('productLink');
    productSold = document.getElementById('productSold');
    productDiscount = document.getElementById('productDiscount');
    productCategory = document.getElementById('productCategory');
    imageUrls = document.getElementById('imageUrls');
    imagePreview = document.getElementById('imagePreview');
    productsTableBody = document.getElementById('productsTableBody');
    cancelEditBtn = document.getElementById('cancelEdit');
    formTitle = document.getElementById('formTitle');
}

function initImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');
    
    uploadArea.addEventListener('click', () => imageInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ee4d2d';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleImageFiles(files);
        uploadArea.style.borderColor = '#ddd';
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
    imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImages.push(e.target.result);
            displayImagePreviews(selectedImages);
        };
        reader.readAsDataURL(file);
    });
}

function displayImagePreviews(images) {
    imagePreview.innerHTML = images.map(img => `
        <img src="${img}" class="preview-img" alt="preview">
    `).join('');
}

function handleSubmit(e) {
    e.preventDefault();
    
    const id = productId.value;
    const images = imageUrls.value ? imageUrls.value.split(',').map(u => u.trim()) : 
                   (selectedImages.length ? selectedImages : ['https://picsum.photos/id/1/300/300']);
    
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
        createdAt: id ? products.find(p => p.id == id).createdAt : new Date()
    };
    
    if (id) {
        // Cập nhật
        const index = products.findIndex(p => p.id == id);
        products[index] = productData;
        showToast('Cập nhật sản phẩm thành công!');
    } else {
        // Thêm mới
        products.push(productData);
        showToast('Thêm sản phẩm thành công!');
    }
    
    saveProducts();
    renderProductsTable();
    resetForm();
}

function resetForm() {
    productForm.reset();
    productId.value = '';
    selectedImages = [];
    imagePreview.innerHTML = '';
    imageUrls.value = '';
    cancelEditBtn.style.display = 'none';
    formTitle.innerHTML = '<i class="fas fa-plus-circle"></i> Thêm Sản Phẩm Mới';
}

function cancelEdit() {
    resetForm();
}

function editProduct(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    
    productId.value = product.id;
    productName.value = product.name;
    productPrice.value = product.price;
    productDesc.value = product.description;
    productLink.value = product.shopeeLink;
    productSold.value = product.sold;
    productDiscount.value = product.discount;
    productCategory.value = product.category;
    imageUrls.value = product.images.join(', ');
    displayImagePreviews(product.images);
    
    cancelEditBtn.style.display = 'inline-block';
    formTitle.innerHTML = '<i class="fas fa-edit"></i> Sửa Sản Phẩm';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        products = products.filter(p => p.id != id);
        saveProducts();
        renderProductsTable();
        showToast('Xóa sản phẩm thành công!');
    }
}

function renderProductsTable() {
    if (!productsTableBody) return;
    
    productsTableBody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.images[0]}" class="product-img" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${new Intl.NumberFormat('vi-VN').format(product.price)}đ</td>
            <td>${product.category}</td>
            <td>${product.sold}</td>
            <td class="action-btns">
                <button class="btn btn-warning" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.display = 'block';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
