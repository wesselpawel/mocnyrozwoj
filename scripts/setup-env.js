#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const out = (message = "") => process.stdout.write(`${message}\n`);
const err = (message = "") => process.stderr.write(`${message}\n`);

out(
  "🚀 Setting up environment variables for Personal Growth Next.js Firebase project...\n"
);

// Check if .env.local already exists
const envLocalPath = path.join(process.cwd(), ".env.local");
const envTemplatePath = path.join(process.cwd(), "env.local.template");

if (fs.existsSync(envLocalPath)) {
  out("⚠️  .env.local already exists!");
  out(
    "   If you want to start fresh, delete .env.local and run this script again.\n"
  );
} else {
  // Check if env.local.template exists
  if (!fs.existsSync(envTemplatePath)) {
    err("❌ env.local.template file not found!");
    err(
      "   Please make sure the env.local.template file exists in the project root.\n"
    );
    process.exit(1);
  }

  try {
    // Copy env.local.template to .env.local
    fs.copyFileSync(envTemplatePath, envLocalPath);
    out("✅ Successfully created .env.local from env.local.template");
    out("📝 Please edit .env.local with your actual values\n");
  } catch (error) {
    err(`❌ Error creating .env.local: ${error.message}`);
    process.exit(1);
  }
}

out("📋 Next steps:");
out(
  "   1. Edit .env.local with your actual API keys and configuration"
);
out(
  "   2. Get Firebase config from: https://console.firebase.google.com/"
);
out("   3. Get Stripe keys from: https://dashboard.stripe.com/");
out("   4. Get OpenAI key from: https://platform.openai.com/");
out("   5. Update the site URLs to match your domain");
out("\n📖 For detailed instructions, see: ENVIRONMENT_SETUP.md");
out(
  "\n🔒 Remember: .env.local is already in .gitignore and will not be committed to version control"
);
