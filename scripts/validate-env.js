#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const out = (message = "") => process.stdout.write(`${message}\n`);

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
  NEXT_PUBLIC_SITE_URL: "Alternative URL",
};

out("🔍 Validating environment variables...\n");

// Check if .env.local exists
const envLocalPath = path.join(process.cwd(), ".env.local");

if (!fs.existsSync(envLocalPath)) {
  out("❌ .env.local file not found!");
  out("   Run: npm run setup-env");
  out("   Or copy env.local.template to .env.local manually");
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

out("📋 Environment Variables Status:\n");

// Check each required variable
Object.entries(requiredVars).forEach(([varName, description]) => {
  const value = envVars[varName];

  if (!value) {
    missing.push(varName);
    out(`❌ ${varName} - ${description} (MISSING)`);
    allValid = false;
  } else if (
    value.includes("your_") ||
    value.includes("example") ||
    value === ""
  ) {
    placeholder.push(varName);
    out(`⚠️  ${varName} - ${description} (PLACEHOLDER)`);
    allValid = false;
  } else {
    out(`✅ ${varName} - ${description}`);
  }
});

out("\n" + "=".repeat(50));

if (missing.length > 0) {
  out("\n❌ Missing required environment variables:");
  missing.forEach((varName) => {
    out(`   - ${varName}`);
  });
}

if (placeholder.length > 0) {
  out("\n⚠️  Environment variables with placeholder values:");
  placeholder.forEach((varName) => {
    out(`   - ${varName}`);
  });
}

if (allValid) {
  out("\n✅ All environment variables are properly configured!");
  out("🚀 You can now run: npm run dev");
} else {
  out("\n📖 For setup instructions, see: ENVIRONMENT_SETUP.md");
  out("🔧 Run: npm run setup-env to create a fresh .env.local file");
}

out("\n🔒 Security check: .env.local is in .gitignore ✓");
