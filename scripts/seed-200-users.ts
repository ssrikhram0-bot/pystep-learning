import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FIRST_NAMES_TH = [
  "กิตติพงษ์", "ณัฐพงษ์", "วรวุฒิ", "ธนภัทร", "ชวลิต", "ศุภกิตติ์", "ปิยวัฒน์", "อภิสิทธิ์", "ธีรภัทร์", "วรินทร",
  "พงศกร", "นราธิป", "สรวิชญ์", "จิรายุ", "อัครเดช", "ณัฐวุฒิ", "ธนาคาร", "ศุภชัย", "ปวริศ", "ชลสิทธิ์",
  "ศศิธร", "วริศรา", "กัญญาณัฐ", "พิมพ์มาดา", "ชลธิชา", "สุพัตรา", "ณัฐริกา", "ธันยพร", "นภัสสร", "กมลวรรณ",
  "ปณิตา", "อรพินท์", "ศิริกานต์", "ทิพวรรณ", "กานดา", "สิรินทร์", "มัสยา", "เบญจวรรณ", "เพ็ญนภา", "รุจิรา",
  "ธนกฤต", "ภาณุพงศ์", "ชัยวัฒน์", "เจษฎา", "อนุชา", "เกียรติศักดิ์", "พีรพัฒน์", "รพีภัทร", "ภูริช", "สิทธิศักดิ์",
  "วรรณิศา", "ชุติมา", "สุจิตรา", "พัชราภา", "กุลธิดา", "อัญชลี", "ปิยะดา", "นฤมล", "ญาณิศา", "มนัสนันท์"
];

const LAST_NAMES_TH = [
  "สุขเกษม", "แสงสว่าง", "เจริญพร", "รัตนวงศ์", "มณีรัตน์", "ทองสุข", "คงมั่น", "วัฒนพานิช", "สุวรรณเวช", "อมรรัตน์",
  "บุญประเสริฐ", "ศรีสุข", "เดชะกุล", "สิทธิโชค", "สถิตพงษ์", "โชคอำนวย", "ทิพย์เนตร", "ประเสริฐผล", "วงษ์สุวรรณ", "ศิริชัย",
  "ตั้งตระกูล", "จิตรเกษม", "เพชรประสิทธิ์", "บุญยเกียรติ", "โรจนวิชัย", "เกียรติสุวรรณ", "เกตุแก้ว", "นาคราช", "พิทักษ์ธรรม", "สุรศักดิ์",
  "เจริญสุข", "พงษ์พิพัฒน์", "สมบูรณ์ทรัพย์", "ทรัพย์ศิริ", "วงศ์เจริญ", "มั่นคงดี", "ประสิทธิ์โชค", "ปัญญาวงศ์", "เลิศวิจิตร", "อนันตชัย"
];

