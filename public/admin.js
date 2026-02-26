// Admin Dashboard JavaScript

let currentPage = 0;
const ordersPerPage = 20;
let currentFilter = '';
let currentOrderId = null;

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    loadOrders();
    
    // Setup filter change listener
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        currentFilter = e.target.value;
        currentPage = 0;
        loadOrders();
    });
});

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        // Update stat cards
        document.getElementById('totalOrders').textContent = stats.totalOrders;
        document.getElementById('totalRevenue').textContent = `$${stats.totalRevenue.toFixed(2)}`;
        document.getElementById('recentOrders').textContent = stats.recentOrders;
        
        // Find pending orders count
        const pendingStatus = stats.ordersByStatus.find(s => s.status === 'pending');
        document.getElementById('pendingOrders').textContent = pendingStatus ? pendingStatus.count : 0;
        
        // Display top products
        displayTopProducts(stats.topProducts);
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Display top products
function displayTopProducts(products) {
    const container = document.getElementById('topProducts');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="empty-state">No sales data available yet.</p>';
        return;
    }
    
    container.innerHTML = products.map((product, index) => `
        <div class="top-product-item">
            <div class="top-product-info">
                <h4>${index + 1}. ${product.name}</h4>
                <p>${product.units_sold} units sold</p>
            </div>
            <div class="top-product-stats">
                <div class="units">${product.units_sold}</div>
                <div class="revenue">$${parseFloat(product.revenue).toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

// Load orders
async function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="loading">Loading orders</td></tr>';
    
    try {
        const params = new URLSearchParams({
            limit: ordersPerPage,
            offset: currentPage * ordersPerPage
        });
        
        if (currentFilter) {
            params.append('status', currentFilter);
        }
        
        const response = await fetch(`/api/admin/orders?${params}`);
        const data = await response.json();
        
        displayOrders(data.orders);
        displayPagination(data.total, data.limit, data.offset);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        tbody.innerHTML = '<tr><td colspan="8" class="error">Failed to load orders</td></tr>';
    }
}

// Display orders in table
function displayOrders(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td class="order-id">#${order.id}</td>
            <td>${order.customer_name}</td>
            <td>${order.customer_email}</td>
            <td>${order.item_count}</td>
            <td>$${parseFloat(order.total_amount).toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewOrder(${order.id})">View</button>
                    <button class="btn-small btn-edit" onclick="openStatusModal(${order.id}, '${order.status}')">Status</button>
                    <button class="btn-small btn-delete" onclick="deleteOrder(${order.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Display pagination
function displayPagination(total, limit, offset) {
    const totalPages = Math.ceil(total / limit);
    const currentPageNum = Math.floor(offset / limit);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = `
        <button ${currentPageNum === 0 ? 'disabled' : ''} onclick="changePage(${currentPageNum - 1})">
            Previous
        </button>
    `;
    
    // Show page numbers
    for (let i = 0; i < totalPages; i++) {
        if (i === 0 || i === totalPages - 1 || (i >= currentPageNum - 2 && i <= currentPageNum + 2)) {
            html += `
                <button class="${i === currentPageNum ? 'active' : ''}" onclick="changePage(${i})">
                    ${i + 1}
                </button>
            `;
        } else if (i === currentPageNum - 3 || i === currentPageNum + 3) {
            html += '<span>...</span>';
        }
    }
    
    html += `
        <button ${currentPageNum === totalPages - 1 ? 'disabled' : ''} onclick="changePage(${currentPageNum + 1})">
            Next
        </button>
    `;
    
    pagination.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadOrders();
}

// Refresh orders
function refreshOrders() {
    loadStatistics();
    loadOrders();
}

// View order details
async function viewOrder(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}`);
        const order = await response.json();
        
        const detailsHtml = `
            <div class="order-detail-section">
                <h3>Order Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Order ID</label>
                        <strong>#${order.id}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Status</label>
                        <strong><span class="status-badge status-${order.status}">${order.status}</span></strong>
                    </div>
                    <div class="detail-item">
                        <label>Order Date</label>
                        <strong>${new Date(order.created_at).toLocaleString()}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Total Amount</label>
                        <strong>$${parseFloat(order.total_amount).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
            
            <div class="order-detail-section">
                <h3>Customer Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Name</label>
                        <strong>${order.customer_name}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Email</label>
                        <strong>${order.customer_email}</strong>
                    </div>
                    <div class="detail-item">
                        <label>Phone</label>
                        <strong>${order.customer_phone || 'N/A'}</strong>
                    </div>
                </div>
                <div class="detail-item" style="margin-top: 1rem;">
                    <label>Shipping Address</label>
                    <strong>${order.shipping_address}</strong>
                </div>
            </div>
            
            <div class="order-detail-section">
                <h3>Order Items</h3>
                <table class="order-items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.product_name}</td>
                                <td>${item.quantity}</td>
                                <td>$${parseFloat(item.price).toFixed(2)}</td>
                                <td>$${(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="order-total">
                    <h3>Total: $${parseFloat(order.total_amount).toFixed(2)}</h3>
                </div>
            </div>
        `;
        
        document.getElementById('orderDetails').innerHTML = detailsHtml;
        document.getElementById('orderModal').style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading order details:', error);
        alert('Failed to load order details');
    }
}

// Close order modal
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Open status update modal
function openStatusModal(orderId, currentStatus) {
    currentOrderId = orderId;
    document.getElementById('statusOrderId').textContent = `#${orderId}`;
    document.getElementById('currentStatus').textContent = currentStatus;
    document.getElementById('newStatus').value = currentStatus;
    document.getElementById('statusModal').style.display = 'flex';
}

// Close status modal
function closeStatusModal() {
    document.getElementById('statusModal').style.display = 'none';
    currentOrderId = null;
}

// Update order status
async function updateOrderStatus() {
    if (!currentOrderId) return;
    
    const newStatus = document.getElementById('newStatus').value;
    
    try {
        const response = await fetch(`/api/admin/orders/${currentOrderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            closeStatusModal();
            loadOrders();
            loadStatistics();
            showNotification('Order status updated successfully');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
    }
}

// Delete order
async function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete order #${orderId}? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadOrders();
            loadStatistics();
            showNotification('Order deleted successfully');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const orderModal = document.getElementById('orderModal');
    const statusModal = document.getElementById('statusModal');
    
    if (event.target === orderModal) {
        closeOrderModal();
    }
    if (event.target === statusModal) {
        closeStatusModal();
    }
}

// Made with Bob
