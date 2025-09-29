# �� WIZARD Card Game - Copilot Instructions

## 🎯 Project Overview
**WIZARD Card Game Website** - A complete web-based implementation of the classic WIZARD card game using modern industry-standard technologies.

**Live Website**: https://wizard-card-game.vercel.app/
**Repository**: https://github.com/cadenegr/wizard-card-game
**Status**: ✅ DEPLOYED AND FUNCTIONAL

## 🏗️ Technical Stack
- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Version Control**: Git with comprehensive safety practices

## 📁 Project Structure
```
wizard-card-game/
├── src/app/
│   ├── page.tsx              # Home page with magical theme
│   ├── game/page.tsx         # Game table with card dealing
│   └── how-to-play/page.tsx  # Complete game rules
├── src/components/
│   ├── Card.tsx              # Visual card component
│   └── GameTable.tsx         # Stone table with 6 player mantles
├── src/lib/
│   └── cards.ts              # Card logic, deck creation, shuffling
├── SAFE_EDITING_GUIDE.md     # File editing safety procedures
├── COMMANDS.md               # Quick command reference
└── DEPLOYMENT_GUIDE.md       # Deployment instructions
```

## ✅ Completed Features
- [x] **Complete WIZARD card deck**: 60 cards (52 numbered + 4 wizards + 4 jesters)
- [x] **Stone game table**: Realistic appearance with 6 dining-style player mantles
- [x] **Card dealing system**: Shuffle, deal, reset functionality with statistics
- [x] **Multi-page navigation**: Home, game, and rules pages
- [x] **Comprehensive rules page**: Official WIZARD game documentation
- [x] **Responsive design**: Works on desktop and mobile
- [x] **Production deployment**: Live on Vercel with auto-deploy
- [x] **Git safety practices**: Version control with recovery procedures

## 🚧 Current Status & Next Phase Planning

### Phase 1: Foundation ✅ COMPLETE
- Basic website structure
- Card game mechanics
- Deployment pipeline

### Phase 2: User System (PLANNED)
- **Authentication**: NextAuth.js + Supabase
- **User accounts**: Sign up, login, profiles
- **Game history**: Save completed games, statistics
- **Database**: Cloud PostgreSQL for user data

### Phase 3: Social Features (FUTURE)
- **Multiplayer**: Real-time game rooms
- **Leaderboards**: Global and friend rankings
- **Social interactions**: Friend system, challenges

## 🛡️ Critical Safety Practices

### File Editing Workflow
```bash
# ALWAYS use this sequence:
pkill -f "next dev"                    # Stop server first
git add . && git commit -m "checkpoint" # Create safety checkpoint
# Make changes using proper tools
npm run dev                            # Test locally
git add . && git commit -m "description" && git push origin main # Deploy live
```

### Emergency Recovery
```bash
git restore filename.tsx               # Restore single file
git restore .                          # Restore all changes
git reset --hard HEAD                  # Nuclear option
```

## 🎮 Game Mechanics Implementation
- **Card Types**: Numbered (1-13), Wizards (always high), Jesters (always low)
- **Suits**: Blue, Red, Yellow, Green with distinct visual styling
- **Dealing**: Interactive card dealing with remaining deck counts
- **Visual Design**: Magical theme with gradients and professional styling

## 🌐 Deployment Pipeline
- **GitHub**: Source code repository with auto-sync
- **Vercel**: Production hosting with automatic deployments
- **Domain**: wizard-card-game.vercel.app (custom domain ready)
- **SSL**: Automatic HTTPS with global CDN

## 📋 Development Guidelines
1. **Always stop server before file edits** to prevent corruption
2. **Use Git checkpoints** before major changes
3. **Test locally first** before pushing to production
4. **Follow Next.js best practices**: Use Link for navigation, proper imports
5. **Reference safety guides** in project root for procedures
6. **NEVER use hardcoded positioning** - Use CSS Grid + Flexbox + configuration objects
7. **Avoid "magic numbers"** - All positioning values must be in config objects
8. **Single Source of Truth** - One place for each layout definition
9. **Simple over complex** - Don't over-engineer when simple solutions work
10. **Clean Architecture** - Configuration-driven, modular, maintainable code

## 🏗️ Architecture Standards (LEARNED IN SESSION)
- **Layout System**: CSS Grid with semantic areas (`bot1`, `bot2`, `bot3`, `human`)
- **Component Pattern**: Simple grid-based positioning, no React Portals unless necessary
- **Configuration-Driven**: All layout rules in config objects, zero hardcoded values
- **File Organization**: Keep components simple, avoid duplication (Clean*, Professional* versions)
- **Anti-Patterns**: No absolute positioning, no magic numbers, no component duplication
- **Code Quality**: Regular refactoring, remove technical debt, maintain clean codebase

## 💡 Session Learnings Applied
- **Fixed**: Positioning conflicts caused by hardcoded absolute positioning
- **Simplified**: Removed overcomplicated portal architecture for simple CSS Grid
- **Cleaned**: Eliminated duplicate components (Clean*, Professional* versions)
- **Architecture**: Built configuration-driven layout system with semantic naming
- **Lesson**: Sometimes "enterprise-grade" means "simple and maintainable", not "complex"

## 🎯 Future Development Priorities
1. **User Authentication**: Implement login/signup system
2. **Database Integration**: Store user data and game history
3. **Real-time Features**: WebSocket integration for multiplayer
4. **Performance Optimization**: Advanced Next.js features
5. **SEO Enhancement**: Meta tags, sitemap, analytics

## 💡 Technical Notes for Copilot
- **File Corruption History**: Previous issues with replace_string_in_file tool resolved through proper server shutdown procedures
- **Build Requirements**: ESLint configured to ignore apostrophe escaping for deployment
- **Component Architecture**: Reusable Card and GameTable components with TypeScript interfaces
- **State Management**: React hooks for game state, no external state library needed yet

---
**Last Updated**: Session ending - Project ready for next development phase
