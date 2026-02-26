import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ───────────────────────────────────────────────────
  const adminHashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: adminHashed, role: "ADMIN" },
    create: {
      username: "admin",
      password: adminHashed,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user seeded!");

  // ── Client user ──────────────────────────────────────────────────
  const clientHashed = await bcrypt.hash("client123", 10);
  await prisma.user.upsert({
    where: { username: "client" },
    update: { password: clientHashed, role: "CLIENT" },
    create: {
      username: "client",
      password: clientHashed,
      role: "CLIENT",
    },
  });
  console.log("✅ Client user seeded!");
}

main().finally(() => prisma.$disconnect());