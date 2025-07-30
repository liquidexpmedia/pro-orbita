// ==========================================
// ÓRBITA #1 - VALIDADOR DE CÓDIGOS QR (Flujo Simplificado)
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================
    // !!! IMPORTANTE: REEMPLAZA ESTA URL CON EL ENLACE PÚBLICO DE TU JSON EN AWS S3 !!!
    // Ejemplo: 'https://tu-nombre-de-bucket.s3.tu-region.amazonaws.com/valid-zine-codes.json'
    const JSON_CODES_URL = 'https://s3.eu-west-2.amazonaws.com/plotterspectrum.liquidexperimentalmedia.com/1/valid-zine-codes.json'; 
    const DENIED_PAGE_URL = 'denied.html'; // URL de la página de acceso denegado

    // ==========================================
    // FUNCIONES DE CONTROL DE UI
    // ==========================================

    function showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
        document.getElementById('zine-container').style.display = 'none';
    }

    function showZineContent() {
        document.getElementById('loading-screen').style.display = 'none';
        document.getElementById('zine-container').style.display = 'block';
    }

    function redirectToDeniedPage(message = 'Acceso Denegado.') {
        console.warn(message);
        window.location.href = DENIED_PAGE_URL;
    }

    // ==========================================
    // LÓGICA DE VALIDACIÓN
    // ==========================================

    async function validateQRCode() {
        showLoadingScreen(); // Show loading immediately

        const urlParams = new URLSearchParams(window.location.search);
        const uniqueCode = urlParams.get('code');

        if (!uniqueCode) {
            console.log(`Código ${uniqueCode} no encontrado en la lista de códigos válidos. Redirigiendo...`);
            //redirectToDeniedPage('No se encontró el código único en la URL. Redirigiendo...');
            return;
        }

        console.log(`Intentando validar código: ${uniqueCode}`);

        try {
            const response = await fetch(JSON_CODES_URL);
            if (!response.ok) {
                // If S3 returns a 403 Forbidden (common for permission issues), give specific message
                if (response.status === 403) {
                    throw new Error('Acceso denegado al archivo de códigos. Asegúrate que el JSON en S3 es público.');
                }
                throw new Error(`Error al cargar los códigos: ${response.status} ${response.statusText}`);
            }
            const validCodesData = await response.json();

            // Find the code in the list
            const foundCode = validCodesData.codes.find(item => item.code === uniqueCode);

            if (foundCode) {
                console.log(`Código ${uniqueCode} encontrado. Concediendo acceso ilimitado.`);
                // Access is granted directly, no 'used' check, no localStorage setting needed for this flow
                showZineContent(); 
            } else {
                console.log(`Código ${uniqueCode} no encontrado en la lista de códigos válidos. Redirigiendo...`);
                //redirectToDeniedPage(`Código ${uniqueCode} no encontrado en la lista de códigos válidos. Redirigiendo...`);
            }

        } catch (error) {
            console.error('Error durante la validación del código:', error);
            
            //redirectToDeniedPage(`No se pudo verificar el acceso: ${error.message}. Redirigiendo...`);
        }
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    // Run validation as soon as the DOM is ready (or earlier if possible for URL params)
    document.addEventListener('DOMContentLoaded', validateQRCode);

    console.log('🚀 QR Code Validator (Simplificado) cargado.');

})();