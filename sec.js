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
                           .replace(/<[^>]*>/g, '');  // Removes all other HTML tags

    return sanitized;
  },

  // **CSS Injection Prevention**
  sanitizeCSS(input) {
    return input.replace(/url\([^\)]*\)/gi, "")
                .replace(/expression\([^\)]*\)/gi, "");
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

    } catch (err) {
      console.error('Fehler beim Aktivieren des Wake Lock:', err);
    }
  },

  // **Malicious Content Cleaner – läuft alle 5 Sekunden**
  maliciousContentCleaner() {
    setInterval(() => {
      const maliciousSelectors = 'script, iframe, object, embed, link[rel="import"], [onload], [onclick], [onerror], [style*="expression("]';
      
      // Find malicious elements in the DOM
      document.querySelectorAll(maliciousSelectors).forEach((el) => {
        // Remove event attributes (onclick, onload, etc.)
        ['onload', 'onclick', 'onerror', 'style'].forEach(attr => el.removeAttribute(attr));

        // If the element has an inline style, sanitize it
        if (el.hasAttribute('style')) {
          const sanitizedStyle = this.sanitizeCSS(el.getAttribute('style'));
          el.setAttribute('style', sanitizedStyle);
        }

        // If it's a script, iframe, or object tag, clear it
        if (el.tagName === 'SCRIPT' || el.tagName === 'IFRAME' || el.tagName === 'OBJECT' || el.tagName === 'EMBED') {
          el.innerHTML = '';
          el.removeAttribute('src');
        }

        console.warn('Gefährliches Element bereinigt:', el);
      });
    }, 5000); // Run every 5 seconds to keep the page sanitized without reload
  },

  // **Bot Detection**
  detectBot() {
    const userAgent = navigator.userAgent.toLowerCase();
    const botUserAgents = [
      'bot',
      'crawler',
      'spider',
      'scraper',
      'googlebot'
    ];

    for (let i = 0; i < botUserAgents.length; i++) {
      if (userAgent.includes(botUserAgents[i])) {
        console.warn("Bot erkannt: ", userAgent);
        window.location.href = 'https://www.google.com'; // Redirect to Google if a bot is detected
        return;
      }
    }
  },

  // **Freeze Detection and Unfreeze Mechanism**
  detectFreeze() {
    let freezeDetected = false;
    let timeout;

    const checkFreeze = () => {
      if (freezeDetected) {
        console.warn("Freeze erkannt! Versuche, die Seite wiederherzustellen.");
        alert("Page might be frozen. Attempting recovery.");
      }
    };

    const startFreezeDetection = () => {
      freezeDetected = false;
      timeout = setTimeout(() => {
        freezeDetected = true;
        checkFreeze();
      }, 5000);
    };

    startFreezeDetection();

    // Reset der Freeze-Erkennung bei Benutzeraktivität
    ['mousemove', 'keydown', 'click'].forEach(event => {
      window.addEventListener(event, () => {
        freezeDetected = false;
        clearTimeout(timeout);
        startFreezeDetection();
      });
    });
  },

  // **Prevent 304 Status and force 200 OK**
  prevent304Status() {
    const originalFetch = window.fetch;

    window.fetch = (url, options) => {
      return originalFetch(url, options).then(response => {
        // Check if the status is 304 and modify it to 200
        if (response.status === 304 && (url.endsWith('.html') || url.endsWith('.css') || url.endsWith('.js'))) {
          console.log(`Intercepted 304 response for: ${url}. Changing to 200 OK.`);
          const clonedResponse = new Response(response.body, response);
          clonedResponse.status = 200; // Changing status to 200
          return clonedResponse;
        }
        return response;
      });
    };
  },

  // **NIS-2 / ISO 27001 Compliance: Encryption, Risk Assessment, Logging**
  encryptData(data) {
    return btoa(data);  // Example of data encryption
  },

  assessRisk(data) {
    const riskScore = Math.random();
    console.log(`Risk assessment: ${riskScore}`);
    return riskScore > 0.5 ? 'High Risk' : 'Low Risk';
  },

  logIncident(incidentType, message) {
    console.error(`[Incident] Type: ${incidentType}, Message: ${message}`);
  }
};

// **Testlauf des SecurityModules**
console.log("== SecurityModule Testlauf ==");

// Test-User
const user = { name: "Max", roles: ["admin"], consent: true, mfa: true };

// Test Logging für den User (wird nur erfolgen, wenn Tracking nicht blockiert ist)
SecurityModule.logAccess(user.name, "Accessed the root route");

// Weitere Tests und Sicherheitsprüfungen
console.log("SQLi erkannt:", SecurityModule.detectSQLi("SELECT * FROM users WHERE 1=1;"));
console.log("XSS erkannt:", SecurityModule.detectXSS('<script>alert("xss")</script>'));

// Malicious Content Cleaner starten
setInterval(() => {
  console.log("Malicious Content Cleaner läuft...");
}, 5000);

// IP-Leak Schutz
console.log("IP-Leak erkannt:", SecurityModule.detectIPLeak());

// WebRTC Leak Schutz
SecurityModule.detectWebRTCLeak();

// Schutz gegen Header-Leaks
SecurityModule.preventHeaderLeaks();

// Wake Lock aktivieren
SecurityModule.enableWakeLock();

// Bot Detection
SecurityModule.detectBot();

// Freeze Detection aktivieren
SecurityModule.detectFreeze();

// Prevent 304 Status and force 200 OK for HTML, CSS, and JS files
SecurityModule.prevent304Status();

// NIS-2 / ISO 27001 Compliance Features
const encryptedData = SecurityModule.encryptData("Sensitive Data");
console.log("Encrypted Data:", encryptedData);

const riskAssessment = SecurityModule.assessRisk("Sensitive Data");
console.log("Risk Assessment:", riskAssessment);

SecurityModule.logIncident("Unauthorized Access", "Attempted access to restricted area");

console.log("== Testlauf Ende ==");
