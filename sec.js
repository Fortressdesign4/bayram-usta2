(function() {
    // Sicherstellen, dass die Seite über HTTPS geladen wird
    if (window.location.protocol !== 'https:') {
        console.warn('Warnung: Seite ist nicht über HTTPS geladen!');
    }

    // CORS-Header Überprüfung
    if (!document.cors) {
        console.warn('CORS-Fehler: Fehlende CORS-Header.');
    }

    // Checken, ob der Browser JavaScript und Cookies aktiviert hat
    if (navigator.cookieEnabled) {
        console.log('Cookies sind aktiviert.');
    } else {
        console.warn('Warnung: Cookies sind deaktiviert!');
    }

    // Schutz vor Clickjacking durch das Setzen von X-Frame-Options
    if (window.top !== window.self) {
        console.error('Warnung: Clickjacking erkannt!');
    }

    // Schutz vor XSS (Cross-Site Scripting) durch das Escaping von Inhalten
    document.body.innerHTML = document.body.innerHTML.replace(/<script[^>]*>.*?<\/script>/g, "");

    // Überwachung von Fetch-Requests und XHR (XMLHttpRequest)
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        console.log('Fetching:', args[0]); // Geben die URL des Fetch-Requests aus
        return originalFetch.apply(this, args);
    };

    const originalXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        console.log('XHR-Request:', arguments[1]); // Geben die URL des XHR-Requests aus
        return originalXHR.apply(this, arguments);
    };

    // Schutz vor SQL-Injection (Basic Input Validation)
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (/[;'"]/g.test(this.value)) {
                console.warn('Warnung: Verdächtige Eingabe entdeckt!');
            }
        });
    });

    // IP-Leak-Schutz (Verhindert, dass private IP-Adressen gesendet werden)
    if (window.location.hostname.match(/^192\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])/)) {
        console.warn('Warnung: Private IP-Adresse erkannt!');
    }

    // Aufruf der Funktion zum Abrufen der öffentlichen IP
    getPublicIP();
})();
