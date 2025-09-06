import DOMPurify from 'dompurify';
const maxLength = 200;

export function sanitizeUrlInput(input) {

  if (!input || typeof input !== "string" || input.trim().length === 0) {
    return "";
  }

  let cleaned = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],          
    ALLOWED_ATTR: [],          
    ALLOW_DATA_ATTR: false,     
    ALLOW_UNKNOWN_PROTOCOLS: false, 
    KEEP_CONTENT: true,       
    SANITIZE_DOM: false         
  });

  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  cleaned = cleaned.replace(/(\.\.\/|\.\.\\|~\/|~\\)/g, "");

  cleaned = cleaned.replace(/[<>"'`{}|^]/g, "");

  const webUrlPattern = /^https?:\/\/.+/i;
  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(\/.*)?$/;
  
  const windowsAbsolutePath = /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\?)*[^\\/:*?"<>|\r\n]*$/;
  const windowsUncPath = /^\\\\[^\\]+\\[^\\]+(?:\\[^\\]*)*$/;
  
  const unixAbsolutePath = /^\/(?:[^\/\0\n]+\/)*[^\/\0\n]*$/;
  const unixRelativePath = /^[^\/\0\n][^\/\0\n]*(?:\/[^\/\0\n]+)*\/?$/;


  if (webUrlPattern.test(cleaned)) {
    try {
      new URL(cleaned); // Validate URL structure
      return cleaned;
    } catch {
      return ""; // Invalid URL structure
    }
  }
  
  // Check if it looks like a domain (add protocol)
  if (domainPattern.test(cleaned)) {
    const withProtocol = "https://" + cleaned;
    try {
      new URL(withProtocol);
      return withProtocol;
    } catch {
      return ""; // Invalid URL even with protocol
    }
  }
  
  // Check Windows paths
  if (windowsAbsolutePath.test(cleaned) || windowsUncPath.test(cleaned)) {
    // Additional Windows path validation
    if (cleaned.length > 260) return ""; // Windows MAX_PATH limit
    if (/[*?"<>|]/.test(cleaned)) return ""; // Invalid Windows filename chars
    return cleaned;
  }
  
  // Check Unix/Mac paths
  if (unixAbsolutePath.test(cleaned)) {
    if (cleaned.length > 4096) return ""; // Reasonable path length limit
    return cleaned;
  }
  
  // Check Unix/Mac relative paths (be more permissive)
  if (unixRelativePath.test(cleaned) && !cleaned.includes('..')) {
    if (cleaned.length > 4096) return ""; // Reasonable path length limit
    return cleaned;
  }
  
  // If none of the patterns match, return empty string
  return "";
}

export function sanitizeDescription(input) {
  input = input.trim();
  if (!input || typeof input !== "string") {
    return "";
  }

  let cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],      
    ALLOWED_ATTR: [],     
    KEEP_CONTENT: true,   
    SANITIZE_DOM: false,   
  });

  cleaned = cleaned.trim();
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}


// export function testSanitizeMethod() {
//   const testCases = [
//     // ✅ Safe web URLs
//     ["https://example.com", "https://example.com"],
//     ["http://example.com/path", "http://example.com/path"],
//     ["example.com", "https://example.com"],
//     ["sub.domain.co.uk", "https://sub.domain.co.uk"],

//     // ✅ Safe file paths
//     ["C:\\Users\\name\\file.txt", "C:\\Users\\name\\file.txt"],
//     ["\\\\Server\\Share\\file.doc", "\\\\Server\\Share\\file.doc"],
//     ["/Users/name/file.txt", "/Users/name/file.txt"],
//     ["./relative/path/to/file.txt", "./relative/path/to/file.txt"],

//     // 🚨 Malicious: JS / XSS
//     ["javascript:alert('xss')", ""],
//     ["javascript://%0aalert(1)", ""],
//     ["data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==", ""],
//     ["<script>alert('xss')</script>example.com", "https://example.com"],

//     // 🚨 Malicious: path traversal
//     ["../../../etc/passwd", ""],
//     ["..\\..\\Windows\\System32", ""],
//     ["../../../../../../../../.ssh/id_rsa", ""],

//     // 🚨 Malicious: obfuscated / encoded
//     ["https://example.com/%2e%2e/%2e%2e/etc/passwd", ""],
//     ["..%2f..%2fetc/passwd", ""],
//     ["..%5c..%5cWindows\\System32", ""],
//     ["/..%c0%af../etc/passwd", ""],

//     // 🚨 Suspicious protocols
//     ["file:///etc/passwd", ""],
//     ["file://C:/Windows/System32/calc.exe", ""],
//     ["vbscript:msgbox('XSS')", ""],
//     ["about:blank", ""],
//     ["chrome://settings/", ""],

//     // 🚨 Host confusion
//     ["https://evil.com@trusted.com/", ""],
//     ["https://trusted.com.evil.com/", "https://trusted.com.evil.com"], // Should this be blocked?
//     ["http://127.0.0.1:80/admin", "http://127.0.0.1:80/admin"],        // Loopback SSRF
//     ["http://[::1]/secret", "http://[::1]/secret"],                     // IPv6 SSRF
//   ];

//   console.log("=== sanitizeUrlInput Test Results ===\n");

//   testCases.forEach(([input, expected]) => {
//     const output = sanitizeUrlInput(input);
//     const pass = output === expected ? "✅ PASS" : "❌ FAIL";
//     console.log(`${pass} | Input: ${input}\n   Output: ${output}\n   Expected: ${expected}\n`);
//   });
// }
