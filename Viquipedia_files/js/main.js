/* ===========================================================
   VIQUIPÈDIA PYTHON — FUNCIONALITATS INTERACTIVES
   =========================================================== */

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {

  // ========== REFERENCIAS A ELEMENTOS DEL DOM ==========
  const menuToggle    = document.getElementById('menu-toggle');
  const menuDropdown  = document.querySelector('.menu__dropdown');
  const indexToggle   = document.getElementById('index-toggle');
  const indexBox      = document.querySelector('.index__box');
  const searchInput   = document.querySelector('.header__search-input');
  const contentArea   = document.querySelector('.content');
  const header        = document.querySelector('.header');


  // =====================================================
  // 1. CERRAR MENÚS AL HACER CLIC FUERA
  // =====================================================
  if (menuToggle) {
    menuToggle.addEventListener('change', function() {
      if (this.checked) {
        document.body.style.overflow = 'hidden'; // Bloquea scroll
      } else {
        document.body.style.overflow = '';       // Libera scroll
      }
    });
  }
  
  document.addEventListener('click', function (event) {
    // --- Menú lateral (hamburguesa) ---
    if (menuToggle && menuDropdown) {
      const clickedInsideMenu = menuDropdown.contains(event.target);
      const clickedOnToggle   = event.target === menuToggle || event.target.closest('label[for="menu-toggle"]');
      
      if (!clickedInsideMenu && !clickedOnToggle && menuToggle.checked) {
        menuToggle.checked = false;
        document.body.style.overflow = ''; // Asegurar que se libere el scroll
      }
    }

    // --- Índice de contenidos ---
    if (indexToggle && indexBox) {
      const clickedInsideIndex = indexBox.contains(event.target);
      const clickedOnToggle    = event.target === indexToggle || event.target.closest('label[for="index-toggle"]');
      
      if (!clickedInsideIndex && !clickedOnToggle) {
        indexToggle.checked = false;
      }
    }
  });

  // Cerrar menús con la tecla Escape
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (menuToggle && menuToggle.checked) {
        menuToggle.checked = false;
        document.body.style.overflow = '';
      }
      if (indexToggle && indexToggle.checked) {
        indexToggle.checked = false;
      }
    }
  });


  // =====================================================
  // 2. BUSCADOR FUNCIONAL
  // =====================================================
  if (searchInput && contentArea) {
    let searchTimeout;
    let currentMatchIndex = 0;
    let matches = [];

    // Creamos un contenedor para los resultados de búsqueda
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.setAttribute('aria-live', 'polite');
    searchResults.style.cssText = `
      display: none;
      margin: 8px 0;
      padding: 8px 12px;
      background: #f8f9fa;
      border: 1px solid #a2a9b1;
      border-radius: 2px;
      font-size: 14px;
      color: #202122;
    `;
    
    // Insertamos después del título principal
    const titleElement = document.querySelector('.title');
    if (titleElement && titleElement.parentNode) {
      titleElement.parentNode.insertBefore(searchResults, titleElement.nextSibling);
    }

    // Función para escapar caracteres especiales de regex
    function escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Función principal de búsqueda
    function performSearch() {
      const query = searchInput.value.trim();
      clearHighlights();
      
      if (query.length < 2) {
        searchResults.style.display = 'none';
        searchResults.textContent = '';
        matches = [];
        currentMatchIndex = 0;
        return;
      }

      const elements = contentArea.querySelectorAll('p, h1, h2, h3, h4, li, td:not(.infobox__cell--label)');
      matches = [];

      const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');

      elements.forEach(function (element) {
        // Ignoramos elementos de control de búsqueda o infoboxes por si acaso
        if (element.closest('.infobox, .search-results, .index-wrapper')) return;

        const originalHTML = element.innerHTML;
        
        // Comprobamos si el texto plano contiene la query antes de alterar el HTML
        if (element.textContent.match(regex)) {
          // Guardamos el HTML original en una propiedad del elemento para poder restaurarlo luego
          if (!element.dataset.originalHtml) {
            element.dataset.originalHtml = originalHTML;
          }

          // Reemplazamos TODAS las coincidencias inyectando la clase
          element.innerHTML = element.innerHTML.replace(regex, '<span class="search-highlight" style="background-color: #fde600; color: #202122; padding: 1px 0; border-radius: 1px;">$1</span>');
        }
      });

      // Recogemos todos los elementos resaltados que se han creado en el DOM
      matches = Array.from(contentArea.querySelectorAll('.search-highlight'));

      if (matches.length > 0) {
        searchResults.style.display = 'block';
        searchResults.innerHTML = `S'han trobat <strong>${matches.length}</strong> coincidències per "${query}". `;
        
        // Re-crear botones de navegación
        const prevButton = document.createElement('button');
        prevButton.textContent = '← Anterior';
        prevButton.style.cssText = 'margin-left: 8px; padding: 2px 8px; font-size: 13px; cursor: pointer; background: #f8f9fa; border: 1px solid #a2a9b1; border-radius: 2px;';
        
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Següent →';
        nextButton.style.cssText = prevButton.style.cssText;
        
        const clearButton = document.createElement('button');
        clearButton.textContent = '✕ Netejar';
        clearButton.style.cssText = prevButton.style.cssText;
        
        searchResults.appendChild(prevButton);
        searchResults.appendChild(nextButton);
        searchResults.appendChild(clearButton);
        
        prevButton.addEventListener('click', function () {
          currentMatchIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
          highlightMatch(currentMatchIndex);
        });
        
        nextButton.addEventListener('click', function () {
          currentMatchIndex = (currentMatchIndex + 1) % matches.length;
          highlightMatch(currentMatchIndex);
        });
        
        clearButton.addEventListener('click', function () {
          searchInput.value = '';
          clearHighlights();
          searchResults.style.display = 'none';
        });

        currentMatchIndex = 0;
        highlightMatch(currentMatchIndex);
      } else {
        searchResults.style.display = 'block';
        searchResults.textContent = `No s'ha trobat cap resultat per "${query}".`;
        matches = [];
      }
    }

    function highlightMatch(index) {
      if (matches.length === 0) return;

      // Resetear estilos de todos los highlights a amarillo estándar
      matches.forEach(span => {
        span.style.backgroundColor = '#fde600';
      });

      // Destacar el actual en naranja
      const currentMatch = matches[index];
      if (currentMatch) {
        currentMatch.style.backgroundColor = '#ff9632';

        // Scroll suave corregido con offset para el header fijo
        const headerHeight = header ? header.offsetHeight : 56;
        const elementPosition = currentMatch.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 60; // 60px de margen de seguridad

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      // Actualizar el contador de la interfaz
      const countText = searchResults.querySelector('strong');
      if (countText) {
        searchResults.firstChild.textContent = `Coincidència ${index + 1} de ${matches.length} per "${searchInput.value.trim()}". `;
      }
    }

    function clearHighlights() {
      // Restauramos el HTML original de los elementos modificados
      const elements = contentArea.querySelectorAll('[data-original-html]');
      elements.forEach(element => {
        element.innerHTML = element.dataset.originalHtml;
        delete element.dataset.originalHtml;
      });
      matches = [];
      currentMatchIndex = 0;
    }

    // Evento de entrada en el buscador (con debounce)
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(performSearch, 300);
    });

    // Evento de tecla Enter para ir a la siguiente coincidencia
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (matches.length > 0) {
          currentMatchIndex = (currentMatchIndex + 1) % matches.length;
          highlightMatch(currentMatchIndex);
        } else {
          performSearch();
        }
      }
    });
  }


  // =====================================================
  // 3. SCROLL SUAVE PARA ENLACES DEL ÍNDICE
  // =====================================================
  document.querySelectorAll('.index__list a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        event.preventDefault();
        
        // Cerrar el índice después de hacer clic
        if (indexToggle) {
          indexToggle.checked = false;
        }
        
        // Scroll suave con offset para el header fijo
        const headerHeight = header ? header.offsetHeight : 56;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // =====================================================
  // 4. BOTÓN "TORNAR A DALT"
  // =====================================================
  function createScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Tornar a dalt');
    button.title = 'Tornar a dalt';
    button.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 44px;
      height: 44px;
      background: #f8f9fa;
      border: 1px solid #a2a9b1;
      border-radius: 2px;
      font-size: 24px;
      color: #202122;
      cursor: pointer;
      z-index: 500; /* SOLUCIÓN AL BUG 2: Bajado de 999 a 500 para que quede por debajo del sidebar */
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
    `;
    
    // Efecto hover
    button.addEventListener('mouseenter', function () {
      this.style.backgroundColor = '#eaecf0';
    });
    
    button.addEventListener('mouseleave', function () {
      this.style.backgroundColor = '#f8f9fa';
    });
    
    // Acción de scroll al hacer clic
    button.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    document.body.appendChild(button);
    
    // Mostrar / ocultar según la posición del scroll
    let scrollTimeout;
    window.addEventListener('scroll', function () {
      // Debounce para mejorar rendimiento
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }
      
      scrollTimeout = window.requestAnimationFrame(function () {
        if (window.pageYOffset > 400) {
          button.style.opacity = '1';
          button.style.visibility = 'visible';
        } else {
          button.style.opacity = '0';
          button.style.visibility = 'hidden';
        }
      });
    });
    
    return button;
  }

  // Inicializar el botón de scroll
  createScrollToTopButton();


  // =====================================================
  // 5. MEJORA: CERRAR ÍNDICE AL HACER SCROLL
  // =====================================================
  if (indexToggle && indexBox) {
    let scrollTimeoutIndex;
    window.addEventListener('scroll', function () {
      if (indexToggle.checked) {
        clearTimeout(scrollTimeoutIndex);
        scrollTimeoutIndex = setTimeout(function () {
          indexToggle.checked = false;
        }, 1500);
      }
    });
  }
