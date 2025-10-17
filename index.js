// Import modul bawaan Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Kamu bisa ubah port di sini (misal: 1234, 8081, 3000, dll)
const PORT = process.argv[2] || process.env.PORT || 5000;
const HOSTNAME = '127.0.0.1';

function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css':  return 'text/css; charset=utf-8';
    case '.js':   return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png':  return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg':  return 'image/svg+xml';
    case '.woff': return 'font/woff';
    case '.woff2':return 'font/woff2';
    case '.ico':  return 'image/x-icon';
    default:      return 'application/octet-stream';
  }
}

const server = http.createServer((req, res) => {
  console.log(`Request masuk: ${req.url}`);

  // Sanitize URL to prevent directory traversal
  const unsafePath = req.url.split('?')[0];
  let safePath = path.normalize(unsafePath).replace(/^(\.\.[\/\\])+/, '');

  // If root, serve index.html
  if (safePath === '/') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);

  // Determine content type
  const ext = path.extname(filePath);
  const contentType = getContentType(ext);

  // Read and serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - File Tidak Ditemukan</h1>');
      } else {
        // Other server error
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>500 - Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

// Jalankan server
server.listen(PORT, HOSTNAME, () => {
  console.log(`✅ Server berjalan di http://${HOSTNAME}:${PORT}/`);
});
