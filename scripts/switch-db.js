const fs = require("fs");
const path = require("path");

const target = process.argv[2]?.toLowerCase() || "mysql";
const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");

if (!fs.existsSync(schemaPath)) {
  console.error("❌ schema.prisma not found at", schemaPath);
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, "utf-8");

if (target === "mysql") {
  content = content.replace(
    /datasource db \{[\s\S]*?\}/,
    `datasource db {\n  provider = "mysql"\n  url      = env("DATABASE_URL")\n}`
  );
  fs.writeFileSync(schemaPath, content, "utf-8");
  console.log("🐬 Switched Prisma database provider to: MySQL (url = env(\"DATABASE_URL\"))");
  console.log("👉 Run: npm run db:push && npm run db:seed to apply to MySQL.");
} else if (target === "sqlite") {
  content = content.replace(
    /datasource db \{[\s\S]*?\}/,
    `datasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}`
  );
  fs.writeFileSync(schemaPath, content, "utf-8");
  console.log("🪶 Switched Prisma database provider to: SQLite (file:./dev.db)");
  console.log("👉 Run: npm run db:push && npm run db:seed to apply to SQLite.");
} else {
  console.log("Usage: node scripts/switch-db.js [mysql|sqlite]");
}
