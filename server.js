import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3e3;
app.use(express.json());
app.get(["/healthz", "/api/health"], (_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime()
  });
});
const distPath = path.resolve(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(vite.middlewares);
}
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`CITRAM Control Tower server listening on http://0.0.0.0:${PORT}`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && PORT !== 3e3) {
    console.warn(`Port ${PORT} is in use, falling back to port 3000`);
    app.listen(3e3, "0.0.0.0", () => {
      console.log(`CITRAM Control Tower server listening on http://0.0.0.0:3000`);
    });
  } else {
    console.error("Server error:", err);
  }
});
