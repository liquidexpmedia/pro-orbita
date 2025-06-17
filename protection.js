// ==========================================
// ÓRBITA #1 - SISTEMA DE PROTECCIÓN
// ==========================================

(function() {
  'use strict';
  
  // ==========================================
  // CONFIGURACIÓN
  // ==========================================
  const PROTECTION_CONFIG = {
    sessionDuration: 86400000,    // 24 horas en milisegundos
    checkInterval: 30000,         // Verificar cada 30 segundos
    redirectUrl: 'access.html',   // Página de acceso
    enableDevToolsDetection: true,
    enableRightClickBlock: true,
    enableKeyboardBlock: true,
    enableConsoleProtection: true
  };

  // ==========================================
  // VARIABLES GLOBALES
  // ==========================================
  let protectionActive = false;
  let devToolsOpen = false;
  let lastAccessCheck = Date.now();
  let accessData = null;

  // ==========================================
  // FUNCIONES DE VERIFICACIÓN DE ACCESO
  // ==========================================
  
  /**
   * Verifica si el usuario tiene acceso válido
   */
  function verifyAccess() {
    try {
      const hasAccess = localStorage.getItem('orbitaAccess');
      const accessTime = localStorage.getItem('orbitaAccessTime');
      const accessCode = localStorage.getItem('orbitaAccessCode');
      
      if (hasAccess !== 'granted' || !accessTime || !accessCode) {
        console.warn('Acceso no válido - datos faltantes');
        redirectToAccess();
        return false;
      }
      
      const accessDate = new Date(accessTime);
      const now = new Date();
      const timeDiff = now - accessDate;
      
      if (timeDiff > PROTECTION_CONFIG.sessionDuration) {
        console.warn('Acceso expirado');
        clearAccessData();
        redirectToAccess();
        return false;
      }
      
      // Actualizar último acceso
      lastAccessCheck = Date.now();
      
      // Almacenar datos de acceso para uso interno
      accessData = {
        code: accessCode,
        time: accessTime,
        method: localStorage.getItem('orbitaAccessMethod') || 'unknown'
      };
      
      return true;
      
    } catch (error) {
      console.error('Error verificando acceso:', error);
      redirectToAccess();
      return false;
    }
  }

  /**
   * Limpia todos los datos de acceso
   */
  function clearAccessData() {
    const keysToRemove = [
      'orbitaAccess',
      'orbitaAccessTime', 
      'orbitaAccessCode',
      'orbitaAccessMethod',
      'orbitaAttempts',
      'orbitaLockout'
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`No se pudo eliminar ${key}:`, e);
      }
    });
  }

  /**
   * Redirecciona a la página de acceso
   */
  function redirectToAccess() {
    try {
      window.location.href = PROTECTION_CONFIG.redirectUrl;
    } catch (error) {
      console.error('Error redirigiendo:', error);
      // Fallback: recargar página
      window.location.reload();
    }
  }

  /**
   * Verificación periódica de acceso
   */
  function startPeriodicCheck() {
    setInterval(() => {
      if (protectionActive) {
        const now = Date.now();
        if (now - lastAccessCheck > PROTECTION_CONFIG.checkInterval) {
          verifyAccess();
        }
      }
    }, PROTECTION_CONFIG.checkInterval);
  }

  // ==========================================
  // PROTECCIONES DE SEGURIDAD
  // ==========================================

  /**
   * Detecta si las herramientas de desarrollador están abiertas
   */
  function detectDevTools() {
    if (!PROTECTION_CONFIG.enableDevToolsDetection) return;
    
    let threshold = 160;
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          handleDevToolsOpen();
        }
      } else {
        if (devToolsOpen) {
          devToolsOpen = false;
        }
      }
    }, 500);
  }

  /**
   * Maneja cuando se detectan dev tools abiertas
   */
  function handleDevToolsOpen() {
    console.clear();
    console.log('%c🔒 CONTENIDO PROTEGIDO', 
      'font-size: 24px; font-weight: bold; color: #ff6b6b; background: #201E18; padding: 10px;');
    console.log('%c📖 Acceso autorizado solo con revista impresa', 
      'font-size: 16px; color: #f3f2f0; background: #201E18; padding: 5px;');
    console.log('%c🎨 Órbita #1 - September 2024', 
      'font-size: 14px; color: #4CAF50; background: #201E18; padding: 5px;');
    
    if (accessData) {
      console.log(`%cCódigo autorizado: ${accessData.code}`, 
        'font-size: 12px; color: #f3f2f0; background: #201E18; padding: 3px;');
      console.log(`%cMétodo de acceso: ${accessData.method}`, 
        'font-size: 12px; color: #f3f2f0; background: #201E18; padding: 3px;');
    }
  }

  /**
   * Bloquea el menú contextual (clic derecho)
   */
  function blockRightClick() {
    if (!PROTECTION_CONFIG.enableRightClickBlock) return;
    
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
  }

  /**
   * Bloquea combinaciones de teclas peligrosas
   */
  function blockDangerousKeys() {
    if (!PROTECTION_CONFIG.enableKeyboardBlock) return;
    
    document.addEventListener('keydown', function(e) {
      // F12 - DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I - DevTools
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C - Element Inspector
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U - View Source
      if (e.ctrlKey && e.key === 'U') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S - Save Page
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+A - Select All (opcional)
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
      }
    });
  }

  /**
   * Protección de consola
   */
  function protectConsole() {
    if (!PROTECTION_CONFIG.enableConsoleProtection) return;
    
    // Limpiar consola periódicamente
    const clearConsoleInterval = setInterval(() => {
      if (protectionActive) {
        console.clear();
        console.log('%c🎨 Órbita #1 - Contenido Protegido', 
          'font-size: 16px; color: #f3f2f0; background: #201E18; padding: 5px;');
        
        if (accessData) {
          console.log(`%cAcceso autorizado: ${accessData.code}`, 
            'font-size: 12px; color: #4CAF50;');
        }
      }
    }, 5000);

    // Redefinir funciones de consola críticas
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    
    // Interceptar logs que podrían revelar información sensible
    console.log = function(...args) {
      const message = args.join(' ');
      if (message.includes('validCodes') || 
          message.includes('localStorage') || 
          message.includes('accessCode')) {
        return; // Bloquear logs sensibles
      }
      originalLog.apply(console, args);
    };
  }

  // ==========================================
  // FUNCIONES DE UI
  // ==========================================

  /**
   * Crea botón de salida
   */
  function createExitButton() {
    const exitBtn = document.createElement('button');
    exitBtn.innerHTML = '← Salir de Órbita';
    exitBtn.id = 'orbita-exit-btn';
    
    exitBtn.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(243, 242, 239, 0.9);
      color: #333;
      padding: 8px 16px;
      border: 1px solid rgba(0,0,0,0.1);
      cursor: pointer;
      z-index: 10000;
      font-family: 'Rebond Grotesque', Arial, sans-serif;
      font-size: 12px;
      border-radius: 6px;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    
    exitBtn.addEventListener('click', () => {
      if (confirm('¿Deseas salir del contenido exclusivo de Órbita #1?')) {
        clearAccessData();
        redirectToAccess();
      }
    });
    
    exitBtn.addEventListener('mouseenter', () => {
      exitBtn.style.background = 'rgba(243, 242, 239, 1)';
      exitBtn.style.transform = 'translateY(-1px)';
      exitBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    exitBtn.addEventListener('mouseleave', () => {
      exitBtn.style.background = 'rgba(243, 242, 239, 0.9)';
      exitBtn.style.transform = 'translateY(0)';
      exitBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
    
    document.body.appendChild(exitBtn);
  }

  /**
   * Crea indicador de acceso (opcional)
   */
  function createAccessIndicator() {
    if (!accessData) return;
    
    const indicator = document.createElement('div');
    indicator.id = 'orbita-access-indicator';
    
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(76, 175, 80, 0.9);
      color: white;
      padding: 6px 12px;
      border-radius: 15px;
      font-family: 'Rebond Grotesque', Arial, sans-serif;
      font-size: 10px;
      z-index: 10000;
      opacity: 0.7;
      pointer-events: none;
    `;
    
    indicator.innerHTML = `✓ Acceso autorizado: ${accessData.code}`;
    
    document.body.appendChild(indicator);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.style.transition = 'opacity 1s ease';
        indicator.style.opacity = '0';
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.remove();
          }
        }, 1000);
      }
    }, 5000);
  }

  // ==========================================
  // FUNCIONES DE MONITOREO
  // ==========================================

  /**
   * Monitorea cambios en localStorage
   */
  function monitorLocalStorage() {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;
    
    localStorage.setItem = function(key, value) {
      if (key.startsWith('orbita') && protectionActive) {
        console.warn('Intento de modificación de datos de acceso detectado');
        return; // Bloquear modificaciones no autorizadas
      }
      originalSetItem.apply(this, arguments);
    };
    
    localStorage.removeItem = function(key) {
      if (key.startsWith('orbita') && protectionActive) {
        console.warn('Intento de eliminación de datos de acceso detectado');
        return; // Bloquear eliminaciones no autorizadas
      }
      originalRemoveItem.apply(this, arguments);
    };
    
    localStorage.clear = function() {
      if (protectionActive) {
        console.warn('Intento de limpieza de localStorage detectado');
        return; // Bloquear limpieza total
      }
      originalClear.apply(this, arguments);
    };
  }

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================

  /**
   * Inicializa el sistema de protección
   */
  function initializeProtection() {
    console.log('🔐 Inicializando sistema de protección Órbita...');
    
    // Verificar acceso inicial
    if (!verifyAccess()) {
      return false; // Si no tiene acceso, se redirecciona automáticamente
    }
    
    // Activar protección
    protectionActive = true;
    
    // Configurar protecciones
    detectDevTools();
    blockRightClick();
    blockDangerousKeys();
    protectConsole();
    monitorLocalStorage();
    
    // Crear elementos de UI
    createExitButton();
    createAccessIndicator();
    
    // Iniciar verificación periódica
    startPeriodicCheck();
    
    console.log('✅ Sistema de protección activo');
    console.log(`🎨 Bienvenido a Órbita #1 - Código: ${accessData.code}`);
    
    return true;
  }

  /**
   * Limpieza al salir
   */
  function cleanup() {
    protectionActive = false;
    
    // Remover elementos creados
    const exitBtn = document.getElementById('orbita-exit-btn');
    const indicator = document.getElementById('orbita-access-indicator');
    
    if (exitBtn) exitBtn.remove();
    if (indicator) indicator.remove();
  }

  // ==========================================
  // EVENTOS GLOBALES
  // ==========================================

  // Manejar cierre de página
  window.addEventListener('beforeunload', cleanup);
  
  // Manejar visibilidad de página
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('Página oculta - pausando verificaciones');
    } else {
      console.log('Página visible - reanudando verificaciones');
      if (protectionActive) {
        verifyAccess();
      }
    }
  });

  // ==========================================
  // EXPOSICIÓN CONTROLADA
  // ==========================================

  // Exponer solo funciones necesarias al scope global
  window.OrbitaProtection = {
    isActive: () => protectionActive,
    getAccessData: () => accessData ? {...accessData} : null,
    forceLogout: () => {
      clearAccessData();
      redirectToAccess();
    }
  };

  // ==========================================
  // AUTO-INICIALIZACIÓN
  // ==========================================

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProtection);
  } else {
    initializeProtection();
  }

  console.log('🚀 Sistema de protección Órbita cargado');

})();