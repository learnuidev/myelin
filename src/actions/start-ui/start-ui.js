const startUi = async () => {
  const http = await require("http");
  const fs = await require("fs");
  const path = await require("path");

  const server = http.createServer((req, res) => {
    if (req.url === "/") {
      fs.readdir(".", (err, files) => {
        if (err) {
          res.writeHead(500);
          res.end("Error reading directory");
          return;
        }

        const fileLinks = files
          .map((file) => `<a href="/file/${file}">${file}</a>`)
          .join("<br>");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`<h1>Current Directory Files:</h1>${fileLinks}`);
      });
    } else if (req.url.startsWith("/file/")) {
      const fileName = path.basename(decodeURIComponent(req.url.slice(6)));
      fs.readFile(fileName, "utf8", (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end("File not found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(content);
      });
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  const port = 9000;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
};

module.exports = {
  startUi,
};
