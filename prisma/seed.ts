import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Sample user profiles with diverse tiers and mascots
const SAMPLE_USERS = [
  // ── CERTIFICATE ACHIEVERS (All 24 Steps Cleared) ──
  {
    name: "นาย ณภัทร แสงกล้า",
    email: "napat@gmail.com",
    phoneNumber: "081-234-5678",
    selectedMascot: "StarPy",
    completedStepsCount: 24,
    xp: 2400,
    level: 5,
    streak: 24,
    hearts: 5,
    role: "user",
  },
  {
    name: "น.ส. รินรดา พงษ์สวัสดิ์",
    email: "rinrada.p@gmail.com",
    phoneNumber: "082-345-6789",
    selectedMascot: "BunnyCode",
    completedStepsCount: 24,
    xp: 2550,
    level: 5,
    streak: 28,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย ภัทรพล วงศ์สวรรค์",
    email: "pattarapol.w@hotmail.com",
    phoneNumber: "083-456-7890",
    selectedMascot: "FoxPy",
    completedStepsCount: 24,
    xp: 2700,
    level: 6,
    streak: 30,
    hearts: 4,
    role: "user",
  },
  {
    name: "น.ส. วรินทร สุริยวงศ์",
    email: "warintorn.s@outlook.com",
    phoneNumber: "084-567-8901",
    selectedMascot: "OwlLog",
    completedStepsCount: 24,
    xp: 2480,
    level: 5,
    streak: 19,
    hearts: 5,
    role: "user",
  },
  {
    name: "Alex Morgan",
    email: "alex.m@codetech.io",
    phoneNumber: "085-678-9012",
    selectedMascot: "BearStack",
    completedStepsCount: 24,
    xp: 2900,
    level: 6,
    streak: 35,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย ชินภัทร เจริญเกียรติ",
    email: "chinapat.c@gmail.com",
    phoneNumber: "086-789-0123",
    selectedMascot: "PandaPy",
    completedStepsCount: 24,
    xp: 2420,
    level: 5,
    streak: 15,
    hearts: 3,
    role: "user",
  },
  {
    name: "น.ส. ปณิดา กิตติคุณ",
    email: "panida.k@gmail.com",
    phoneNumber: "087-890-1234",
    selectedMascot: "KoalaByte",
    completedStepsCount: 24,
    xp: 2600,
    level: 5,
    streak: 22,
    hearts: 5,
    role: "user",
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.j@devlearn.org",
    phoneNumber: "088-901-2345",
    selectedMascot: "PixelPup",
    completedStepsCount: 24,
    xp: 2510,
    level: 5,
    streak: 26,
    hearts: 5,
    role: "user",
  },

  // ── ADVANCED LEARNERS (Steps 18 - 23) ──
  {
    name: "นาย ธนกฤต มั่นคง",
    email: "thanakrit.m@gmail.com",
    phoneNumber: "089-012-3456",
    selectedMascot: "FoxPy",
    completedStepsCount: 23,
    xp: 2300,
    level: 5,
    streak: 18,
    hearts: 4,
    role: "user",
  },
  {
    name: "น.ส. ศิริพร บุญเสริม",
    email: "siriporn.b@yahoo.com",
    phoneNumber: "090-123-4567",
    selectedMascot: "StarPy",
    completedStepsCount: 22,
    xp: 2200,
    level: 4,
    streak: 14,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย ภูมิพัฒน์ ศรีสุวรรณ",
    email: "phumipat.s@gmail.com",
    phoneNumber: "091-234-5678",
    selectedMascot: "BearStack",
    completedStepsCount: 21,
    xp: 2100,
    level: 4,
    streak: 12,
    hearts: 3,
    role: "user",
  },
  {
    name: "Kenji Takahashi",
    email: "kenji.t@tokyo-dev.jp",
    phoneNumber: "092-345-6789",
    selectedMascot: "PandaPy",
    completedStepsCount: 20,
    xp: 2050,
    level: 4,
    streak: 20,
    hearts: 5,
    role: "user",
  },
  {
    name: "น.ส. ชญาดา สิทธิชัย",
    email: "chayada.s@gmail.com",
    phoneNumber: "093-456-7890",
    selectedMascot: "BunnyCode",
    completedStepsCount: 19,
    xp: 1900,
    level: 4,
    streak: 9,
    hearts: 4,
    role: "user",
  },
  {
    name: "นาย กานต์ ธนวัฒน์",
    email: "karn.t@gmail.com",
    phoneNumber: "094-567-8901",
    selectedMascot: "OwlLog",
    completedStepsCount: 18,
    xp: 1800,
    level: 4,
    streak: 11,
    hearts: 5,
    role: "user",
  },

  // ── INTERMEDIATE LEARNERS (Steps 9 - 17) ──
  {
    name: "นาย ธีรภัทร์ รัตนโชติ",
    email: "theerapat.r@gmail.com",
    phoneNumber: "095-678-9012",
    selectedMascot: "FoxPy",
    completedStepsCount: 17,
    xp: 1700,
    level: 3,
    streak: 10,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย พีรพล เกษมสุข",
    email: "peerapol.k@gmail.com",
    phoneNumber: "096-789-0123",
    selectedMascot: "StarPy",
    completedStepsCount: 16,
    xp: 1600,
    level: 3,
    streak: 8,
    hearts: 4,
    role: "user",
  },
  {
    name: "น.ส. อภิญญา สุขใจ",
    email: "apinya.s@gmail.com",
    phoneNumber: "097-890-1234",
    selectedMascot: "KoalaByte",
    completedStepsCount: 15,
    xp: 1500,
    level: 3,
    streak: 7,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย นพรัตน์ แสงทอง",
    email: "noparat.s@gmail.com",
    phoneNumber: "098-901-2345",
    selectedMascot: "BearStack",
    completedStepsCount: 14,
    xp: 1400,
    level: 3,
    streak: 6,
    hearts: 2,
    role: "user",
  },
  {
    name: "Michael Brown",
    email: "michael.b@techhub.com",
    phoneNumber: "099-012-3456",
    selectedMascot: "PixelPup",
    completedStepsCount: 13,
    xp: 1320,
    level: 3,
    streak: 14,
    hearts: 5,
    role: "user",
  },
  {
    name: "น.ส. กัญญาภัทร ลิขิต",
    email: "kanyapat.l@gmail.com",
    phoneNumber: "081-112-2334",
    selectedMascot: "BunnyCode",
    completedStepsCount: 12,
    xp: 1200,
    level: 3,
    streak: 5,
    hearts: 5,
    role: "user",
  },
  {
    name: "น.ส. ธัญชนก ประเสริฐ",
    email: "thanchanok.p@gmail.com",
    phoneNumber: "082-223-3445",
    selectedMascot: "OwlLog",
    completedStepsCount: 10,
    xp: 1050,
    level: 2,
    streak: 4,
    hearts: 4,
    role: "user",
  },
  {
    name: "นาย สุรชัย ชัยชนะ",
    email: "surachai.c@gmail.com",
    phoneNumber: "083-334-4556",
    selectedMascot: "PandaPy",
    completedStepsCount: 9,
    xp: 920,
    level: 2,
    streak: 3,
    hearts: 3,
    role: "user",
  },

  // ── BEGINNERS (Steps 1 - 8) ──
  {
    name: "นาย ปัณณธร เวชวิชัย",
    email: "pannathorn.v@gmail.com",
    phoneNumber: "084-445-5667",
    selectedMascot: "StarPy",
    completedStepsCount: 7,
    xp: 700,
    level: 2,
    streak: 3,
    hearts: 5,
    role: "user",
  },
  {
    name: "Emily Chen",
    email: "emily.c@students.edu",
    phoneNumber: "085-556-6778",
    selectedMascot: "BunnyCode",
    completedStepsCount: 6,
    xp: 600,
    level: 2,
    streak: 4,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย รัชชานนท์ สังข์แก้ว",
    email: "ratchanon.s@gmail.com",
    phoneNumber: "086-667-7889",
    selectedMascot: "FoxPy",
    completedStepsCount: 6,
    xp: 600,
    level: 2,
    streak: 2,
    hearts: 4,
    role: "user",
  },
  {
    name: "น.ส. พิชญา เมธากุล",
    email: "pitchaya.m@gmail.com",
    phoneNumber: "087-778-8990",
    selectedMascot: "KoalaByte",
    completedStepsCount: 5,
    xp: 500,
    level: 1,
    streak: 2,
    hearts: 5,
    role: "user",
  },
  {
    name: "David Wilson",
    email: "david.w@gmail.com",
    phoneNumber: "088-889-9001",
    selectedMascot: "PixelPup",
    completedStepsCount: 5,
    xp: 500,
    level: 1,
    streak: 3,
    hearts: 4,
    role: "user",
  },
  {
    name: "นาย วริศ ชัยพฤกษ์",
    email: "waris.c@gmail.com",
    phoneNumber: "089-990-0112",
    selectedMascot: "BearStack",
    completedStepsCount: 4,
    xp: 400,
    level: 1,
    streak: 1,
    hearts: 5,
    role: "user",
  },
  {
    name: "Lisa Wang",
    email: "lisa.w@codebay.org",
    phoneNumber: "090-001-1223",
    selectedMascot: "BunnyCode",
    completedStepsCount: 3,
    xp: 300,
    level: 1,
    streak: 2,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย จิรวัฒน์ มั่นกล้า",
    email: "jirawat.m@gmail.com",
    phoneNumber: "091-112-2334",
    selectedMascot: "StarPy",
    completedStepsCount: 3,
    xp: 300,
    level: 1,
    streak: 1,
    hearts: 3,
    role: "user",
  },
  {
    name: "น.ส. ญาณิศา วิจิตร",
    email: "yanisa.w@gmail.com",
    phoneNumber: "092-223-3445",
    selectedMascot: "OwlLog",
    completedStepsCount: 2,
    xp: 200,
    level: 1,
    streak: 1,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย ฐิติวุฒิ เกิดผล",
    email: "thitiwut.k@gmail.com",
    phoneNumber: "093-334-4556",
    selectedMascot: "PandaPy",
    completedStepsCount: 2,
    xp: 200,
    level: 1,
    streak: 1,
    hearts: 4,
    role: "user",
  },
  {
    name: "น.ส. ณิชากานต์ พลอยงาม",
    email: "nichakan.p@gmail.com",
    phoneNumber: "094-445-5667",
    selectedMascot: "StarPy",
    completedStepsCount: 1,
    xp: 100,
    level: 1,
    streak: 1,
    hearts: 5,
    role: "user",
  },
  {
    name: "นาย พชร ศิริวัฒน์",
    email: "pachara.s@gmail.com",
    phoneNumber: "095-556-6778",
    selectedMascot: "FoxPy",
    completedStepsCount: 1,
    xp: 100,
    level: 1,
    streak: 1,
    hearts: 5,
    role: "user",
  },
  {
    name: "น.ส. นภัสสร อริยเดช",
    email: "napatsorn.a@gmail.com",
    phoneNumber: "096-667-7889",
    selectedMascot: "KoalaByte",
    completedStepsCount: 1,
    xp: 100,
    level: 1,
    streak: 1,
    hearts: 5,
    role: "user",
  },
];

