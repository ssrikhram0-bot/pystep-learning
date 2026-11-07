import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FIRST_NAMES_TH = [
  "กิตติพงษ์", "ณัฐพงษ์", "วรวุฒิ", "ธนภัทร", "ชวลิต", "ศุภกิตติ์", "ปิยวัฒน์", "อภิสิทธิ์", "ธีรภัทร์", "วรินทร",
  "พงศกร", "นราธิป", "สรวิชญ์", "จิรายุ", "อัครเดช", "ณัฐวุฒิ", "ธนาคาร", "ศุภชัย", "ปวริศ", "ชลสิทธิ์",
  "ศศิธร", "วริศรา", "กัญญาณัฐ", "พิมพ์มาดา", "ชลธิชา", "สุพัตรา", "ณัฐริกา", "ธันยพร", "นภัสสร", "กมลวรรณ",
  "ปณิตา", "อรพินท์", "ศิริกานต์", "ทิพวรรณ", "กานดา", "สิรินทร์", "มัสยา", "เบญจวรรณ", "เพ็ญนภา", "รุจิรา"
];

const LAST_NAMES_TH = [
  "สุขเกษม", "แสงสว่าง", "เจริญพร", "รัตนวงศ์", "มณีรัตน์", "ทองสุข", "คงมั่น", "วัฒนพานิช", "สุวรรณเวช", "อมรรัตน์",
  "บุญประเสริฐ", "ศรีสุข", "เดชะกุล", "สิทธิโชค", "สถิตพงษ์", "โชคอำนวย", "ทิพย์เนตร", "ประเสริฐผล", "วงษ์สุวรรณ", "ศิริชัย",
  "ตั้งตระกูล", "จิตรเกษม", "เพชรประสิทธิ์", "บุญยเกียรติ", "โรจนวิชัย", "เกียรติสุวรรณ", "เกตุแก้ว", "นาคราช", "พิทักษ์ธรรม", "สุรศักดิ์"
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

  "สุขเกษม": "sukkasem", "แสงสว่าง": "saengsawang", "เจริญพร": "charoenporn", "รัตนวงศ์": "rattanawong", "มณีรัตน์": "maneerat",
  "ทองสุข": "thongsuk", "คงมั่น": "khongman", "วัฒนพานิช": "wattanapanich", "สุวรรณเวช": "suwanwet", "อมรรัตน์": "amornrat",
  "บุญประเสริฐ": "boonprasert", "ศรีสุข": "srisuk", "เดชะกุล": "dechakun", "สิทธิโชค": "sitthichok", "สถิตพงษ์": "sathitpong",
  "โชคอำนวย": "chokamnuay", "ทิพย์เนตร": "thipphinet", "ประเสริฐผล": "prasertphon", "วงษ์สุวรรณ": "wongsuwan", "ศิริชัย": "sirichai",
  "ตั้งตระกูล": "tangtrakul", "จิตรเกษม": "jitkasem", "เพชรประสิทธิ์": "phetprasit", "บุญยเกียรติ": "boonyakiat", "โรจนวิชัย": "rojanawichai",
  "เกียรติสุวรรณ": "kiatisuwan", "เกตุแก้ว": "ketkaew", "นาคราช": "nakharat", "พิทักษ์ธรรม": "phithaktham", "สุรศักดิ์": "surasak"
};

const NAMES_EN = [
  "Lucas Vance", "Sophia Reed", "Oliver Bennett", "Emma Hayes", "Liam Foster",
  "Ava Simmons", "Noah Campbell", "Mia Patterson", "Ethan Bryant", "Isabella Ross",
  "Mason Powell", "Charlotte Long", "James Hughes", "Amelia Price", "Benjamin Butler"
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
  console.log("🚀 Starting seeding 100 learners with realistic emails matching their names...");

  // First, remove previous student001-student100 test accounts
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: "student",
      },
    },
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("12345678", salt);

  const totalUsers = 100;
  let createdCount = 0;

  for (let i = 1; i <= totalUsers; i++) {
    const padIndex = i.toString().padStart(3, "0");
    const phoneNumber = `081-100-${padIndex}`;

    // Generate realistic name and matching email
    let name = "";
    let email = "";

    if (i % 7 === 0) {
      const enName = NAMES_EN[(i / 7) % NAMES_EN.length];
      name = enName;
      const [first, last] = enName.toLowerCase().split(" ");
      email = `${first}.${last}${i > 14 ? i : ""}@gmail.com`;
    } else {
      const prefix = i % 2 === 0 ? "น.ส. " : "นาย ";
      const firstTh = FIRST_NAMES_TH[(i * 3) % FIRST_NAMES_TH.length];
      const lastTh = LAST_NAMES_TH[(i * 5) % LAST_NAMES_TH.length];
      name = `${prefix}${firstTh} ${lastTh}`;

      const romanFirst = THAI_TO_ROMAN[firstTh] || "user";
      const romanLast = THAI_TO_ROMAN[lastTh] || "learn";
      email = `${romanFirst}.${romanLast.slice(0, 4)}${i > 40 ? i : ""}@gmail.com`;
    }

    // Varied Mascot
    const selectedMascot = MASCOTS_LIST[(i - 1) % MASCOTS_LIST.length];

    // Varied Level and completed steps (0 to 24 steps)
    // 1-15: completed 24 steps (Certificates Achievers!)
    // 16-35: completed 14-23 steps (Advanced/Upper)
    // 36-65: completed 6-13 steps (Intermediate)
    // 66-90: completed 1-5 steps (Beginner)
    // 91-100: completed 0 steps (Just enrolled/Not started)
    let completedSteps = 0;
    let level = 1;

    if (i <= 15) {
      completedSteps = 24; // Finished!
      level = 7 + (i % 4);
    } else if (i <= 35) {
      completedSteps = 14 + ((i * 3) % 10); // 14 to 23
      level = 4 + (i % 3);
    } else if (i <= 65) {
      completedSteps = 6 + ((i * 2) % 8); // 6 to 13
      level = 2 + (i % 2);
    } else if (i <= 90) {
      completedSteps = 1 + (i % 5); // 1 to 5
      level = 1;
    } else {
      completedSteps = 0; // Not started yet
      level = 1;
    }

    const xp = completedSteps * 100 + ((i * 17) % 80);
    const streak = completedSteps === 0 ? 0 : Math.max(1, Math.min(60, Math.floor(completedSteps * 1.5) + (i % 5)));
    const hearts = completedSteps === 0 ? 5 : 3 + (i % 3);

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        phoneNumber,
        password: hashedPassword,
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
        password: hashedPassword,
        role: "user",
        xp,
        level,
        streak,
        hearts,
        selectedMascot,
      },
    });

    // Populate user completed steps
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

    createdCount++;
  }

  console.log(`✅ Successfully seeded ${createdCount} accounts with matching emails and varied progress!`);
  console.log(`   Sample email: kittipong.sukk@gmail.com, nattapong.saen@gmail.com, etc.`);
  console.log(`   Password for all: 12345678`);
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