const THAI_TO_ROMAN: Record<string, string> = {
  "กิตติพงษ์": "kittipong", "ณัฐพงษ์": "nattapong", "วรวุฒิ": "worawut", "ธนภัทร": "thanapat", "ชวลิต": "chawalit",
  "ศุภกิตติ์": "supakit", "ปิยวัฒน์": "piyawat", "อภิสิทธิ์": "aphisit", "ธีรภัทร์": "theerapat", "วรินทร": "warintorn",
  "พงศกร": "pongsakorn", "นราธิป": "narathip", "สรวิชญ์": "sorawit", "จิรายุ": "jirayu", "อัครเดช": "akkharadet",
  "ณัฐวุฒิ": "natthawut", "ธนาคาร": "thanakarn", "ศุภชัย": "suphachai", "ปวริศ": "pawarit", "ชลสิทธิ์": "cholasit",
  "ศศิธร": "sasithorn", "วริศรา": "warissara", "กัญญาณัฐ": "kanyanat", "พิมพ์มาดา": "pimmada", "ชลธิชา": "chonticha",
  "สุพัตรา": "supattra", "ณัฐริกา": "nattarika", "ธันยพร": "thanyaporn", "นภัสสร": "napatsorn", "กมลวรรณ": "kamonwan",
  "ปณิตา": "panita", "อรพินท์": "orapin", "ศิริกานต์": "sirikarn", "ทิพวรรณ": "tippawan", "กานดา": "kanda",
  "สิรินทร์": "sirin", "มัสยา": "matsaya", "เบญจวรรณ": "benjawan", "เพ็ญนภา": "phennapha", "รุจิรา": "rujira",
  "ธนกฤต": "thanakrit", "ภาณุพงศ์": "panupong", "ชัยวัฒน์": "chaiwat", "เจษฎา": "jetsada", "อนุชา": "anucha",
  "เกียรติศักดิ์": "kiattisak", "พีรพัฒน์": "peerapat", "รพีภัทร": "rapeepat", "ภูริช": "phurich", "สิทธิศักดิ์": "sitthisak",
  "วรรณิศา": "wannisa", "ชุติมา": "chutima", "สุจิตรา": "suchitra", "พัชราภา": "patcharapa", "กุลธิดา": "kunthida",
  "อัญชลี": "anchalee", "ปิยะดา": "piyada", "นฤมล": "narumon", "ญาณิศา": "yanisa", "มนัสนันท์": "manatsanan",

  "สุขเกษม": "sukkasem", "แสงสว่าง": "saengsawang", "เจริญพร": "charoenporn", "รัตนวงศ์": "rattanawong", "มณีรัตน์": "maneerat",
  "ทองสุข": "thongsuk", "คงมั่น": "khongman", "วัฒนพานิช": "wattanapanich", "สุวรรณเวช": "suwanwet", "อมรรัตน์": "amornrat",
  "บุญประเสริฐ": "boonprasert", "ศรีสุข": "srisuk", "เดชะกุล": "dechakun", "สิทธิโชค": "sitthichok", "สถิตพงษ์": "sathitpong",
  "โชคอำนวย": "chokamnuay", "ทิพย์เนตร": "thipphinet", "ประเสริฐผล": "prasertphon", "วงษ์สุวรรณ": "wongsuwan", "ศิริชัย": "sirichai",
  "ตั้งตระกูล": "tangtrakul", "จิตรเกษม": "jitkasem", "เพชรประสิทธิ์": "phetprasit", "บุญยเกียรติ": "boonyakiat", "โรจนวิชัย": "rojanawichai",
  "เกียรติสุวรรณ": "kiatisuwan", "เกตุแก้ว": "ketkaew", "นาคราช": "nakharat", "พิทักษ์ธรรม": "phithaktham", "สุรศักดิ์": "surasak",
  "เจริญสุข": "charoensuk", "พงษ์พิพัฒน์": "pongpipat", "สมบูรณ์ทรัพย์": "somboonsap", "ทรัพย์ศิริ": "sapsiri", "วงศ์เจริญ": "wongcharoen",
  "มั่นคงดี": "mankhongdee", "ประสิทธิ์โชค": "prasitchok", "ปัญญาวงศ์": "panyawong", "เลิศวิจิตร": "lertwichit", "อนันตชัย": "anantachai"
};

const NAMES_EN = [
  "Lucas Vance", "Sophia Reed", "Oliver Bennett", "Emma Hayes", "Liam Foster",
  "Ava Simmons", "Noah Campbell", "Mia Patterson", "Ethan Bryant", "Isabella Ross",
  "Mason Powell", "Charlotte Long", "James Hughes", "Amelia Price", "Benjamin Butler",
  "Harper Brooks", "Alexander Ward", "Evelyn Gray", "Daniel Murphy", "Abigail Rivera",
  "Henry Wood", "Emily Watson", "Sebastian Brooks", "Elizabeth Kelly", "Jack Sanders",
  "Ella Cooper", "Samuel Peterson", "Avery Cox", "David Howard", "Scarlett Ward"
];

const MASCOTS_LIST = [
  "StarPy",
  "FoxPy",
  "PandaPy",
  "BunnyCode",
  "OwlLog",
  "BearStack",
  "KoalaByte",
  "PixelPup",
];