async function main() {
  console.log("🌱 Starting PyStep database seeding...");

  // 1. Create/Update ADMIN ACCOUNT (admin / admin123)
  const salt = await bcrypt.genSalt(10);
  const adminHashedPassword = await bcrypt.hash("admin123", salt);
  const userHashedPassword = await bcrypt.hash("12345678", salt);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@pystep.com" },
    update: {
      name: "admin",
      password: adminHashedPassword,
      role: "admin",
      xp: 9999,
      level: 10,
      streak: 99,
      hearts: 5,
      selectedMascot: "StarPy",
    },
    create: {
      name: "admin",
      email: "admin@pystep.com",
      phoneNumber: "080-000-0000",
      password: adminHashedPassword,
      role: "admin",
      xp: 9999,
      level: 10,
      streak: 99,
      hearts: 5,
      selectedMascot: "StarPy",
    },
  });

  // Admin completes all 24 steps
  for (let stepId = 1; stepId <= 24; stepId++) {
    await prisma.userProgress.upsert({
      where: {
        userId_stepId: {
          userId: adminUser.id,
          stepId: stepId,
        },
      },
      update: { xpEarned: 100 },
      create: {
        userId: adminUser.id,
        stepId: stepId,
        xpEarned: 100,
      },
    });
  }

  console.log("👑 Admin Account created successfully:");
  console.log("   Username: admin");
  console.log("   Email:    admin@pystep.com");
  console.log("   Password: admin123");
  console.log("   Role:     admin");
  console.log("─────────────────────────────────────────");

  // 2. Create Sample Users
  let seededCount = 0;
  for (const sample of SAMPLE_USERS) {
    const user = await prisma.user.upsert({
      where: { email: sample.email },
      update: {
        name: sample.name,
        phoneNumber: sample.phoneNumber,
        password: userHashedPassword,
        role: sample.role,
        xp: sample.xp,
        level: sample.level,
        streak: sample.streak,
        hearts: sample.hearts,
        selectedMascot: sample.selectedMascot,
      },
      create: {
        name: sample.name,
        email: sample.email,
        phoneNumber: sample.phoneNumber,
        password: userHashedPassword,
        role: sample.role,
        xp: sample.xp,
        level: sample.level,
        streak: sample.streak,
        hearts: sample.hearts,
        selectedMascot: sample.selectedMascot,
      },
    });

    // Populate user completed steps
    for (let stepId = 1; stepId <= sample.completedStepsCount; stepId++) {
      // Calculate realistic completed date spread over past days
      const daysAgo = sample.completedStepsCount - stepId;
      const completedAt = new Date();
      completedAt.setDate(completedAt.getDate() - daysAgo);

      await prisma.userProgress.upsert({
        where: {
          userId_stepId: {
            userId: user.id,
            stepId: stepId,
          },
        },
        update: {
          xpEarned: 100,
          completedAt: completedAt,
        },
        create: {
          userId: user.id,
          stepId: stepId,
          xpEarned: 100,
          completedAt: completedAt,
        },
      });
    }

    seededCount++;
  }

  console.log(`✅ Successfully seeded ${seededCount} sample learners with diverse progress!`);
  console.log(`   Sample user password for all accounts: 12345678`);
  console.log("🎉 Database seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
