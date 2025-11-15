// Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Anima o ícone do menu
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll para links de navegação (apenas links internos)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Verificar se é um link interno válido (não é apenas "#" e não é link externo)
        if (href && href !== '#' && href.startsWith('#') && !href.startsWith('http')) {
            e.preventDefault();
            try {
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                // Se houver erro no seletor, deixa o comportamento padrão
                console.warn('Erro ao fazer scroll:', error);
            }
        }
        // Se for apenas "#" ou link externo, deixa o comportamento padrão
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 102, 204, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 102, 204, 0.1)';
    }

    lastScroll = currentScroll;
});

// Aplicar configurações do CONFIG
// Suporta tanto variáveis de ambiente do Netlify quanto config.js local
const applyConfig = () => {
    // Tentar ler variáveis de ambiente primeiro (Netlify)
    let config = {};

    if (typeof window !== 'undefined' && window.__NETLIFY_ENV__) {
        // Variáveis injetadas pelo Netlify
        config = window.__NETLIFY_ENV__;
    } else if (typeof CONFIG !== 'undefined') {
        // Fallback para config.js local
        config = CONFIG;
    } else {
        console.warn('CONFIG não encontrado. Usando valores padrão.');
        return;
    }

    // Usar CONFIG global se disponível (compatibilidade)
    const CONFIG_TO_USE = typeof CONFIG !== 'undefined' ? CONFIG : config;

    // Atualizar links do WhatsApp
    const whatsappUrl = `https://wa.me/${CONFIG_TO_USE.whatsapp}`;

    // Hero section
    const heroWhatsappBtn = document.getElementById('hero-whatsapp-btn');
    const heroWhatsappText = document.getElementById('hero-whatsapp-text');
    const heroRegiao = document.getElementById('hero-regiao');

    if (heroWhatsappBtn) heroWhatsappBtn.href = whatsappUrl;
    if (heroWhatsappText) heroWhatsappText.textContent = CONFIG_TO_USE.whatsappButtonText;
    if (heroRegiao) heroRegiao.textContent = CONFIG_TO_USE.regiao;

    // Services section
    const servicesWhatsappBtn = document.getElementById('services-whatsapp-btn');
    const servicesWhatsappText = document.getElementById('services-whatsapp-text');

    if (servicesWhatsappBtn) servicesWhatsappBtn.href = whatsappUrl;
    if (servicesWhatsappText) servicesWhatsappText.textContent = CONFIG_TO_USE.whatsappButtonText;

    // Schedule box
    const scheduleHorario = document.getElementById('schedule-horario');
    const scheduleExclusivo = document.getElementById('schedule-exclusivo');

    if (scheduleHorario) scheduleHorario.textContent = `Atendimento de ${CONFIG_TO_USE.atendimento.horario}.`;
    if (scheduleExclusivo) scheduleExclusivo.textContent = CONFIG_TO_USE.atendimento.exclusivo;

    // Diferencial section
    const diferencialWhatsappBtn = document.getElementById('diferencial-whatsapp-btn');
    const diferencialWhatsappText = document.getElementById('diferencial-whatsapp-text');

    if (diferencialWhatsappBtn) diferencialWhatsappBtn.href = whatsappUrl;
    if (diferencialWhatsappText) diferencialWhatsappText.textContent = CONFIG_TO_USE.whatsappButtonText;

    // Footer
    const footerHorario = document.getElementById('footer-horario');
    const footerExclusivo = document.getElementById('footer-exclusivo');
    const footerWhatsappLink = document.getElementById('footer-whatsapp-link');
    const footerRegiao = document.getElementById('footer-regiao');

    if (footerHorario) footerHorario.textContent = CONFIG_TO_USE.atendimento.horario;
    if (footerExclusivo) footerExclusivo.textContent = CONFIG_TO_USE.atendimento.exclusivo;
    if (footerWhatsappLink) footerWhatsappLink.href = whatsappUrl;
    if (footerRegiao) footerRegiao.textContent = CONFIG_TO_USE.regiao;

    // Services list
    const servicesList = document.getElementById('services-list');
    if (servicesList && CONFIG_TO_USE.servicos && Array.isArray(CONFIG_TO_USE.servicos)) {
        servicesList.innerHTML = '';
        CONFIG_TO_USE.servicos.forEach(servico => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.textContent = `• ${servico}`;
            servicesList.appendChild(serviceItem);
        });
    }
};

// Animação de fade-in ao scroll
const fadeInOnScroll = () => {
    const elements = document.querySelectorAll('.service-item, .diferencial-item, .payment-item, .info-box, .schedule-box');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

// Atualizar ano atual no footer
const updateCurrentYear = () => {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

// Inicializar animações e configurações ao carregar
window.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    fadeInOnScroll();
    updateCurrentYear();
});

// Adicionar efeito parallax suave no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-background');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

