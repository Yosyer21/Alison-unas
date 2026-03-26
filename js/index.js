/* ===== ALLISON BEAUTY STUDIO - JAVASCRIPT ===== */
// Funcionalidades: Menú móvil, modal de reserva, formulario, scroll suave, galería, animaciones, etc.

function syncMobileMenuState(isOpen) {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const menuBackdrop = document.getElementById('menuBackdrop');
  if (!menuToggle || !navLinks) {
    return;
  }

  const menuIcon = menuToggle.querySelector('i');
  navLinks.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  document.body.classList.toggle('menu-open', isOpen);

  if (menuBackdrop) {
    menuBackdrop.classList.toggle('active', isOpen);
    menuBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  if (menuIcon) {
    menuIcon.classList.toggle('fa-bars', !isOpen);
    menuIcon.classList.toggle('fa-times', isOpen);
  }
}

function toggleMobileMenuGlobal() {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) {
    return;
  }

  syncMobileMenuState(!navLinks.classList.contains('active'));
}

function closeMobileMenuGlobal() {
  syncMobileMenuState(false);
}

window.AllisonBeautyToggle = toggleMobileMenuGlobal;

// ===== ESPERAR A QUE EL DOM ESTÉ COMPLETAMENTE CARGADO =====
document.addEventListener('DOMContentLoaded', function() {
  // ===== ELEMENTOS DEL DOM =====
  // Menú móvil
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  // Modal de reserva
  const modal = document.getElementById('reservaModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const heroReservaBtn = document.getElementById('heroReservaBtn');
  const ctaReservaBtn = document.getElementById('ctaReservaBtn');
  const reservaNavBtn = document.getElementById('reservaNavBtn');
  const bookingForm = document.getElementById('bookingForm');
  const WHATSAPP_NUMBER = '50689648077'; // ← Cambiar al número real de Allison (ej: 50688887777)
  
  // Elementos adicionales
  const body = document.body;
  const navBar = document.querySelector('.navbar');
  const allNavAnchors = document.querySelectorAll('.nav-links a');
  const serviceCards = document.querySelectorAll('.service-card');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  // ===== 1. FUNCIONES DEL MODAL DE RESERVA =====
  function openModal() {
    if (modal) {
      modal.style.display = 'flex';
      body.style.overflow = 'hidden'; // Evitar scroll del fondo
      // Animación de entrada (CSS ya maneja la animación)
      
      // Pequeño efecto de foco en el primer campo
      setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }
  
  function closeModal() {
    if (modal) {
      modal.style.display = 'none';
      body.style.overflow = 'auto'; // Restaurar scroll
      // Limpiar formulario si se desea (opcional, se limpia al enviar)
    }
  }
  
  // Cerrar modal haciendo clic fuera del contenido
  function handleModalClick(e) {
    if (e.target === modal) {
      closeModal();
    }
  }
  
  // Prevenir cierre al hacer clic dentro del contenido
  function handleModalContentClick(e) {
    e.stopPropagation();
  }
  
  // ===== 2. MANEJO DEL FORMULARIO DE RESERVA =====
  function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const telefono = document.getElementById('telefono')?.value.trim() || '';
    const servicioSelect = document.getElementById('servicioSelect');
    const servicio = servicioSelect?.value || '';
    const fechaCita = document.getElementById('fechaCita')?.value || '';
    const horaCita = document.getElementById('horaCita')?.value || '';
    const comentarios = document.getElementById('comentarios')?.value.trim() || '';
    
    // Validaciones
    if (!nombre) {
      showNotification('Por favor ingresa tu nombre', 'error');
      document.getElementById('nombre')?.focus();
      return;
    }
    
    if (nombre.length < 2) {
      showNotification('El nombre debe tener al menos 2 caracteres', 'error');
      return;
    }
    
    if (!telefono) {
      showNotification('Por favor ingresa tu teléfono', 'error');
      document.getElementById('telefono')?.focus();
      return;
    }
    
    // Validar teléfono (formato básico)
    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
    if (!phoneRegex.test(telefono)) {
      showNotification('Por favor ingresa un número de teléfono válido', 'error');
      return;
    }
    
    if (!servicio) {
      showNotification('Por favor selecciona un servicio', 'error');
      servicioSelect?.focus();
      return;
    }

    if (!fechaCita) {
      showNotification('Por favor selecciona la fecha de tu cita', 'error');
      document.getElementById('fechaCita')?.focus();
      return;
    }

    const selectedDate = new Date(fechaCita + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showNotification('La fecha seleccionada ya pasó. Por favor elige una fecha futura.', 'error');
      document.getElementById('fechaCita')?.focus();
      return;
    }

    if (!horaCita) {
      showNotification('Por favor selecciona la hora de tu cita', 'error');
      document.getElementById('horaCita')?.focus();
      return;
    }

    // Formatear fecha legible en español
    const [year, month, day] = fechaCita.split('-');
    const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    const fechaLegible = `${parseInt(day)} de ${monthNames[parseInt(month) - 1]} de ${year}`;

    // Formatear hora
    const hNum = parseInt(horaCita.split(':')[0]);
    const horaLegible = hNum >= 12 ? `${hNum === 12 ? 12 : hNum - 12}:00 PM` : `${hNum}:00 AM`;

    // Construir mensaje de WhatsApp
    let waMessage = `Hola Allison Beauty Studio! Quisiera reservar una cita:\n\n`;
    waMessage += `Nombre: ${nombre}\n`;
    waMessage += `Servicio: ${servicio}\n`;
    waMessage += `Fecha: ${fechaLegible}\n`;
    waMessage += `Hora: ${horaLegible}\n`;
    waMessage += `Teléfono: ${telefono}`;
    if (comentarios) waMessage += `\nNotas: ${comentarios}`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

    showNotification(`¡Gracias ${nombre}! Serás redirigido a WhatsApp para confirmar tu cita.`, 'success');
    if (bookingForm) bookingForm.reset();

    setTimeout(() => {
      closeModal();
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 2000);
  }
  
  // ===== 3. NOTIFICACIONES PERSONALIZADAS =====
  function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    // Estilos dinámicos para la notificación
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      background: ${type === 'success' ? '#1e1e1e' : '#f27b9b'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 1200;
      animation: slideInRight 0.3s ease;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      max-width: 350px;
      backdrop-filter: blur(10px);
    `;
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('#notification-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'notification-styles';
      styleSheet.textContent = `
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100px);
          }
        }
        .notification {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .notification:hover {
          transform: translateY(-2px);
        }
        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .notification-content i {
          font-size: 1.2rem;
        }
      `;
      document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
    
    // Cerrar al hacer clic
    notification.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    });
  }
  
  // ===== 4. MENÚ MÓVIL =====
  function toggleMobileMenu() {
    toggleMobileMenuGlobal();
  }
  
  function closeMobileMenu() {
    closeMobileMenuGlobal();
  }
  
  // ===== 5. SCROLL SUAVE PARA ENLACES ANCLA =====
  function smoothScroll(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 80; // Altura del navbar fijo
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Actualizar URL sin recargar
      history.pushState(null, null, `#${targetId}`);
    }
  }
  
  // Manejar clics en enlaces de navegación
  function handleNavClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      if (targetId && targetId !== '') {
        smoothScroll(targetId);
        closeMobileMenu(); // Cerrar menú móvil si está abierto
      }
    }
  }
  
  // ===== 6. DESTACAR ENLACE ACTIVO AL HACER SCROLL =====
  function highlightActiveNavLink() {
    const sections = ['inicio', 'servicios', 'porque', 'galeria'];
    const scrollPosition = window.scrollY + 100; // Offset para considerar navbar
    
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
      
      if (section && navLink) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          // Remover active de todos
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
          });
          navLink.classList.add('active');
        }
      }
    });
  }
  
  // ===== 7. EFECTOS DE ANIMACIÓN AL HACER SCROLL =====
  function handleScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.service-card, .gallery-item, .col-text, .col-img');
    
    elementsToAnimate.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  }
  
  // ===== 8. GALERÍA INTERACTIVA (LIGHTBOX) =====
  function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 2000;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 16px;
      box-shadow: 0 0 30px rgba(0,0,0,0.5);
    `;
    
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 30px;
      color: white;
      font-size: 40px;
      cursor: pointer;
      font-family: monospace;
      transition: transform 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.1)';
    closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1)';
    
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Cerrar lightbox
    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === closeBtn) {
        closeLightbox();
      }
    });
    
    // Escapar con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
    
    return { lightbox, lightboxImg, closeLightbox };
  }
  
  function initGallery() {
    const { lightbox, lightboxImg, closeLightbox } = createLightbox();
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
  }
  
  // ===== 9. CONTADOR DE CARACTERES PARA TELÉFONO (opcional) =====
  function setupPhoneInput() {
    const phoneInput = document.getElementById('telefono');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        // Permitir solo números, +, -, espacios y paréntesis
        this.value = this.value.replace(/[^0-9+\-\s()]/g, '');
      });
    }
  }
  
  // ===== 10. PREVENIR ENVÍO DUPLICADO DEL FORMULARIO =====
  let isSubmitting = false;
  
  function setupFormSubmission() {
    if (bookingForm) {
      bookingForm.addEventListener('submit', function(e) {
        if (isSubmitting) {
          e.preventDefault();
          return;
        }
        isSubmitting = true;
        handleBookingSubmit(e);
        setTimeout(() => {
          isSubmitting = false;
        }, 3000);
      });
    }
  }
  
  // ===== 11. EFECTO DE CARGA INICIAL =====
  function initPageLoad() {
    // Aplicar estilos iniciales para animaciones
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .col-text, .col-img');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Pequeño retraso para mostrar animaciones
    setTimeout(() => {
      handleScrollAnimations();
    }, 100);
  }
  
  // ===== 12. MANEJO DEL BOTÓN DE WHATSAPP (mejorar enlace) =====
  function setupWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
      const defaultMessage = 'Hola Allison Beauty Studio, me gustaría agendar una cita para uñas/pestañas/cejas.';
      whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;
    }
  }
  
  // ===== 13. EVENT LISTENERS =====
  // Modal
  if (heroReservaBtn) heroReservaBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (ctaReservaBtn) ctaReservaBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (reservaNavBtn) reservaNavBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', handleModalClick);
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.addEventListener('click', handleModalContentClick);
  }
  
  // Menú móvil
  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      toggleMobileMenu();
    });

    // Soporte por teclado (Enter / Space) para accesibilidad
    menuToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
    });

    document.addEventListener('click', function(e) {
      if (navLinks && navLinks.classList.contains('active') && navBar && !navBar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  const menuBackdrop = document.getElementById('menuBackdrop');
  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMobileMenu);
  }
  
  // Navegación suave
  allNavAnchors.forEach(anchor => {
    anchor.addEventListener('click', handleNavClick);
  });
  
  // Scroll events
  window.addEventListener('scroll', () => {
    highlightActiveNavLink();
    handleScrollAnimations();
  });
  
  // Resize event (cerrar menú móvil en resize)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) {
      closeMobileMenu();
    }
  });
  
  // ===== 14. INICIALIZAR TODAS LAS FUNCIONES =====
  initPageLoad();
  initGallery();
  setupPhoneInput();
  setupFormSubmission();
  setupWhatsAppButton();

  // Fijar fecha mínima en el date picker al día de hoy
  const fechaInput = document.getElementById('fechaCita');
  if (fechaInput) {
    fechaInput.min = new Date().toISOString().split('T')[0];
  }
  highlightActiveNavLink();
  
  // ===== 15. EFECTO DE PARALLAX SUAVE EN HERO (opcional) =====
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < 600) {
        heroSection.style.backgroundPosition = `center ${scrolled * 0.5}px`;
      }
    });
  }
  
  // ===== 16. AGREGAR ATRIBUTO DE SEGURIDAD A FORMULARIOS =====
  if (bookingForm) {
    bookingForm.setAttribute('autocomplete', 'off');
  }
  
  // ===== 17. CONSOLA AMIGABLE =====
  console.log('✨ Allison Beauty Studio - Página cargada correctamente ✨');
  console.log('💅 Servicios disponibles: Uñas, Pestañas, Cejas');
  console.log('📞 Reservas activas - Modal funcionando');
});

// ===== 18. MANEJO DE ERRORES GLOBALES =====
window.addEventListener('error', function(e) {
  console.error('Error en la página:', e.message);
  // No mostrar alertas al usuario, solo registro silencioso
});

// ===== 19. EXPORTAR FUNCIONES ÚTILES PARA DEBUG (opcional) =====
window.AllisonBeauty = {
  openModal: () => {
    const modal = document.getElementById('reservaModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  },
  closeModal: () => {
    const modal = document.getElementById('reservaModal');
    if (modal) {
      modal.style.display = 'none';
    }
  },
  toggleMobileMenu: toggleMobileMenuGlobal,
  closeMobileMenu: closeMobileMenuGlobal,
  version: '1.0.0'
};
