// App Controller
const app = {
    currentView: 'home',
    currentFood: null,
    currentCategory: 'all',
    currentOrderTab: 'completed',
    map: null,
    impactChart: null,

    init() {
        // Initialize header data
        document.getElementById('header-coins').innerText = MOCK_USER.coins;
        
        // Setup bottom nav listeners
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('data-target');
                this.navigateTo(target);
            });
        });

        // Load initial view
        this.renderHome();
    },

    navigateTo(view, data = null) {
        this.currentView = view;
        
        // Update bottom nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-target') === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const mainContent = document.getElementById('main-content');
        
        // Route to the specific view
        switch(view) {
            case 'home':
                this.renderHome();
                break;
            case 'detail':
                this.currentFood = data;
                this.renderDetail();
                break;
            case 'map':
                this.renderMap();
                break;
            case 'orders':
                this.renderOrders();
                break;
            case 'impact':
                this.renderImpact();
                break;
            case 'profile':
                this.renderProfile();
                break;
        }
    },

    setCategory(categoryId) {
        this.currentCategory = categoryId;
        this.renderHome();
    },

    renderHome() {
        const mainContent = document.getElementById('main-content');
        
        // Build Categories
        const categoriesHTML = MOCK_CATEGORIES.map(cat => `
            <div class="category-pill ${cat.id === this.currentCategory ? 'active' : ''}" onclick="app.setCategory('${cat.id}')">
                ${cat.icon} ${cat.name}
            </div>
        `).join('');

        // Filter Foods
        const filteredFoods = this.currentCategory === 'all' 
            ? MOCK_FOODS 
            : MOCK_FOODS.filter(f => f.category === this.currentCategory);

        // Build Featured Cards (Horizontal)
        const featuredHTML = filteredFoods.map(food => this.createFoodCard(food)).join('');
        
        // Build Nearby Cards (Vertical) - Just reversing for visual variety
        const nearbyHTML = filteredFoods.slice().reverse().map(food => this.createFoodCard(food)).join('');

        mainContent.innerHTML = `
            <div class="view active" id="home-view">
                <div class="search-bar" style="margin-bottom: 1.5rem; background: white; padding: 0.75rem 1rem; border-radius: var(--radius-full); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-color);">
                    <i class="fa-solid fa-search" style="color: var(--text-muted);"></i>
                    <input type="text" placeholder="Find rescued food nearby..." style="border: none; outline: none; width: 100%; font-size: 0.875rem;">
                </div>

                <div class="category-pills" style="margin-bottom: 1.5rem;">
                    ${categoriesHTML}
                </div>

                ${filteredFoods.length === 0 ? `
                    <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <p>No rescued food found in this category right now.</p>
                    </div>
                ` : `
                    <div class="section-header">
                        <h2 class="section-title">Ending Soon 🔥</h2>
                        <a href="#" class="see-all">See all</a>
                    </div>
                    <div class="horizontal-scroll">
                        ${featuredHTML}
                    </div>

                    <div class="section-header">
                        <h2 class="section-title">Nearby Deals 📍</h2>
                    </div>
                    <div class="nearby-list">
                        ${nearbyHTML}
                    </div>
                `}
            </div>
        `;
    },

    createFoodCard(food) {
        const discountPercent = Math.round((1 - (food.discountedPrice / food.originalPrice)) * 100);
        return `
            <div class="food-card" onclick="app.navigateTo('detail', '${food.id}')">
                <div class="food-card-img-wrapper">
                    <img src="${food.image}" class="food-card-img" alt="${food.title}">
                    <div class="discount-badge">-${discountPercent}%</div>
                    <div class="time-badge"><i class="fa-regular fa-clock"></i> ${food.pickupWindow.split(' - ')[0]}</div>
                </div>
                <div class="food-card-content">
                    <div class="restaurant-name">
                        <i class="fa-solid fa-store" style="color: var(--primary-green);"></i> ${food.restaurantName} • ${food.distance}
                    </div>
                    <h3 class="food-title">${food.title}</h3>
                    <div class="price-row">
                        <span class="price-discounted">${formatIDR(food.discountedPrice)}</span>
                        <span class="price-original">${formatIDR(food.originalPrice)}</span>
                    </div>
                    <div class="freshness-bar">
                        <div class="freshness-fill" style="width: ${food.freshness}%"></div>
                    </div>
                    <div class="freshness-label">Made at ${food.timeMade}</div>
                </div>
            </div>
        `;
    },

    renderDetail() {
        const food = MOCK_FOODS.find(f => f.id === this.currentFood);
        if (!food) return;

        const mainContent = document.getElementById('main-content');
        const discountPercent = Math.round((1 - (food.discountedPrice / food.originalPrice)) * 100);

        const ingredientsHTML = food.ingredients.map(ing => `<div class="tag"><i class="fa-solid fa-check" style="color: var(--primary-green);"></i> ${ing}</div>`).join('');
        const allergensHTML = food.allergens.map(all => `<div class="tag" style="background: #fee2e2; color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> ${all}</div>`).join('');

        mainContent.innerHTML = `
            <div class="view active" style="padding-bottom: 100px; position: relative;">
                <div class="back-btn" onclick="app.navigateTo('home')">
                    <i class="fa-solid fa-arrow-left"></i>
                </div>
                <img src="${food.image}" class="detail-header-img" alt="${food.title}">
                
                <div class="restaurant-name" style="font-size: 0.875rem;">
                    <i class="fa-solid fa-store" style="color: var(--primary-green);"></i> ${food.restaurantName} • ${food.distance}
                </div>
                <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${food.title}</h2>
                
                <div class="price-row" style="margin-bottom: 1rem;">
                    <span class="price-discounted" style="font-size: 1.5rem;">${formatIDR(food.discountedPrice)}</span>
                    <span class="price-original" style="font-size: 1rem;">${formatIDR(food.originalPrice)}</span>
                    <span style="background: var(--accent-orange); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; margin-left: auto;">Save ${discountPercent}%</span>
                </div>

                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1.5rem; line-height: 1.6;">
                    ${food.description}
                </p>

                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
                    <h4 style="color: var(--primary-green-dark); margin-bottom: 0.5rem; font-size: 0.875rem;"><i class="fa-solid fa-clock"></i> Pickup Window</h4>
                    <p style="font-weight: 600;">Today, ${food.pickupWindow}</p>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Present your voucher to the cashier during this time.</p>
                </div>

                <div class="section-header" style="margin-top: 0;">
                    <h3 class="section-title" style="font-size: 1rem;">Composition</h3>
                </div>
                <div class="tag-container" style="margin-top: 0.5rem; margin-bottom: 1.5rem;">
                    ${ingredientsHTML}
                </div>

                ${food.allergens.length > 0 ? `
                <div class="section-header" style="margin-top: 0;">
                    <h3 class="section-title" style="font-size: 1rem;">Allergens</h3>
                </div>
                <div class="tag-container" style="margin-top: 0.5rem; margin-bottom: 1.5rem;">
                    ${allergensHTML}
                </div>
                ` : ''}

                <div class="fixed-bottom-bar">
                    <button class="btn btn-primary" onclick="app.renderCheckout()">
                        <i class="fa-solid fa-bag-shopping"></i> Reserve & Pay Now
                    </button>
                </div>
            </div>
        `;
    },

    // ==========================================
    //  CHECKOUT & PAYMENT FLOW
    // ==========================================

    renderCheckout() {
        const food = MOCK_FOODS.find(f => f.id === this.currentFood);
        if (!food) return;

        const mainContent = document.getElementById('main-content');
        const discountPercent = Math.round((1 - (food.discountedPrice / food.originalPrice)) * 100);
        const savings = food.originalPrice - food.discountedPrice;

        mainContent.innerHTML = `
            <div class="view active checkout-view">
                <div class="checkout-topbar">
                    <div class="back-btn" onclick="app.renderDetail()" style="position: static; width: 36px; height: 36px; box-shadow: none; background: #f1f5f9;">
                        <i class="fa-solid fa-arrow-left" style="font-size: 0.875rem;"></i>
                    </div>
                    <h2>Checkout</h2>
                </div>
                <div class="checkout-body">
                    <div class="section-header" style="margin-top: 0;"><h3 class="section-title" style="font-size: 0.9375rem;">Order Summary</h3></div>
                    <div class="checkout-summary">
                        <div class="checkout-item">
                            <img src="${food.image}" alt="${food.title}">
                            <div class="checkout-item-info">
                                <h4>${food.title}</h4>
                                <div class="restaurant-name"><i class="fa-solid fa-store" style="color: var(--primary-green);"></i> ${food.restaurantName}</div>
                                <div class="price-row" style="margin-bottom: 0;">
                                    <span class="price-discounted" style="font-size: 1rem;">${formatIDR(food.discountedPrice)}</span>
                                    <span class="price-original" style="font-size: 0.8125rem;">${formatIDR(food.originalPrice)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="checkout-divider"></div>
                        <div class="checkout-row">
                            <span style="color: var(--text-secondary);">Subtotal</span>
                            <span>${formatIDR(food.originalPrice)}</span>
                        </div>
                        <div class="checkout-row">
                            <span style="color: var(--primary-green);">Rescue Discount (-${discountPercent}%)</span>
                            <span style="color: var(--primary-green);">-${formatIDR(savings)}</span>
                        </div>
                        <div class="checkout-row">
                            <span style="color: var(--text-secondary);">Service Fee</span>
                            <span>Rp0</span>
                        </div>
                        <div class="checkout-row total">
                            <span>Total</span>
                            <span>${formatIDR(food.discountedPrice)}</span>
                        </div>
                    </div>

                    <div class="section-header" style="margin-top: 0;"><h3 class="section-title" style="font-size: 0.9375rem;">Payment Method</h3></div>
                    <div class="payment-methods">
                        <div class="payment-method selected" onclick="app.selectPayment(this)" data-method="qris">
                            <div class="payment-method-icon qris">QRIS</div>
                            <div class="payment-method-info">
                                <h4>QRIS</h4>
                                <p>Scan QR to pay from any banking app</p>
                            </div>
                            <div class="check-circle"><i class="fa-solid fa-check"></i></div>
                        </div>
                        <div class="payment-method" onclick="app.selectPayment(this)" data-method="ewallet">
                            <div class="payment-method-icon" style="background: #ecfdf5; color: var(--primary-green);"><i class="fa-solid fa-wallet"></i></div>
                            <div class="payment-method-info">
                                <h4>E-Wallet</h4>
                                <p>GoPay, OVO, DANA, ShopeePay</p>
                            </div>
                            <div class="check-circle"><i class="fa-solid fa-check"></i></div>
                        </div>
                        <div class="payment-method" onclick="app.selectPayment(this)" data-method="cash">
                            <div class="payment-method-icon" style="background: #fef3c7; color: #b45309;"><i class="fa-solid fa-money-bill-wave"></i></div>
                            <div class="payment-method-info">
                                <h4>Pay at Store</h4>
                                <p>Pay cash when you pick up</p>
                            </div>
                            <div class="check-circle"><i class="fa-solid fa-check"></i></div>
                        </div>
                    </div>

                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fa-solid fa-location-dot" style="color: var(--primary-green);"></i>
                            <h4 style="font-size: 0.875rem; color: var(--primary-green-dark);">Pickup Details</h4>
                        </div>
                        <p style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem;">${food.restaurantName}</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary);">${food.distance} away &bull; Pickup ${food.pickupWindow}</p>
                    </div>
                </div>

                <div class="fixed-bottom-bar">
                    <button class="btn btn-primary" onclick="app.processPayment()">
                        <i class="fa-solid fa-lock"></i> Pay ${formatIDR(food.discountedPrice)}
                    </button>
                </div>
            </div>
        `;
    },

    selectPayment(el) {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
        el.classList.add('selected');
    },

    processPayment() {
        const selectedMethod = document.querySelector('.payment-method.selected');
        if (!selectedMethod) return;
        const method = selectedMethod.getAttribute('data-method');
        if (method === 'qris') {
            this.showQrisModal();
        } else {
            this.showProcessingThenSuccess();
        }
    },

    // --- QRIS Payment Modal ---
    showQrisModal() {
        const food = MOCK_FOODS.find(f => f.id === this.currentFood);
        if (!food) return;
        this._currentOrderId = 'RESQ-' + Math.floor(Math.random() * 90000 + 10000);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'qris-modal';
        modal.innerHTML = `
            <div class="qris-modal-content" style="position: relative;">
                <div class="qris-header">
                    <h3><i class="fa-solid fa-shield-halved"></i> QRIS Payment</h3>
                    <p>Scan with any Indonesian banking app</p>
                </div>
                <div class="qris-body">
                    <div class="qris-qr-frame">
                        <div class="qris-qr-inner">
                            ${this._generateQRPattern()}
                        </div>
                    </div>
                    <div class="qris-amount">${formatIDR(food.discountedPrice)}</div>
                    <div class="qris-merchant">ResQFood &bull; ${food.restaurantName}</div>
                    <div class="qris-timer">
                        <i class="fa-solid fa-clock"></i>
                        <span>Expires in <span id="qris-countdown">4:59</span></span>
                    </div>
                    <button class="btn btn-primary" style="font-size: 0.875rem;" onclick="app.simulateQrisPayment()">
                        <i class="fa-solid fa-check-circle"></i> I've Paid (Simulate)
                    </button>
                    <button class="btn btn-outline" style="margin-top: 0.75rem; font-size: 0.8125rem; border-color: var(--border-color); color: var(--text-secondary);" onclick="app.closeQrisModal()">
                        Cancel
                    </button>
                </div>
                <div class="processing-overlay" id="qris-processing" style="display: none;">
                    <div class="spinner"></div>
                    <p style="font-weight: 600; color: var(--text-primary);">Verifying payment...</p>
                    <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-top: 0.25rem;">Please wait a moment</p>
                </div>
            </div>
        `;
        document.getElementById('app-container').appendChild(modal);
        requestAnimationFrame(() => { requestAnimationFrame(() => { modal.classList.add('active'); }); });
        this._startQrisCountdown();
    },

    _generateQRPattern() {
        const size = 21;
        let cells = '';
        const cellSize = 176 / size;
        const isFinderPattern = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
        const isFinderBorder = (r, c) => {
            if (!isFinderPattern(r, c)) return false;
            const positions = [[0, 0], [0, size - 7], [size - 7, 0]];
            for (const [pr, pc] of positions) {
                const lr = r - pr, lc = c - pc;
                if (lr >= 0 && lr < 7 && lc >= 0 && lc < 7) {
                    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
                    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
                    return false;
                }
            }
            return false;
        };
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                let filled = isFinderPattern(r, c) ? isFinderBorder(r, c) : Math.random() > 0.5;
                if (filled) cells += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#1a1a1a" />`;
            }
        }
        return `<svg viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">${cells}</svg>`;
    },

    _startQrisCountdown() {
        let timeLeft = 299;
        this._qrisTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) { clearInterval(this._qrisTimer); this.closeQrisModal(); return; }
            const min = Math.floor(timeLeft / 60);
            const sec = String(timeLeft % 60).padStart(2, '0');
            const el = document.getElementById('qris-countdown');
            if (el) el.textContent = `${min}:${sec}`;
        }, 1000);
    },

    simulateQrisPayment() {
        const processing = document.getElementById('qris-processing');
        if (processing) processing.style.display = 'flex';
        setTimeout(() => {
            clearInterval(this._qrisTimer);
            this.closeQrisModal();
            this.showSuccessVoucher();
        }, 2000);
    },

    closeQrisModal() {
        clearInterval(this._qrisTimer);
        const modal = document.getElementById('qris-modal');
        if (modal) { modal.classList.remove('active'); setTimeout(() => modal.remove(), 300); }
    },

    // --- Generic Processing (E-Wallet / Cash) ---
    showProcessingThenSuccess() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'processing-modal';
        modal.innerHTML = `
            <div class="qris-modal-content" style="position: relative; padding: 3rem 2rem; text-align: center;">
                <div class="spinner" style="margin: 0 auto 1rem auto;"></div>
                <p style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Processing Payment...</p>
                <p style="font-size: 0.8125rem; color: var(--text-secondary);">Please wait a moment</p>
            </div>
        `;
        document.getElementById('app-container').appendChild(modal);
        requestAnimationFrame(() => { requestAnimationFrame(() => { modal.classList.add('active'); }); });
        setTimeout(() => {
            modal.classList.remove('active');
            setTimeout(() => { modal.remove(); this.showSuccessVoucher(); }, 300);
        }, 1800);
    },

    // --- Success Voucher ---
    showSuccessVoucher() {
        const food = MOCK_FOODS.find(f => f.id === this.currentFood);
        if (!food) return;
        const orderId = this._currentOrderId || 'RESQ-' + Math.floor(Math.random() * 90000 + 10000);

        MOCK_ORDERS.unshift({ id: orderId, foodId: this.currentFood, date: "Today", status: "active" });
        MOCK_USER.stats.mealsRescued += 1;
        MOCK_USER.xp += 50;
        MOCK_USER.coins += 10;
        document.getElementById('header-coins').innerText = MOCK_USER.coins;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'voucher-modal';
        modal.innerHTML = `
            <div class="voucher-card">
                <div class="voucher-header" style="padding: 2rem 1.5rem;">
                    <div class="success-icon" style="margin: 0 auto 0.75rem auto;">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <h3>Payment Successful!</h3>
                    <p style="font-size: 0.875rem; opacity: 0.9; margin-top: 0.25rem;">You rescued a meal &#127757;</p>
                </div>
                <div class="voucher-body">
                    <div class="qr-placeholder" style="width: 160px; height: 160px; font-size: 3rem;">
                        <i class="fa-solid fa-qrcode"></i>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">Show this QR code to the cashier</p>
                    <h4 style="margin-bottom: 0.125rem;">${food.restaurantName}</h4>
                    <p style="color: var(--text-secondary); font-size: 0.8125rem; margin-bottom: 1.25rem;">Order #${orderId}</p>
                    <div class="voucher-info">
                        <div class="info-row">
                            <span class="info-label">Item</span>
                            <span class="info-val">${food.title}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Pickup</span>
                            <span class="info-val">Today, ${food.pickupWindow}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Total Paid</span>
                            <span class="info-val" style="color: var(--primary-green);">${formatIDR(food.discountedPrice)}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="app.closeVoucher()">
                        <i class="fa-solid fa-receipt"></i> View My Orders
                    </button>
                </div>
            </div>
        `;
        document.getElementById('app-container').appendChild(modal);
        requestAnimationFrame(() => { requestAnimationFrame(() => { modal.classList.add('active'); }); });
        this.showXpToast('+50 XP · +10 Coins 🎉');
    },

    showXpToast(message) {
        const toast = document.createElement('div');
        toast.className = 'xp-toast';
        toast.textContent = message;
        document.getElementById('app-container').appendChild(toast);
        requestAnimationFrame(() => { requestAnimationFrame(() => { toast.classList.add('show'); }); });
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
    },

    closeVoucher() {
        const modal = document.getElementById('voucher-modal');
        if (modal) { modal.classList.remove('active'); setTimeout(() => modal.remove(), 300); }
        this.currentOrderTab = 'active';
        this.navigateTo('orders');
    },

    renderMap() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="view active" style="padding: 0; height: 100%; position: relative;">
                <div id="map" style="height: 100%; width: 100%; z-index: 1;"></div>
                <div style="position: absolute; top: 1rem; left: 1rem; right: 1rem; z-index: 10;">
                    <div class="search-bar" style="background: white; padding: 0.75rem 1rem; border-radius: var(--radius-full); box-shadow: var(--shadow-md); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-search" style="color: var(--text-muted);"></i>
                        <input type="text" placeholder="Search map area..." style="border: none; outline: none; width: 100%; font-size: 0.875rem;">
                    </div>
                </div>
            </div>
        `;

        // Initialize Leaflet Map
        setTimeout(() => {
            if (this.map) {
                this.map.remove();
            }
            this.map = L.map('map').setView([-6.2088, 106.8456], 13); // Jakarta coordinates

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.map);

            // Add dummy markers
            MOCK_FOODS.forEach((food, i) => {
                const latOffset = (Math.random() - 0.5) * 0.02;
                const lngOffset = (Math.random() - 0.5) * 0.02;
                
                const customIcon = L.divIcon({
                    className: 'custom-map-marker',
                    html: `<div style="background: var(--primary-green); color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: var(--shadow-md);"><i class="fa-solid fa-store"></i></div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                L.marker([-6.2088 + latOffset, 106.8456 + lngOffset], { icon: customIcon })
                 .addTo(this.map)
                 .bindPopup(`<b>${food.restaurantName}</b><br>${food.title}<br>${formatIDR(food.discountedPrice)}`);
            });
            
            // Fix map rendering issues inside dynamic containers
            this.map.invalidateSize();
        }, 100);
    },

    renderImpact() {
        const mainContent = document.getElementById('main-content');
        const s = MOCK_USER.stats;

        mainContent.innerHTML = `
            <div class="view active">
                <h2 style="margin-bottom: 1.5rem;">My Impact 🌍</h2>
                
                <div class="impact-card">
                    <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">Money Saved</div>
                    <div style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">${formatIDR(s.moneySaved)}</div>
                    
                    <div class="impact-stats-grid">
                        <div class="stat-box">
                            <div class="stat-value">${s.mealsRescued}</div>
                            <div class="stat-label">Meals Rescued</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${s.foodSavedKg} <span style="font-size: 1rem">kg</span></div>
                            <div class="stat-label">Food Saved</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${s.co2Prevented} <span style="font-size: 1rem">kg</span></div>
                            <div class="stat-label">CO₂ Prevented</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-value">${s.streakDays} 🔥</div>
                            <div class="stat-label">Day Streak</div>
                        </div>
                    </div>
                </div>

                <div class="section-header">
                    <h3 class="section-title">Impact History</h3>
                </div>
                <div style="background: white; padding: 1rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
                    <canvas id="impactChart" width="100" height="60"></canvas>
                </div>
            </div>
        `;

        setTimeout(() => {
            const ctx = document.getElementById('impactChart').getContext('2d');
            if (this.impactChart) this.impactChart.destroy();
            
            this.impactChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Meals Rescued',
                        data: [1, 0, 2, 1, 3, 0, 1],
                        backgroundColor: '#34d399',
                        borderRadius: 4
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }, 100);
    },

    renderProfile() {
        const mainContent = document.getElementById('main-content');
        const progressPercent = (MOCK_USER.xp / MOCK_USER.nextRankXp) * 100;

        const badgesHTML = MOCK_USER.badges.map(b => `
            <div class="badge-item ${b.earned ? 'earned' : ''}">
                <div class="badge-icon">${b.icon}</div>
                <div class="badge-name">${b.name}</div>
            </div>
        `).join('');

        mainContent.innerHTML = `
            <div class="view active">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                    <img src="${MOCK_USER.avatar}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--primary-green);">
                    <div>
                        <h2 style="margin-bottom: 0.25rem;">${MOCK_USER.name}</h2>
                        <div style="color: var(--primary-green); font-weight: 600; font-size: 0.875rem;"><i class="fa-solid fa-shield"></i> ${MOCK_USER.rank}</div>
                    </div>
                </div>

                <div style="background: white; padding: 1.5rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;">
                    <div class="rank-header">
                        <span style="font-weight: 600; color: var(--text-primary);">${MOCK_USER.xp} XP</span>
                        <span style="color: var(--text-secondary); font-size: 0.75rem;">Next Rank: ${MOCK_USER.nextRankXp} XP</span>
                    </div>
                    <div class="progress-track" style="background: #e2e8f0;">
                        <div class="progress-fill" style="width: ${progressPercent}%; background: var(--primary-green);"></div>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); text-align: center; margin-top: 0.75rem;">Earn 50 XP to rank up to Waste Warrior ⚔️</p>
                </div>

                <div class="section-header">
                    <h3 class="section-title">Badges</h3>
                    <a href="#" class="see-all">See all</a>
                </div>
                <div class="badge-grid" style="margin-bottom: 2rem;">
                    ${badgesHTML}
                </div>

                <div class="section-header">
                    <h3 class="section-title">Rewards Center</h3>
                </div>
                <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 700; color: #b45309;"><i class="fa-solid fa-coins"></i> ${MOCK_USER.coins} ResQ Coins</div>
                        <div style="font-size: 0.75rem; color: #d97706; margin-top: 0.25rem;">Redeem for discounts or charity</div>
                    </div>
                    <button class="btn btn-outline" style="width: auto; padding: 0.5rem 1rem; border-color: #f59e0b; color: #d97706;">Redeem</button>
                </div>
            </div>
        `;
    },

    setOrderTab(tab) {
        this.currentOrderTab = tab;
        this.renderOrders();
    },

    renderOrders() {
        const mainContent = document.getElementById('main-content');
        
        const filteredOrders = MOCK_ORDERS.filter(o => o.status === this.currentOrderTab);
        
        const ordersHTML = filteredOrders.length === 0 
            ? `<div style="text-align: center; padding: 2rem; color: var(--text-muted);"><i class="fa-solid fa-receipt" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>No ${this.currentOrderTab} orders found.</p></div>`
            : filteredOrders.map(order => {
                const food = MOCK_FOODS.find(f => f.id === order.foodId);
                const statusBadge = order.status === 'completed' 
                    ? `<span style="font-size: 0.75rem; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Completed</span>`
                    : `<span style="font-size: 0.75rem; background: #fef3c7; color: #b45309; padding: 2px 6px; border-radius: 4px; font-weight: 600;">Active</span>`;
                    
                return `
                    <div style="background: white; border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem; box-shadow: var(--shadow-sm); display: flex; gap: 1rem;">
                        <img src="${food.image}" style="width: 80px; height: 80px; border-radius: var(--radius-sm); object-fit: cover;">
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                <h4 style="font-size: 1rem;">${food.restaurantName}</h4>
                                ${statusBadge}
                            </div>
                            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${food.title}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 600;">${formatIDR(food.discountedPrice)}</span>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">${order.date}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

        mainContent.innerHTML = `
            <div class="view active">
                <h2 style="margin-bottom: 1.5rem;">My Rescues</h2>
                
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <button class="btn ${this.currentOrderTab === 'completed' ? 'btn-primary' : 'btn-outline'}" onclick="app.setOrderTab('completed')" style="flex: 1; padding: 0.5rem; font-size: 0.875rem; ${this.currentOrderTab !== 'completed' ? 'border-color: var(--border-color); color: var(--text-secondary);' : ''}">Completed</button>
                    <button class="btn ${this.currentOrderTab === 'active' ? 'btn-primary' : 'btn-outline'}" onclick="app.setOrderTab('active')" style="flex: 1; padding: 0.5rem; font-size: 0.875rem; ${this.currentOrderTab !== 'active' ? 'border-color: var(--border-color); color: var(--text-secondary);' : ''}">Active</button>
                </div>

                ${ordersHTML}
            </div>
        `;
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
