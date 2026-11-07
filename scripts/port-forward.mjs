import http from "http";

const server = http.createServer((req, res) => {
  const options = {
    hostname: "localhost",
    port: 3000,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: "localhost:3000",
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (e) => {
    res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Waiting for server on localhost:3000...");
  });

  req.pipe(proxyReq, { end: true });
});

// Also handle WebSocket upgrades if any
server.on("upgrade", (req, socket, head) => {
  const proxySocket = http.request({
    hostname: "localhost",
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers,
  });

  proxySocket.on("upgrade", (proxyRes, targetSocket) => {
    socket.write(
      `HTTP/${proxyRes.httpVersion} ${proxyRes.statusCode} ${proxyRes.statusMessage}\r\n` +
        Object.entries(proxyRes.headers)
          .map(([k, v]) => `${k}: ${v}\r\n`)
          .join("") +
        "\r\n"
    );
    targetSocket.pipe(socket);
    socket.pipe(targetSocket);
  });

  proxySocket.end();
});

server.listen(3001, () => {
  console.log("Port forwarder active: http://localhost:3001 -> http://localhost:3000");
});
