(function() {
    // Setzen einer Content Security Policy (CSP), um die Ausführung von unbefugtem Skriptcode zu verhindern
    const cspMetaTag = document.createElement('meta');
    cspMetaTag.httpEquiv = 'Content-Security-Policy';
    cspMetaTag.content = "default-src 'self'; script-src 'self' https://raw.githubusercontent.com; object-src 'none'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(cspMetaTag);

    // Funktion zum Laden und Ausführen eines externen Skripts mit Subresource Integrity (SRI) für Sicherheit
    const loadScript = (url, integrity) => {
        const scriptTag = document.createElement('script');
        scriptTag.src = url;
        if (integrity) {
            scriptTag.integrity = integrity;
            scriptTag.crossOrigin = 'anonymous';  // Sicherstellen, dass CORS korrekt gehandhabt wird
        }
        scriptTag.onload = () => {
            console.log(`${url} wurde erfolgreich geladen und ausgeführt.`);
        };
        scriptTag.onerror = (error) => {
            console.error(`Fehler beim Laden von ${url}:`, error);
        };
        document.body.appendChild(scriptTag);
    };

    // Lade die Skripte mit Subresource Integrity (SRI) Hashes
    loadScript("https://raw.githubusercontent.com/Fortressdesign4/bayram-usta2/refs/heads/main/sec.js", "sha384-xyz...");  // Beispiel SRI Hash
    loadScript("https://raw.githubusercontent.com/Fortressdesign4/bayram-usta2/refs/heads/main/useragents.js", "sha384-abc...");  // Beispiel SRI Hash
    loadScript("https://raw.githubusercontent.com/Fortressdesign4/bayram-usta2/refs/heads/main/app.js", "sha384-def...");  // Beispiel SRI Hash

    // Funktion zum Laden und Einfügen des Stylesheets mit Integritätsprüfung
    const loadCSS = (url, integrity) => {
        const linkTag = document.createElement('link');
        linkTag.rel = 'stylesheet';
        linkTag.href = url;
        if (integrity) {
            linkTag.integrity = integrity;
            linkTag.crossOrigin = 'anonymous';
        }
        linkTag.onload = () => {
            console.log(`${url} wurde erfolgreich geladen.`);
        };
        linkTag.onerror = (error) => {
            console.error(`Fehler beim Laden von ${url}:`, error);
        };
        document.head.appendChild(linkTag);
    };

    // Lade die CSS-Datei mit einem SRI-Hash
    loadCSS("https://raw.githubusercontent.com/Fortressdesign4/bayram-usta2/refs/heads/main/style.css", "sha384-ghi...");  // Beispiel SRI Hash

    // Funktion zum sicheren Laden eines Bildes
    const proxyUrl = 'https://localhost/bayram-usta/';
    const imageUrl = '4/bayram-usta2/blob/main/bg-header.png';

    fetch(proxyUrl + imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            document.getElementById('header').style.backgroundImage = `url(${imageUrl})`;
        })
        .catch(error => {
            console.error('Fehler beim Laden des Bildes:', error);
        });

})();
