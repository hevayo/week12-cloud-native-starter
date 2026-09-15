// Week 12: a tiny HTTP server around the Week 11 site.
// No dependencies. Serves the static site, a JSON API, and a health endpoint.
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { convertCToF } = require("./site/script.js");

// Twelve-factor III: configuration comes from the environment, never from code
const PORT = Number(process.env.PORT) || 3000;
const VERSION = "v1"; // baked into the image; Part 6 of the lab changes it and ships a new image
const GREETING = process.env.GREETING || "Served by";

let healthy = true; // flipped by /break so we can watch the platform restart us

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "application/javascript" };

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  // Twelve-factor XI: logs go to stdout as one line per event
  console.log(JSON.stringify({ time: new Date().toISOString(), method: req.method, path: url.pathname, pod: os.hostname() }));

  if (url.pathname === "/healthz") {
    return healthy ? json(res, 200, { status: "ok" }) : json(res, 500, { status: "unhealthy" });
  }
  if (url.pathname === "/break") {
    healthy = false;
    return json(res, 200, { message: "healthz will now fail; watch the platform restart this container", pod: os.hostname() });
  }
  if (url.pathname === "/api/info") {
    return json(res, 200, { hostname: os.hostname(), version: VERSION, greeting: GREETING, uptimeSeconds: Math.round(process.uptime()) });
  }
  if (url.pathname === "/api/convert") {
    const c = Number(url.searchParams.get("c"));
    if (Number.isNaN(c)) return json(res, 400, { error: "query parameter c must be a number" });
    return json(res, 200, { celsius: c, fahrenheit: convertCToF(c), servedBy: os.hostname(), version: VERSION });
  }

  // static files from ./site
  const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const full = path.join(__dirname, "site", path.normalize(file));
  if (!full.startsWith(path.join(__dirname, "site")) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    return json(res, 404, { error: "not found" });
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(full)] || "application/octet-stream" });
  fs.createReadStream(full).pipe(res);
});

server.listen(PORT, () => console.log(`temp-converter ${VERSION} listening on ${PORT} on ${os.hostname()}`));

// Twelve-factor IX: disposability. Stop taking requests and exit cleanly when Kubernetes asks us to.
process.on("SIGTERM", () => { console.log("SIGTERM received, shutting down"); server.close(() => process.exit(0)); });
