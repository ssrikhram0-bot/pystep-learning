import { prisma } from "../src/lib/prisma";

async function checkDatabase() {
  console.log("\n========================================");
  console.log(" 🔍 PYSTEP DATABASE CONNECTION CHECKER");
  console.log("========================================\n");

  const rawUrl = process.env.DATABASE_URL || "";
  // Mask password in database URL for safe terminal logging
  const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ":****@");
  console.log(`📡 Target URL     : ${maskedUrl || "(not set in .env)"}`);

  const startTime = Date.now();
  try {
    // 1. Test ping / raw connection
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;
    console.log(`⚡ Latency        : ${latency} ms`);
    console.log(`✅ Connection     : SUCCESS (Connected to MySQL)\n`);

    // 2. Query table counts
    const userCount = await prisma.user.count();
    const progressCount = await prisma.userProgress.count();
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [{ role: "admin" }, { name: "admin" }, { email: "admin@pystep.com" }],
      },
      select: { name: true, email: true, role: true },
    });

    console.log("📊 Database Summary:");
    console.log(`   - Total Users     : ${userCount} accounts`);
    console.log(`   - Lesson Records  : ${progressCount} completed steps`);
    console.log(`   - Admin Account   : ${adminUser ? `Found (${adminUser.email})` : "Not found"}`);

    console.log("\n🎉 สถานะ: ฐานข้อมูล MySQL เชื่อมต่อและทำงานได้สมบูรณ์ 100%!");
  } catch (error: any) {
    console.error(`\n❌ Connection FAILED: ไม่สามารถเชื่อมต่อกับ MySQL ได้`);
    console.error(`   Error Message : ${error.message}\n`);
    console.log("💡 คำแนะนำในการแก้ไข:");
    console.log("   1. ตรวจสอบว่าเปิด MySQL Server (เช่น XAMPP / Laragon / Docker) แล้วหรือยัง");
    console.log("   2. ตรวจสอบ DATABASE_URL ในไฟล์ .env ว่า username, password และ port ถูกต้องหรือไม่");
    console.log("   3. หากต้องการสลับไปใช้ SQLite ชั่วคราว รันคำสั่ง: npm run use:sqlite");
  } finally {
    await prisma.$disconnect();
    console.log("\n========================================\n");
  }
}

checkDatabase();
