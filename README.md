# Personal Growth Next.js Firebase Project

This is a [Next.js](https://nextjs.org) project with Firebase integration, Stripe payments, and OpenAI-powered test analysis.

## 🚀 Quick Start

### 1. Environment Setup

First, set up your environment variables:

```bash
# Set up environment variables
npm run setup-env

# Validate your environment configuration
npm run validate-env
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📋 Environment Variables

This project requires several environment variables to function properly:

- **Firebase Configuration**: For authentication, database, and storage
- **Stripe Keys**: For payment processing
- **OpenAI API Key**: For AI-powered test analysis
- **Site URLs**: For proper routing and API calls

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed setup instructions.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup-env` - Set up environment variables
- `npm run validate-env` - Validate environment configuration

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
