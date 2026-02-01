import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create financial roles
  const personalRole = await prisma.financialRole.upsert({
    where: { name: 'personal' },
    update: {},
    create: {
      name: 'personal',
      displayName: 'Personal',
      color: '#3b82f6',
    },
  });

  const businessRole = await prisma.financialRole.upsert({
    where: { name: 'business' },
    update: {},
    create: {
      name: 'business',
      displayName: 'Sky Tech Solutions',
      color: '#22c55e',
    },
  });

  const chamaRole = await prisma.financialRole.upsert({
    where: { name: 'chama' },
    update: {},
    create: {
      name: 'chama',
      displayName: 'Chama',
      color: '#f59e0b',
    },
  });

  const sideIncomeRole = await prisma.financialRole.upsert({
    where: { name: 'sideincome' },
    update: {},
    create: {
      name: 'sideincome',
      displayName: 'Side Income',
      color: '#a855f7',
    },
  });

  // Create categories for Personal role
  const personalCategories = [
    { name: 'Food & Groceries', roleId: personalRole.id, type: 'EXPENSE' },
    { name: 'Transportation', roleId: personalRole.id, type: 'EXPENSE' },
    { name: 'Utilities', roleId: personalRole.id, type: 'EXPENSE' },
    { name: 'Rent', roleId: personalRole.id, type: 'EXPENSE' },
    { name: 'Healthcare', roleId: personalRole.id, type: 'EXPENSE' },
    { name: 'Entertainment', roleId: personalRole.id, type: 'EXPENSE' },
    { name: 'Salary', roleId: personalRole.id, type: 'INCOME' },
    { name: 'Freelance', roleId: personalRole.id, type: 'INCOME' },
    { name: 'Investments', roleId: personalRole.id, type: 'INCOME' },
  ];

  for (const category of personalCategories) {
    await prisma.category.upsert({
      where: { 
        roleId_name: {
          roleId: category.roleId,
          name: category.name,
        }
      },
      update: {},
      create: category,
    });
  }

  // Create categories for Business role
  const businessCategories = [
    { name: 'Client Payments', roleId: businessRole.id, type: 'INCOME' },
    { name: 'Project Revenue', roleId: businessRole.id, type: 'INCOME' },
    { name: 'Software Tools', roleId: businessRole.id, type: 'EXPENSE' },
    { name: 'Internet & Hosting', roleId: businessRole.id, type: 'EXPENSE' },
    { name: 'Marketing', roleId: businessRole.id, type: 'EXPENSE' },
    { name: 'Office Supplies', roleId: businessRole.id, type: 'EXPENSE' },
    { name: 'Business Development', roleId: businessRole.id, type: 'EXPENSE' },
  ];

  for (const category of businessCategories) {
    await prisma.category.upsert({
      where: { 
        roleId_name: {
          roleId: category.roleId,
          name: category.name,
        }
      },
      update: {},
      create: category,
    });
  }

  // Create categories for Chama role
  const chamaCategories = [
    { name: 'Weekly Contribution', roleId: chamaRole.id, type: 'EXPENSE' },
    { name: 'Fines', roleId: chamaRole.id, type: 'EXPENSE' },
    { name: 'Dividends', roleId: chamaRole.id, type: 'INCOME' },
  ];

  for (const category of chamaCategories) {
    await prisma.category.upsert({
      where: { 
        roleId_name: {
          roleId: category.roleId,
          name: category.name,
        }
      },
      update: {},
      create: category,
    });
  }

  // Create categories for Side Income role
  const sideIncomeCategories = [
    { name: 'Cyber Shop', roleId: sideIncomeRole.id, type: 'INCOME' },
    { name: 'Consulting', roleId: sideIncomeRole.id, type: 'INCOME' },
    { name: 'Gig Work', roleId: sideIncomeRole.id, type: 'INCOME' },
    { name: 'Side Expenses', roleId: sideIncomeRole.id, type: 'EXPENSE' },
  ];

  for (const category of sideIncomeCategories) {
    await prisma.category.upsert({
      where: { 
        roleId_name: {
          roleId: category.roleId,
          name: category.name,
        }
      },
      update: {},
      create: category,
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