async function main() {
  console.log("🚀 Starting seeding 200 learners into MySQL database...");

  // 1. Ensure admin account exists
  const salt = await bcrypt.genSalt(10);
  const adminHashed = await bcrypt.hash("admin123", salt);
  await prisma.user.upsert({
    where: { email: "admin@pystep.com" },
    update: {
      name: "admin",
      role: "admin",
      password: adminHashed,
    },
    create: {
      name: "admin",
      email: "admin@pystep.com",
      role: "admin",
      password: adminHashed,
      selectedMascot: "StarPy",
      xp: 2400,
      streak: 30,
      level: 10,
      hearts: 5,
    },
  });

  const defaultPassword = await bcrypt.hash("12345678", salt);
  const totalTarget = 200;
  let seededCount = 0;

  for (let i = 1; i <= totalTarget; i++) {
    const padIndex = i.toString().padStart(3, "0");
    const phoneNumber = `08${(10 + (i % 80)).toString().padStart(2, "0")}-${padIndex}-${(1000 + i)}`;

    let name = "";
    let email = "";

    if (i % 6 === 0) {
      const enIndex = Math.floor((i - 1) / 6) % NAMES_EN.length;
      name = NAMES_EN[enIndex];
      const [first, last] = name.toLowerCase().split(" ");
      email = `${first}.${last}${i > 30 ? i : ""}@gmail.com`;
    } else {
      const prefix = i % 2 === 0 ? "น.ส. " : "นาย ";
      const firstTh = FIRST_NAMES_TH[(i * 7) % FIRST_NAMES_TH.length];
      const lastTh = LAST_NAMES_TH[(i * 11) % LAST_NAMES_TH.length];
      name = `${prefix}${firstTh} ${lastTh}`;

      const romanFirst = THAI_TO_ROMAN[firstTh] || `user${i}`;
      const romanLast = (THAI_TO_ROMAN[lastTh] || "student").slice(0, 4);
      email = `${romanFirst}.${romanLast}${i > 50 ? i : ""}@gmail.com`;
    }

    const selectedMascot = MASCOTS_LIST[(i - 1) % MASCOTS_LIST.length];

    // Distribution of learning progress (0 - 24 steps)
    // 1-35 (17.5%): 24 steps (Certificates Unlocked!)
    // 36-80 (22.5%): 15-23 steps (Chapter 4-5 Advanced)
    // 81-140 (30%): 6-14 steps (Chapter 2-3 Intermediate)
    // 141-180 (20%): 1-5 steps (Chapter 1 Beginners)
    // 181-200 (10%): 0 steps (Newly registered)
    let completedSteps = 0;
    let level = 1;

    if (i <= 35) {
      completedSteps = 24;
      level = 8 + (i % 3);
    } else if (i <= 80) {
      completedSteps = 15 + ((i * 3) % 9); // 15 to 23
      level = 5 + (i % 3);
    } else if (i <= 140) {
      completedSteps = 6 + ((i * 2) % 9); // 6 to 14
      level = 2 + (i % 3);
    } else if (i <= 180) {
      completedSteps = 1 + (i % 5); // 1 to 5
      level = 1;
    } else {
      completedSteps = 0;
      level = 1;
    }

    const xp = completedSteps * 100 + ((i * 19) % 95);
    const streak = completedSteps === 0 ? 0 : Math.max(1, Math.min(65, Math.floor(completedSteps * 1.8) + (i % 7)));
    const hearts = completedSteps === 0 ? 5 : 3 + (i % 3);

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        phoneNumber,
        password: defaultPassword,
        role: "user",
        xp,
        level,
        streak,
        hearts,
        selectedMascot,
      },
      create: {
        name,
        email,
        phoneNumber,
        password: defaultPassword,
        role: "user",
        xp,
        level,
        streak,
        hearts,
        selectedMascot,
      },
    });

    // Populate user progress steps
    for (let stepId = 1; stepId <= completedSteps; stepId++) {
      const daysAgo = Math.max(0, completedSteps - stepId);
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
          completedAt,
        },
        create: {
          userId: user.id,
          stepId: stepId,
          xpEarned: 100,
          completedAt,
        },
      });
    }

    seededCount++;
    if (seededCount % 50 === 0) {
      console.log(`   ⏳ Seeded ${seededCount}/${totalTarget} users...`);
    }
  }

  const finalUserCount = await prisma.user.count();
  const certCount = await prisma.user.count({
    where: {
      progress: {
        some: { stepId: 24 },
      },
      role: { not: "admin" },
    },
  });

  console.log(`\n🎉 SEED COMPLETED SUCCESSFULLY!`);
  console.log(`   - Total Users in DB : ${finalUserCount} accounts`);
  console.log(`   - Eligible for Cert : ${certCount} learners (completed 24 steps)`);
  console.log(`   - Default Password  : 12345678 (for all student accounts)`);
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
