# 🚀 Quick Command Cheat Sheet

## Most Common Commands (Copy & Paste Ready)

### Safe Edit Process
```bash
# Stop server
pkill -f "next dev"

# Create checkpoint  
git add . && git commit -m "Before changes"

# Restart server after changes
npm run dev

# Commit if working
git add . && git commit -m "Describe change"
```

### Emergency Recovery
```bash
# Restore one file
git restore src/app/page.tsx

# Restore everything
git restore .

# Clear cache and restart
pkill -f "next dev" && rm -rf .next && npm run dev
```

### Check Status
```bash
# Git status
git status
git log --oneline -5

# Server status
ps aux | grep "next dev"
curl http://localhost:3000
```

### Project Navigation
```bash
# Go to project
cd /home/cadenegr/carlosproject/new_workplace

# See structure
ls -la src/app/

# Edit important files
nano src/app/page.tsx           # Home page
nano src/app/game/page.tsx      # Game page  
nano src/components/Card.tsx    # Card component
```

---
**💡 Bookmark this file! Keep it open when coding.**