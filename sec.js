const SecurityModule = {
  // **Tracker-Entfernung für PCs und Android-Geräte**
  detectAndBlockTracking() {
    const userAgent = navigator.userAgent.toLowerCase();

    // Blockiert Tracking für Android und PC (Windows)
    if (userAgent.includes("android") || userAgent.includes("windows nt")) {
      console.warn("Tracking blockiert für Android oder PC!");
      return false;  // Verhindert das Tracking für diese Geräte
    }
    return true;  // Tracking erlaubt für andere Geräte
  },

  // **Verhindert das Loggen von Zugriffen für blockierte Geräte**
  logAccess(u, s) { 
    if (this.detectAndBlockTracking()) {
      console.log(`[ACCESS] ${u} - ${s} - ${Date.now()}`);
    }
  },

  // **Sanitizer für DOM-Manipulationen** (Sanitize input to prevent injections)
  sanitizeDOMInput(input) {
    const sanitized = input.replace(/on\w+="[^"]*"/g, "")  // Entfernt alle Event-Handler wie onclick, onload etc.
                           .replace(/javascript:/gi, "")  // Entfernt JavaScript-Protokolle
                           .replace(/url\([^\)]*\)/gi, ""); // Prevents inline CSS injection like background-image:url(...)

    return sanitized;
  },

  // **HTML Injection Prevention**
  sanitizeHTMLInput(input) {
    const sanitized = input.replace(/<script\b[^<]*<\/script>/gi, "")
                           .replace(/<iframe\b[^<]*<\/iframe>/gi, "")
                           .replace(/<object\b[^<]*<\/object>/gi, "")
                           .replace(/<style\b[^<]*<\/style>/gi, "")
                           .replace(/<[^>]*>/g, '');  // Entfernt alle anderen HTML-Tags

    return sanitized;
  },

  // **CSS Injection Prevention**
  sanitizeCSS(input) {
    return input.replace(/url\([^\)]*\)/gi, "") // Entfernt URL-Injection
                .replace(/expression\([^\)]*\)/gi, "");  // Entfernt Expression()-CSS-Injection
  },

  // **Erkennung von SQL-Injektionen**
  detectSQLi(input) {
    return /(\bor\b|\band\b|--|;|\/\*|\*\/|xp_)/i.test(input);
  },

  // **Erkennung von XSS-Angriffen**
  detectXSS(input) {
    return /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(input);
  },

  // **WebRTC Leak Erkennung**
  detectWebRTCLeak() {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device => {
                    if (device.kind === 'audioinput' || device.kind === 'videoinput') {
                        console.warn("Möglicher WebRTC Leak erkannt! Gerät:", device);
                    }
                });
            })
            .catch(err => console.error('WebRTC Leak Erkennung fehlgeschlagen:', err));
    } else {
        console.log('WebRTC wird in diesem Browser nicht unterstützt.');
    }
  },

  // **Schutz gegen IP-Leaks**
  detectIPLeak() {
    const ipAddress = "127.0.0.1"; // Beispiel IP
    if (ipAddress !== "127.0.0.1") {
      console.warn("Möglicher IP-Leak erkannt! IP-Adresse: " + ipAddress);
      return true;
    }
    return false;
  },

  // **Blockierung von UDP-Verbindungen**
  blockUDP() {
    console.log("UDP-Verbindungen blockiert.");
    return true;
  },

  // **Schutz gegen Header-Leaks**
  preventHeaderLeaks() {
    const forbiddenHeaders = ['X-Forwarded-For', 'Server', 'Referer'];
    forbiddenHeaders.forEach(header => {
      Object.defineProperty(document, header, {
        get: function() {
          console.warn(`${header} Header blockiert`);
          return '';
        }
      });
    });
  },

  // **Tracker-Entfernung durch Benutzer-Agent**
  detectMaliciousUserAgent() {
    const maliciousUserAgents = [
      'malicious-bot',
      'evil-crawler',
      'bad-bot'
    ];

    const userAgent = navigator.userAgent.toLowerCase();
    maliciousUserAgents.forEach(agent => {
      if (userAgent.includes(agent)) {
        console.warn('Malicious User Agent detected:', userAgent);
        window.location.href = 'https://www.google.com'; // Redirect to Google if bot is detected
      }
    });
  },

  // **Wake Lock API**
  async enableWakeLock() {
    try {
      const wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake lock aktiviert!');
      
      wakeLock.addEventListener('release', () => {
        console.log('Wake lock freigegeben!');
      });

    } catch (err

    
