# 🛡️ Safe File Editing Guide for Next.js Development

## 📋 Quick Reference Commands

### 🚨 Emergency Recovery Commands
```bash
# If file gets corrupted - restore from Git
git restore src/app/page.tsx

# If multiple files corrupted - restore everything
git restore .

# Go back to specific working commit
git log --oneline                    # See commits
git reset --hard <commit-hash>       # Replace <commit-hash> with actual hash

# Nuclear option - go back to last commit
git reset --hard HEAD

# Clear Next.js cache if needed
pkill -f "next dev" && rm -rf .next node_modules/.cache
```

## 🔄 Safe Editing Process (Use Every Time)

### Method 1: Stop Server First (RECOMMENDED)
```bash
# Step 1: Stop development server
pkill -f "next dev" || echo "No server running"

# Step 2: Create safety checkpoint
git add .
git commit -m "Before making changes - all working"

# Step 3: Make your changes
# (Use file editing tools or manual edits)

# Step 4: Restart server
npm run dev

# Step 5: Test everything works
# Visit: http://localhost:3000

# Step 6: If it works, commit the changes
git add .
git commit -m "Describe what you changed"

# Step 7: If it breaks, restore immediately
git restore filename.tsx    # Restore specific file
# OR
git reset --hard HEAD       # Restore everything
```

### Method 2: Quick Git Safety Net
```bash
# Before ANY changes - create checkpoint
git add .
git commit -m "Working state - before changes"

# Make changes...
# If something breaks:
git restore .               # Undo all changes
```

## 🔍 Checking Project Status

### Check Git Status
```bash
git status                  # See what files changed
git log --oneline -5        # See recent commits
git diff                    # See what changed since last commit
```

### Check Next.js Status
```bash
# Check if server is running
ps aux | grep "next dev"

# Check for errors in code
# (Let Copilot use get_errors tool)

# Check server output
# (Check terminal where npm run dev is running)
```

## 📁 File Operations

### Safe File Editing with Copilot
1. **Always stop server first**: `pkill -f "next dev"`
2. **Tell Copilot**: "Stop the server first, then edit this file"
3. **Be specific**: "Change line X to say Y"
4. **Test immediately**: Restart server and check

### Manual File Editing
```bash
# Create backup before editing manually
cp src/app/page.tsx src/app/page.tsx.backup

# If you mess up manually
mv src/app/page.tsx.backup src/app/page.tsx
```

## 🚀 Server Management

### Start/Stop Development Server
```bash
# Start server
npm run dev

# Stop server (use one of these)
pkill -f "next dev"         # Kill by process name
Ctrl+C                      # In terminal where server runs

# Check if server is running
curl http://localhost:3000  # Should return HTML if running
```

### Build and Production
```bash
# Test production build
npm run build

# Start production server
npm run start
```

## 📊 Project Structure Reminders

```
new_workplace/
├── src/app/
│   ├── page.tsx           # Home page ← Most likely to corrupt
│   ├── game/page.tsx      # Game page
│   └── how-to-play/page.tsx # Rules page
├── src/components/
│   ├── Card.tsx           # Card component
│   └── GameTable.tsx      # Game table
├── src/lib/
│   └── cards.ts           # Card logic
└── package.json           # Dependencies
```

## ⚠️ Common Mistakes to Avoid

1. **DON'T** edit files while server is running (causes corruption)
2. **DON'T** delete working files without Git backup
3. **DON'T** make multiple changes without testing each one
4. **DON'T** ignore Git - it's your safety net
5. **DON'T** edit corrupted files - restore from Git first

## ✅ Daily Workflow

### Starting Work Session
```bash
cd /home/cadenegr/carlosproject/new_workplace
git status                  # Check current state
npm run dev                 # Start development server
```

### Making Changes
```bash
# Before changes
git add . && git commit -m "Working state"

# Stop server
pkill -f "next dev"

# Make changes (with Copilot or manually)

# Restart and test
npm run dev

# If works - commit
git add . && git commit -m "Added feature X"

# If broken - restore
git restore .
```

### Ending Work Session
```bash
# Save current work
git add .
git commit -m "End of session - describe current state"

# Stop server
pkill -f "next dev"
```

## 🆘 When Things Go Wrong

### Page Won't Load
1. Check browser console for errors
2. Check terminal running `npm run dev` for errors
3. Try: `git restore src/app/page.tsx`

### Build Fails
1. `git restore .` (undo recent changes)
2. `rm -rf .next node_modules/.cache` (clear cache)
3. `npm run dev` (restart)

### Complete Disaster Recovery
```bash
# Go back to last known working commit
git log --oneline -10       # Find working commit
git reset --hard <commit>   # Replace <commit> with hash

# Or go back to very beginning
git reset --hard ced3ab7    # "Working WIZARD game - all pages functional"
```

## 📞 Getting Help

### Ask Copilot (in this order):
1. "Stop the server first, then help me..."
2. "Check for errors in my code"
3. "Read the file first, then make the change"
4. "Use the safe editing method"

### Useful Copilot Prompts:
- "Stop server, edit file X to change Y, then restart server"
- "Check what Git commits I have"
- "Restore my file from Git"
- "What errors do I have in my project?"

---

**💡 Remember: Git is your friend! Commit working states frequently.**

**🎯 Golden Rule: Server OFF → Make Changes → Server ON → Test → Commit if Good**