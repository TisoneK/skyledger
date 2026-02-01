# SkyLedger

Your weekly financial mirror - track income, expenses, and savings across all your financial roles.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SQLite (included with Prisma)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd skyledger
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking

### Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema to database
- `npx prisma studio` - Open Prisma Studio
- `npx tsx prisma/seed.ts` - Seed database with initial data

### Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── dashboard/      # Dashboard components
│   ├── charts/         # Chart components
│   └── layout/         # Layout components
├── lib/                # Utility functions
├── stores/             # Zustand state management
└── types/              # TypeScript type definitions
```

## 🎯 Features

- **Weekly-Centric Views**: Default to current week financial snapshot
- **Role Separation**: Track Personal, Sky Tech, Chama, and Side Income separately
- **Tuesday Chama Focus**: Special reminders and progress tracking for weekly Ksh. 250 goal
- **"Am I Moving Forward?"**: Weekly assessment answering your core financial question
- **Offline-First**: Works without internet connection with sync capabilities
- **Mobile-Responsive**: Optimized for mobile devices
- **Dark Mode**: Toggle between light and dark themes

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: Zustand with persistence
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts
- **Offline**: IndexedDB, Service Workers
- **Icons**: Lucide React

## 📱 Mobile App

SkyLedger is built as a Progressive Web App (PWA) and can be installed on your mobile device:

1. Open SkyLedger in your mobile browser
2. Look for "Add to Home Screen" option
3. Install the app for native-like experience

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Database Schema

The database includes:
- **Financial Roles**: Personal, Business, Chama, Side Income
- **Categories**: Role-specific income and expense categories
- **Transactions**: Individual financial transactions
- **Chama Contributions**: Weekly savings tracking
- **Weekly Summaries**: Aggregated weekly data

## 🎨 Customization

### Adding New Categories

Edit `prisma/seed.ts` to add custom categories for each role:

```typescript
const personalCategories = [
  { name: 'Salary', type: 'INCOME' },
  { name: 'Food', type: 'EXPENSE' },
  // Add more categories...
];
```

### Role Colors

Customize role colors in `src/lib/role-colors.ts`:

```typescript
export const roleColors = {
  personal: {
    primary: '#3b82f6', // Blue
    // ... other colors
  },
  // ... other roles
};
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

---

**SkyLedger** - *Progress measured weekly becomes growth measured yearly.*
