/**
 * Renata Valéria | Curadoria Exclusiva de Beleza
 * Script de Interatividade e Integração com WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. CONFIGURAÇÕES & PROPRIEDADES GLOBAIS
    // ==========================================
    const WHATSAPP_NUMBER = '553196378065'; // Formato internacional (+55 31 9637-8065)
    
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
    // 3. EVENTOS DE COMPRA DE PRODUTOS
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
            
            const message = `Olá Renata! Gostaria de fazer o pedido do produto "${productName}" da marca ${productBrand}.`;
            const waUrl = getWhatsAppUrl(message);
            
            // Abre o link do WhatsApp em uma nova aba
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // ==========================================
    // 4. EVENTOS DE CTAS ESPECIAIS (BANNER & FLUTUANTE)
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
    // 5. FILTRAGEM DE MARCAS
    // ==========================================
    const brandItems = document.querySelectorAll('.brand-grid__item');
    const productCards = document.querySelectorAll('.product-card');
    const seeAllLink = document.querySelector('.link-see-all');

    function filterProducts(brandFilter) {
        productCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            if (!brandFilter || cardBrand === brandFilter) {
                card.style.display = 'flex';
                // Efeito suave de fade-in
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

            // Limpa o estado ativo de todos os logos
            brandItems.forEach(i => i.classList.remove('brand-grid__item--active'));

            if (isActive) {
                // Se clicou no que já estava ativo, desativa o filtro e mostra todos
                filterProducts(null);
            } else {
                // Ativa o filtro selecionado
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
    // 6. CONTADOR DE TEMPO (COUNTDOWN)
    // ==========================================
    const countdownEl = document.querySelector('.special-offer__countdown');
    if (countdownEl) {
        let deadlineStr = countdownEl.getAttribute('data-deadline');
        let deadline = new Date(deadlineStr).getTime();
        
        // Se a data for inválida ou já tiver passado, define para 3 dias a partir de agora
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

        updateCountdown(); // Executa imediatamente
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // ==========================================
    // 7. MENU HAMBÚRGUER (MOBILE)
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

        // Fecha o menu ao clicar em qualquer link de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', (e) => {
            const isClickInsideMenu = siteNavigation.contains(e.target);
            const isClickInsideToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideMenu && !isClickInsideToggle && siteNavigation.classList.contains('site-navigation--active')) {
                closeMenu();
            }
        });
    }

    // ==========================================
    // 8. HIGHLIGHT ATIVO DO MENU NO SCROLL (SCROLLSPY)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    function handleScrollSpy() {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;
        const offset = 80; // Compensação da altura do header fixo
        
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
    handleScrollSpy(); // Executa ao carregar para destacar a seção atual

    // ==========================================
    // 9. FORMULÁRIO DE NEWSLETTER COM TOAST PREMIUM
    // ==========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        // Injeta os estilos do Toast dinamicamente no canto inferior esquerdo (evitando o botão do WhatsApp)
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
