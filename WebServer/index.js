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

  // Kalau user akses root '/', tampilkan index.html
  let requested = req.url.split('?')[0];
  if (requested === '/') requested = '/index.html';

  // Tentukan path file yang diminta
  const safePath = path.normalize(requested).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, requested);

  // Ambil ekstensi file untuk menentukan tipe konten
  const ext = path.extname(filePath);

  // Tentukan tipe konten (MIME type)
  let contentType = getContentType(ext);

  // Baca file dan kirim ke browser
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Tidak Ditemukan</h1>');
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
