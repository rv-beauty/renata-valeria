/**
 * Renata Valéria | Curadoria Exclusiva de Beleza
 * Script de Interatividade, Filtros e Sacola de Compras com WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CONFIGURAÇÕES & PROPRIEDADES GLOBAIS
    // ==========================================
    const WHATSAPP_NUMBER = '553196378065'; // Formato internacional (+55 31 9637-8065)
    
    // Estado do Carrinho (carregado do localStorage se existir)
    let cart = JSON.parse(localStorage.getItem('rv_cart')) || [];
    
    // Função auxiliar para gerar link do WhatsApp
    function getWhatsAppUrl(text) {
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    }

    // ==========================================
    // 2. ATUALIZAR LINKS DO WHATSAPP EXISTENTES
    // ==========================================
    function updateExistingWhatsAppLinks() {
        const links = document.querySelectorAll('a[href*="wa.me/"]');
        links.forEach(link => {
            const currentUrl = new URL(link.href);
            const pathParts = currentUrl.pathname.split('/');
            const textParam = currentUrl.searchParams.get('text') || '';
            
            // Substitui o número antigo pelo número correto
            const newUrl = getWhatsAppUrl(textParam);
            link.href = newUrl;
        });
    }
    updateExistingWhatsAppLinks();

    // ==========================================
    // 3. SACOLA DE COMPRAS (CARRINHO) - LÓGICA & UI
    // ==========================================
    const cartDrawer = document.getElementById('cartDrawer');
    const cartToggle = document.querySelector('.site-header__cart-toggle');
    const cartClose = document.querySelector('.cart-drawer__close');
    const cartOverlay = document.querySelector('.cart-drawer__overlay');
    const cartBody = document.querySelector('.cart-drawer__body');
    const cartTotalVal = document.querySelector('.cart-drawer__total-price');
    const cartBadge = document.querySelector('.cart-badge');
    const checkoutBtn = document.querySelector('.btn--cart-checkout');

    // Abre a sacola
    function openCart() {
        if (cartDrawer) {
            cartDrawer.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Evita scroll na página de fundo
        }
    }

    // Fecha a sacola
    function closeCart() {
        if (cartDrawer) {
            cartDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (cartToggle) cartToggle.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Salva o carrinho no localStorage e atualiza a UI
    function saveCart() {
        localStorage.setItem('rv_cart', JSON.stringify(cart));
        updateCartUI();
    }

    // Adiciona item ao carrinho
    function addToCart(name, brand, priceStr, imageSrc) {
        // Converte o preço string (ex: "R$ 319,00") para Float
        const price = parseFloat(priceStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name,
                brand,
                price,
                priceFormatted: priceStr,
                image: imageSrc,
                quantity: 1
            });
        }
        
        saveCart();
        
        // Efeito de pulso no badge do carrinho
        if (cartBadge) {
            cartBadge.classList.add('cart-badge--bump');
            setTimeout(() => cartBadge.classList.remove('cart-badge--bump'), 300);
        }

        // Abre o carrinho automaticamente para feedback visual
        setTimeout(openCart, 300);
    }

    // Altera a quantidade de um item
    function updateQty(name, amount) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += amount;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.name !== name);
            }
            saveCart();
        }
    }

    // Remove item completamente
    function removeItem(name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
    }

    // Formata valores numéricos para moeda brasileira
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Atualiza a visualização do carrinho
    function updateCartUI() {
        if (!cartBody) return;
        
        // Limpa a tela
        cartBody.innerHTML = '';
        
        let totalCount = 0;
        let totalPrice = 0;
        
        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="cart-drawer__empty-message">Sua sacola está vazia.</p>';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
        } else {
            if (checkoutBtn) checkoutBtn.style.display = 'flex';
            
            cart.forEach(item => {
                totalCount += item.quantity;
                totalPrice += item.price * item.quantity;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item__image">
                    <div class="cart-item__details">
                        <span class="cart-item__brand">${item.brand}</span>
                        <h4 class="cart-item__name">${item.name}</h4>
                        <span class="cart-item__price">${formatCurrency(item.price)}</span>
                        <div class="cart-item__controls">
                            <button class="cart-item__qty-btn" data-action="decrease" data-name="${item.name}">-</button>
                            <span class="cart-item__qty">${item.quantity}</span>
                            <button class="cart-item__qty-btn" data-action="increase" data-name="${item.name}">+</button>
                        </div>
                    </div>
                    <button class="cart-item__remove" data-name="${item.name}">Excluir</button>
                `;
                cartBody.appendChild(itemEl);
            });
        }
        
        // Atualiza badge e totais
        if (cartBadge) cartBadge.textContent = totalCount;
        if (cartTotalVal) cartTotalVal.textContent = formatCurrency(totalPrice);
    }

    // Eventos internos do carrinho (Adicionar/Diminuir/Remover)
    if (cartBody) {
        cartBody.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            if (!name) return;
            
            if (e.target.classList.contains('cart-item__qty-btn')) {
                const action = e.target.getAttribute('data-action');
                if (action === 'increase') {
                    updateQty(name, 1);
                } else if (action === 'decrease') {
                    updateQty(name, -1);
                }
            } else if (e.target.classList.contains('cart-item__remove')) {
                removeItem(name);
            }
        });
    }

    // Finalizar pedido no WhatsApp
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            
            let message = 'Olá Renata! Gostaria de fazer o seguinte pedido:\n\n';
            let total = 0;
            
            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                message += `• ${item.quantity}x ${item.name} (${item.brand}) - ${formatCurrency(subtotal)}\n`;
            });
            
            message += `\n*Total do Pedido: ${formatCurrency(total)}*\n\n`;
            message += 'Por favor, me informe sobre as condições de entrega e pagamento.';
            
            window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
        });
    }

    // Inicializa a UI do carrinho com os dados salvos
    updateCartUI();

    // ==========================================
    // 4. INTERCEPTAR COMPRA DOS PRODUTOS DA VITRINE
    // ==========================================
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        productGrid.addEventListener('click', (event) => {
            const orderBtn = event.target.closest('.btn-add-to-order');
            if (!orderBtn) return;
            
            const productCard = orderBtn.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('.product-card__name')?.textContent.trim() || 'Produto';
            const productBrand = productCard.querySelector('.product-card__brand-badge')?.textContent.trim() || 'Marca';
            const productPrice = productCard.querySelector('.product-card__price')?.textContent.trim() || 'R$ 0,00';
            const productImage = productCard.querySelector('.product-card__img')?.getAttribute('src') || '';
            
            // Adiciona ao carrinho em vez de abrir o WhatsApp diretamente
            addToCart(productName, productBrand, productPrice, productImage);
        });
    }

    // ==========================================
    // 5. EVENTOS DE CTAS ESPECIAIS (BANNER & FLUTUANTE)
    // ==========================================
    const offerCta = document.querySelector('.btn--offer-cta');
    if (offerCta) {
        offerCta.addEventListener('click', (e) => {
            e.preventDefault();
            const message = 'Olá Renata, vi a oferta de 20% de desconto na linha de Skincare e gostaria de aproveitar!';
            window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
        });
    }

    const floatingWa = document.querySelector('.floating-whatsapp');
    if (floatingWa) {
        floatingWa.addEventListener('click', (e) => {
            e.preventDefault();
            const message = 'Olá Renata! Gostaria de fazer uma consultoria de beleza personalizada e conhecer seus produtos.';
            window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
        });
    }

    // ==========================================
    // 6. FILTRAGEM DE MARCAS
    // ==========================================
    const brandItems = document.querySelectorAll('.brand-grid__item');
    const productCards = document.querySelectorAll('.product-card');
    const seeAllLink = document.querySelector('.link-see-all');

    function filterProducts(brandFilter) {
        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            if (!brandFilter || cardBrand === brandFilter) {
                card.style.display = 'flex';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transition = 'opacity 0.4s ease';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    }

    brandItems.forEach(item => {
        item.addEventListener('click', () => {
            const brandFilter = item.getAttribute('data-brand-filter');
            const isActive = item.classList.contains('brand-grid__item--active');

            brandItems.forEach(i => i.classList.remove('brand-grid__item--active'));

            if (isActive) {
                filterProducts(null);
            } else {
                item.classList.add('brand-grid__item--active');
                filterProducts(brandFilter);
            }
        });
    });

    if (seeAllLink) {
        seeAllLink.addEventListener('click', (e) => {
            e.preventDefault();
            brandItems.forEach(i => i.classList.remove('brand-grid__item--active'));
            filterProducts(null);
        });
    }

    // ==========================================
    // 7. CONTADOR DE TEMPO (COUNTDOWN)
    // ==========================================
    const countdownEl = document.querySelector('.special-offer__countdown');
    if (countdownEl) {
        let deadlineStr = countdownEl.getAttribute('data-deadline');
        let deadline = new Date(deadlineStr).getTime();
        
        if (isNaN(deadline) || deadline <= Date.now()) {
            const mockDeadline = new Date();
            mockDeadline.setDate(mockDeadline.getDate() + 3);
            deadline = mockDeadline.getTime();
        }

        const hrsEl = countdownEl.querySelector('[data-countdown="hours"]');
        const minEl = countdownEl.querySelector('[data-countdown="minutes"]');
        const secEl = countdownEl.querySelector('[data-countdown="seconds"]');

        function updateCountdown() {
            const now = Date.now();
            const diff = deadline - now;

            if (diff <= 0) {
                if (hrsEl) hrsEl.textContent = '00';
                if (minEl) minEl.textContent = '00';
                if (secEl) secEl.textContent = '00';
                clearInterval(countdownInterval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hrsEl) hrsEl.textContent = String(hours).padStart(2, '0');
            if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
            if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // ==========================================
    // 8. MENU HAMBÚRGUER (MOBILE)
    // ==========================================
    const menuToggle = document.querySelector('.site-header__toggle');
    const siteNavigation = document.querySelector('.site-navigation');
    const navLinks = document.querySelectorAll('.site-navigation__link');

    if (menuToggle && siteNavigation) {
        const toggleMenu = (e) => {
            if (e) e.stopPropagation();
            const isOpen = siteNavigation.classList.contains('site-navigation--active');
            
            siteNavigation.classList.toggle('site-navigation--active');
            menuToggle.setAttribute('aria-expanded', !isOpen);
        };

        const closeMenu = () => {
            siteNavigation.classList.remove('site-navigation--active');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', toggleMenu);

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (e) => {
            const isClickInsideMenu = siteNavigation.contains(e.target);
            const isClickInsideToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideMenu && !isClickInsideToggle && siteNavigation.classList.contains('site-navigation--active')) {
                closeMenu();
            }
        });
    }

    // ==========================================
    // 9. HIGHLIGHT ATIVO DO MENU NO SCROLL (SCROLLSPY)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    function handleScrollSpy() {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;
        const offset = 80;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('site-navigation__link--active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('site-navigation__link--active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy();

    // ==========================================
    // 10. FORMULÁRIO DE NEWSLETTER COM TOAST PREMIUM
    // ==========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const toastStyle = document.createElement('style');
        toastStyle.innerHTML = `
            .rv-toast {
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                background-color: var(--color-dark-accent, #452E1B);
                color: #FFFFFF;
                padding: 1.25rem 2rem;
                font-family: var(--font-sans, sans-serif);
                font-size: 0.938rem;
                border-radius: 4px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                z-index: 2000;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                transform: translateX(-100px);
                opacity: 0;
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
            }
            .rv-toast--visible {
                transform: translateX(0);
                opacity: 1;
            }
            .rv-toast__icon {
                font-size: 1.25rem;
            }
        `;
        document.head.appendChild(toastStyle);

        function showNotification(message, icon = '✨') {
            const oldToast = document.querySelector('.rv-toast');
            if (oldToast) oldToast.remove();

            const toast = document.createElement('div');
            toast.className = 'rv-toast';
            toast.innerHTML = `<span class="rv-toast__icon">${icon}</span> <span>${message}</span>`;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('rv-toast--visible');
            }, 10);

            setTimeout(() => {
                toast.classList.remove('rv-toast--visible');
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 4000);
        }

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.newsletter-form__input');
            const email = emailInput?.value || '';

            if (email) {
                showNotification('Inscrição realizada com sucesso! Fique atenta às novidades.', '💌');
                if (emailInput) emailInput.value = '';
            }
        });
    }
});
