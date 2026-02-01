npm install -g openspec
mkdir skylledger
cd skylledger
openspec init
```
- Select your AI tool (Cursor/Claude Code/whatever you use)
- This creates `openspec/` folder and `agents.md`

### **Step 2: Your First Change**
Instead of coding, start with:

**Prompt to your AI:**
```
/opsx:new project-foundation

I want to build SkyLedger - a personal finance dashboard with AI receipt parsing.

Tech stack:
- Next.js 14 (App Router)
- SQLite with Prisma
- Anthropic Claude API for receipt parsing
- Tailwind + shadcn/ui

Create a change proposal for:
1. Initial project structure
2. Database schema (receipts, categories, budgets, users)
3. Basic Next.js setup with auth (next-auth)
4. Development environment configuration

Use /opsx:ff to generate all planning artifacts.
```

### **Step 3: Review the Spec**
OpenSpec will generate:
- `openspec/changes/project-foundation/design.md`
- `openspec/changes/project-foundation/tasks.md`

**Your job:** Read them like a technical reviewer. Check:
- Did it choose the right Prisma relations?
- Is the auth strategy sound?
- Are tasks ordered logically?

**Edit the files directly** if something's wrong. This is the magic—you're debugging the *plan*, not the code.

### **Step 4: Implement**
```
/opsx:apply
