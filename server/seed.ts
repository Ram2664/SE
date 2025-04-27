import { db } from "./db";
import { users } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  console.log("Seeding admin user...");

  // Check if admin already exists
  const adminExists = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, "admin@edusync.com"),
  });

  if (adminExists) {
    console.log("Admin user already exists");
    return;
  }

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  
  await db.insert(users).values({
    email: "admin@edusync.com",
    password: hashedPassword,
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    status: "approved",
    createdAt: new Date(),
  });

  console.log("Admin user created successfully");
  console.log("Email: admin@edusync.com");
  console.log("Password: admin123");
}

main()
  .catch((e) => {
    console.error("Error seeding admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seed completed");
    process.exit(0);
  });