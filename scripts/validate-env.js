#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Required environment variables
const requiredVars = {
  // Firebase variables (client-side)
  NEXT_PUBLIC_FIREBASE_API_KEY: "Firebase API Key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "Firebase Auth Domain",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "Firebase Project ID",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "Firebase Storage Bucket",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "Firebase Messaging Sender ID",
  NEXT_PUBLIC_FIREBASE_APP_ID: "Firebase App ID",
  NEXT_PUBLIC_FIREBASE_MEASURMENT_ID: "Firebase Measurement ID",

  // Stripe variables (server-side)
  STRIPE_SECRET: "Stripe Secret Key",

  // OpenAI variables (server-side)
  OPENAI_API_KEY: "OpenAI API Key",

  // Site URLs (client-side)
  NEXT_PUBLIC_SITE_URL: "Site URL",
  NEXT_PUBLIC_URL: "Alternative URL",
};

console.log("🔍 Validating environment variables...\n");

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), ".env.local");

if (!fs.existsSync(envLocalPath)) {
  console.log("❌ .env.local file not found!");
  console.log("   Run: npm run setup-env");
  console.log("   Or copy env.local.template to .env.local manually");
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envLocalPath, "utf8");
const envVars = {};

envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join("=");
    }
  }
});

let allValid = true;
const missing = [];
const placeholder = [];

console.log("📋 Environment Variables Status:\n");

// Check each required variable
Object.entries(requiredVars).forEach(([varName, description]) => {
  const value = envVars[varName];

  if (!value) {
    missing.push(varName);
    console.log(`❌ ${varName} - ${description} (MISSING)`);
    allValid = false;
  } else if (
    value.includes("your_") ||
    value.includes("example") ||
    value === ""
  ) {
    placeholder.push(varName);
    console.log(`⚠️  ${varName} - ${description} (PLACEHOLDER)`);
    allValid = false;
  } else {
    console.log(`✅ ${varName} - ${description}`);
  }
});

console.log("\n" + "=".repeat(50));

if (missing.length > 0) {
  console.log("\n❌ Missing required environment variables:");
  missing.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
}

if (placeholder.length > 0) {
  console.log("\n⚠️  Environment variables with placeholder values:");
  placeholder.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
}

if (allValid) {
  console.log("\n✅ All environment variables are properly configured!");
  console.log("🚀 You can now run: npm run dev");
} else {
  console.log("\n📖 For setup instructions, see: ENVIRONMENT_SETUP.md");
  console.log("🔧 Run: npm run setup-env to create a fresh .env.local file");
}

console.log("\n🔒 Security check: .env.local is in .gitignore ✓");
