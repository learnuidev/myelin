const {
  queryItemsByProjectId,
} = require("../add-cloud-provider/aws/utils/dynamodb/query-items-by-project-id");
const { loadConfig } = require("../translate/utils/load-config");
const {
  loadRemoteSourceFiles,
} = require("../translate/utils/load-remote-source-files");

const startUi = async () => {
  const http = await require("http");
  const fs = await require("fs");
  const path = await require("path");

  const server = http.createServer((req, res) => {
    if (req.url === "/") {
      fs.readdir(".", async (err, files) => {
        if (err) {
          res.writeHead(500);
          res.end("Error reading directory");
          return;
        }

        const config = await loadConfig();
        const items = await queryItemsByProjectId({
          projectId: config.projectId,
        });

        const filteredItems = items.filter(
          (item) =>
            item.lang === config?.locale?.sourceLanguage &&
            item.type === "folder" &&
            Object.keys(item.translations)?.length > 0
        );

        const displayValues = items.map((item) => {
          return {
            ...item,
            fileName: item.fileName,
            baseFileName: item?.fileName?.split(".")?.[0],
            sourceTranslation: item?.translations,
          };
        });

        // const config = await loadRemoteSourceFiles();

        const fileLinks = files
          .map((file) => `<a href="/file/${file}">${file}</a>`)
          .join("<br>");
        res.writeHead(200, { "Content-Type": "text/html" });
        // res.end(`<h1>Current Directory Files:</h1>${fileLinks}`);
        res.end(`<h1>Current Directory Files:</h1>${fileLinks}
          
          <div>
          
            <div>
<code>
<pre>
            ${JSON.stringify(displayValues, null, 4)}
</pre>
</code>
            </div>
          </div>`);
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
