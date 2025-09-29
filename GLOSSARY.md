# 📚 Web Development Glossary - WIZARD Card Game Project

## 🎯 Purpose
This glossary contains all the technical terms we use in our project. Keep this handy for better communication and understanding!

---

## 🌐 **DEPLOYMENT & HOSTING**

**Deployment** 📤
- **What it means**: Uploading your website to the internet so others can access it
- **Example**: "Let's deploy our WIZARD game to Vercel"
- **Not deployment**: Working on your computer (that's local development)

**Vercel** 🚀
- **What it is**: A cloud platform that hosts websites
- **What it does**: Takes your code and makes it available on the internet
- **Example**: Our site https://wizard-card-game.vercel.app/ is hosted on Vercel

**Domain** 🌍
- **What it is**: The web address people type to visit your site
- **Examples**: `google.com`, `wizard-card-game.vercel.app`
- **Custom domain**: Your own address like `carloswizard.com` (costs money)

**SSL/HTTPS** 🔒
- **What it is**: Security that encrypts data between user and website
- **How to spot it**: Website URL starts with `https://` (not `http://`)
- **Why important**: Protects user data, required for professional sites

**CDN (Content Delivery Network)** ⚡
- **What it does**: Serves your website from locations close to users
- **Result**: Faster loading times worldwide
- **Example**: Vercel automatically provides CDN

---

## 💻 **DEVELOPMENT TERMS**

**Local Development** 🏠
- **What it means**: Building/testing your website on your computer
- **Command**: `npm run dev` (starts local server)
- **URL**: `http://localhost:3000` (only you can see it)

**Production** 🏭
- **What it means**: The live version of your website on the internet
- **Opposite of**: Development/testing version
- **Example**: Our production site is on Vercel

**Build** 🔨
- **What it means**: Converting your code into optimized files for the internet
- **Command**: `npm run build`
- **Result**: Creates fast, compressed files ready for deployment

**Hot Reload** 🔥
- **What it does**: Automatically refreshes your webpage when you save code changes
- **When it happens**: During local development (`npm run dev`)
- **Benefit**: See changes instantly without manual refresh

**Cache** 💾
- **What it is**: Stored copies of files for faster loading
- **Problem**: Sometimes shows old versions after changes
- **Solution**: Clear cache or hard refresh browser

---

## 🏗️ **PROJECT STRUCTURE**

**Framework** 🖼️
- **What it is**: Pre-built foundation for building websites
- **Our choice**: Next.js (React-based framework)
- **Benefit**: Provides structure, tools, and best practices

**Component** 🧩
- **What it is**: Reusable piece of code/UI
- **Examples**: Our `Card.tsx`, `GameTable.tsx`
- **Benefit**: Write once, use many times

**Library** 📖
- **What it is**: Collection of pre-written code you can use
- **Examples**: React (UI library), Tailwind (CSS library)
- **Benefit**: Don't reinvent the wheel

**Package** 📦
- **What it is**: Code created by other developers that you can install
- **File**: `package.json` lists all packages your project uses
- **Command**: `npm install` downloads packages

**Dependencies** 🔗
- **What they are**: Other people's code that your project needs to work
- **Example**: React, Next.js, TypeScript are our dependencies
- **Management**: npm handles downloading and updating them


## 🗄️ **VERSION CONTROL (GIT)**

**Git** 📝
- **What it is**: System that tracks changes to your code over time
- **Benefit**: Never lose work, can go back to any previous version
- **Like**: "Save game" for your code

**Repository (Repo)** 📁
- **What it is**: Folder containing your project + its entire history
- **Location**: Can be local (your computer) and remote (GitHub)
- **Our repo**: https://github.com/cadenegr/wizard-card-game

**Commit** 💾
- **What it means**: Save a snapshot of your current work
- **Command**: `git commit -m "description"`
- **Like**: Creating a save point in a video game

**Push** ⬆️
- **What it does**: Upload your local changes to GitHub
- **Command**: `git push origin main`
- **Result**: Your code is backed up online + triggers deployment

**Branch** 🌿
- **What it is**: Separate line of development
- **Main branch**: `main` (the official version)
- **Feature branches**: For experimenting without breaking main code

---

## 🎨 **FRONTEND TERMS**

**Frontend** 👀
- **What it is**: The part of website users see and interact with
- **Technologies**: HTML, CSS, JavaScript, React
- **Our frontend**: The game table, cards, buttons users click

**UI (User Interface)** 🎛️
- **What it is**: Visual elements users interact with
- **Examples**: Buttons, cards, menus, forms
- **Our UI**: Game table, card dealing interface

**UX (User Experience)** 🎯
- **What it is**: How easy/pleasant it is to use your website
- **Good UX**: Intuitive, fast, enjoyable
- **Our focus**: Making card game easy and fun to play

**Responsive Design** 📱💻
- **What it means**: Website looks good on all device sizes
- **Technologies**: CSS media queries, Tailwind CSS
- **Result**: Works on phone, tablet, desktop

**CSS** 🎨
- **What it is**: Language for styling websites (colors, layout, animations)
- **Our approach**: Tailwind CSS (utility classes)
- **Example**: `bg-purple-700` makes purple background

---

## ⚙️ **BACKEND TERMS**

**Backend** ⚙️
- **What it is**: Server-side code that handles data, users, databases
- **Not visible**: Users don't see it directly
- **Future addition**: We'll add this for user accounts

**API (Application Programming Interface)** 🔌
- **What it is**: Way for different parts of software to communicate
- **Example**: Frontend asks backend for user data
- **Next.js**: Can create APIs in the same project

**Database** 🗄️
- **What it is**: Organized storage for data (users, games, scores)
- **Types**: PostgreSQL, MySQL, MongoDB
- **Our future plan**: Supabase (PostgreSQL)

**Authentication** 🔐
- **What it is**: System for user login/signup
- **Includes**: Passwords, email verification, social login
- **Future feature**: Users can create accounts

---

## 🔧 **DEVELOPMENT TOOLS**

**IDE (Integrated Development Environment)** 💻
- **What it is**: Software for writing code
- **Our choice**: VS Code
- **Features**: Syntax highlighting, debugging, extensions

**Terminal/Command Line** ⌨️
- **What it is**: Text-based interface for running commands
- **Examples**: `npm run dev`, `git commit`, `ls`
- **Power**: Can do almost anything with text commands

**Package Manager** 📦
- **What it is**: Tool for installing and managing code libraries
- **Our choice**: npm (comes with Node.js)
- **Commands**: `npm install`, `npm run dev`, `npm run build`

**Linter** 🔍
- **What it is**: Tool that checks your code for errors/style issues
- **Our choice**: ESLint
- **Benefit**: Catches problems before deployment

---

## 🚀 **PERFORMANCE & OPTIMIZATION**

**SEO (Search Engine Optimization)** 🔍
- **What it is**: Making your website easier for Google to find
- **Techniques**: Good titles, descriptions, fast loading
- **Benefit**: More people discover your website

**Bundle** 📦
- **What it is**: All your code files combined into optimized packages
- **Process**: Build process creates bundles
- **Result**: Faster loading websites

**Minification** 🗜️
- **What it does**: Removes unnecessary characters from code
- **Example**: Spaces, comments, long variable names
- **Result**: Smaller file sizes, faster loading

---

## 🎮 **GAME-SPECIFIC TERMS**

**State** 📊
- **What it is**: Current condition of your game (cards dealt, scores, etc.)
- **Management**: React hooks (`useState`) track state changes
- **Example**: How many cards are left in deck

**Props** 📨
- **What they are**: Data passed from parent component to child
- **Example**: Passing card data to Card component
- **Like**: Function parameters but for components

**Hook** 🪝
- **What it is**: React feature for managing component behavior
- **Examples**: `useState` (data), `useEffect` (side effects)
- **Our usage**: `useState` for deck, dealt cards, game state

---

## 📱 **MOBILE & RESPONSIVE**

**Viewport** 👁️
- **What it is**: Visible area of webpage on user's device
- **Mobile**: Smaller viewport than desktop
- **Responsive**: Adapts to different viewport sizes

**Breakpoints** 📏
- **What they are**: Screen sizes where design changes
- **Tailwind**: `sm:`, `md:`, `lg:`, `xl:` prefixes
- **Example**: `md:text-lg` (larger text on medium+ screens)

---

## 🏗️ **ARCHITECTURE & CODE QUALITY**

**Magic Numbers** 🔢
- **What it means**: Hardcoded values like `absolute top-4 left-8` scattered in code
- **Problem**: Creates "spaghetti code" - messy, unpredictable, hard to maintain
- **Solution**: Use configuration objects and variables instead
- **Example**: Replace `top-8` with `config.spacing.medium`

**Spaghetti Code** 🍝
- **What it is**: Messy code that's tangled and hard to follow
- **Caused by**: Magic numbers, no organization, hardcoded values
- **Result**: Bug-prone, unmaintainable codebase
- **Fix**: Refactor to clean architecture

**Clean Architecture** 🏛️
- **What it is**: Organized code structure with clear separation of concerns
- **Principles**: Configuration-driven, no hardcoded values, single source of truth
- **Result**: Maintainable, scalable, professional codebase
- **Our approach**: CSS Grid + configuration objects

**Single Source of Truth** 📍
- **What it means**: One place where each piece of information is defined
- **Example**: All layout rules in `LAYOUT_CONFIG` object
- **Benefit**: Change once, updates everywhere automatically
- **Alternative**: Copy-paste values everywhere (bad practice)

**Configuration-Driven Architecture** ⚙️
- **What it is**: Using config objects instead of hardcoded values
- **Example**: `WIZARD_TABLE_CONFIG` defines all positioning
- **Benefit**: Easy to modify, maintain, and scale
- **Enterprise standard**: How professional applications are built

**Technical Debt** 💳
- **What it is**: Shortcuts and quick fixes that make code harder to maintain
- **Examples**: Hardcoded positioning, duplicate code, magic numbers
- **Cost**: Slows down future development, increases bugs
- **Solution**: Regular refactoring to clean architecture

**Code Archaeology** 🗿
- **What it is**: Investigating existing code to understand how it works
- **Tools**: grep searches, file exploration, debugging
- **Purpose**: Find hidden hardcoded values that override clean configs
- **Our discovery**: Found absolute positioning overriding grid layout

**Immutable Configuration** 🔒
- **What it means**: Configuration objects that don't change during runtime
- **Purpose**: Predictable, reliable layout system
- **Implementation**: Const objects with all layout rules defined upfront
- **Benefit**: No surprises, consistent behavior

---

## 🎨 **MODERN CSS LAYOUT**

**CSS Grid** 📊
- **What it is**: Modern 2D layout system for web pages
- **Best for**: Table-like layouts, complex positioning
- **Our use**: 3x3 grid for game table with coordinate positioning
- **Implementation**: `gridTemplateRows: '80px 1fr 80px'`, `gridTemplateColumns: '1fr 2fr 1fr'`
- **Advantage**: No positioning conflicts, responsive by default

**Coordinate Positioning** 📍
- **What it is**: Using grid coordinates to place elements precisely
- **Format**: `'1/1/2/2'` means row 1-2, column 1-2
- **Example**: `gridArea: '1 / 2 / 2 / 3'` places element in top-center
- **Benefit**: Precise control, visual clarity of positioning

**Mirror Symmetry** 🪞
- **What it is**: Layout where bottom elements mirror top elements vertically
- **Implementation**: `isBottomSeat = position >= 4` with `flex-col-reverse`
- **Visual result**: Top seats descend (Name → Cards), bottom seats ascend (Cards → Name)
- **Key insight**: Not identical layout, but flipped/mirrored layout
- **Perfect for**: Game tables where players face each other

**Fixed Dimensions** 📐
- **What it means**: Elements have consistent size regardless of container
- **Example**: All mantles are 120x70px even if grid areas vary
- **Problem solved**: Center seats no longer wider than side seats
- **Implementation**: `style={{ width: '120px', height: '70px' }}`
- **Benefit**: Uniform appearance, professional design

**Perfect Centering** ⚡
- **What it is**: Element precisely centered in container
- **Implementation**: `absolute inset-0 flex items-center justify-center`
- **Result**: Equal margins/padding on all sides
- **Replaced**: Manual margins that caused asymmetry
- **Visual outcome**: Perfectly balanced dark edges around table surface

**Flexbox** 📦
- **What it is**: Modern 1D layout system for arranging items
- **Best for**: Aligning items within containers
- **Our use**: Card positioning within grid areas
- **Advantage**: Automatic spacing, center alignment

**Grid Template Areas** 🗺️
- **What it is**: Semantic naming for grid sections
- **Example**: `"bot1 bot2 bot3"` defines top row
- **Benefit**: Code is self-documenting and easy to understand
- **Alternative**: Numeric grid positions (harder to read)

**Semantic Layout** 📝
- **What it means**: Using meaningful names instead of positions
- **Example**: `gridArea: 'human'` instead of `position: absolute`
- **Benefit**: Code explains itself, easier to maintain
- **Professional standard**: Industry best practice

**Layout Zones** 🎯
- **What it is**: Named areas where content is rendered
- **Example**: 'bot1', 'center', 'human' zones in our grid
- **Purpose**: Predictable content placement without conflicts
- **Implementation**: CSS Grid template areas

---

## ⚛️ **REACT PATTERNS**

**React Portals** 🌀
- **What it is**: Render components outside their parent tree
- **Use case**: Render content into specific DOM locations
- **Our attempt**: Tried for precise component positioning
- **Lesson learned**: Sometimes simpler approaches work better

**Component Isolation** 🏝️
- **What it means**: Components work independently without side effects
- **Benefit**: Reusable, testable, maintainable code
- **Implementation**: Self-contained components with clear interfaces
- **Our approach**: Each player position is isolated

**Props Interface** 🔌
- **What it is**: TypeScript definitions for component inputs
- **Example**: `PlayerPositionProps` defines what data component needs
- **Benefit**: Type safety, clear documentation, IDE support
- **Professional standard**: Always define prop types

---

## 🔧 **LAYOUT TROUBLESHOOTING**

**Grid Area Size Independence** 🎯
- **Problem**: Component size varies based on grid area size
- **Solution**: Fixed dimensions independent of container
- **Example**: Mantles same size whether in narrow or wide grid areas
- **Implementation**: Style object with fixed width/height

**Visual Debugging** 🔍
- **Technique**: Add colored borders to see layout structure
- **Example**: `border: '2px solid red'` to visualize grid areas
- **Benefit**: Immediately see layout conflicts and spacing issues
- **Temporary**: Remove debug styles before production

**Layout Conflicts** ⚔️
- **What happens**: Multiple positioning systems fighting each other
- **Common cause**: Mixing absolute positioning with CSS Grid
- **Solution**: Choose one layout system and stick to it
- **Our lesson**: CSS Grid + Flexbox works, avoid absolute positioning

---

## 🔧 **DEVELOPMENT PRACTICES**

**Refactoring** 🔄
- **What it means**: Improving code structure without changing functionality
- **Example**: Converting absolute positioning to CSS Grid
- **When to do**: When code becomes hard to maintain
- **Our session**: Multiple refactoring iterations to find best approach

**Code Review Process** 👥
- **What it is**: Systematic examination of code for quality
- **Purpose**: Catch inconsistent patterns, improve architecture
- **What we did**: Identified hardcoded positioning conflicts
- **Best practice**: Regular code quality assessments

**Linting Rules** 📏
- **What it is**: Automated code quality checks
- **Purpose**: Prevent hardcoded positioning, enforce standards
- **Our context**: ESLint catching code style issues
- **Benefit**: Consistent code quality across team

**Architecture Decision Records** 📋
- **What it is**: Documentation of why we chose specific approaches
- **Example**: "Why we use CSS Grid instead of absolute positioning"
- **Purpose**: Remember reasoning for future developers
- **Our lesson**: Document the journey from hardcoded to clean architecture

**Style Guides** 📖
- **What it is**: Rules for consistent code formatting and patterns
- **Purpose**: Enforce consistent layout methods across project
- **Example**: "Always use grid areas, never absolute positioning"
- **Implementation**: Team agreements on coding standards

---

## 🎯 **ENTERPRISE TERMINOLOGY**

**Enterprise-Grade** 🏢
- **What it means**: Professional quality suitable for business applications
- **Characteristics**: Scalable, maintainable, configurable, documented
- **Our achievement**: Converted hobby code to professional standards
- **Requirements**: Clean architecture, no magic numbers, type safety

**Scalable Architecture** 📈
- **What it is**: Code structure that grows easily with new features
- **Example**: Easy to add more players or modify layout
- **Implementation**: Configuration-driven, modular design
- **Opposite**: Hardcoded values that require manual updates everywhere

**Framework** 🏗️
- **What it is**: Structured foundation for building applications
- **Our creation**: Layout framework using CSS Grid + configuration objects
- **Benefit**: Consistent patterns, reusable components, maintainable code
- **Professional approach**: Build frameworks, not one-off solutions

---

## 🚫 **ANTI-PATTERNS (THINGS TO AVOID)**

**Hardcoded Positioning** 🚫
- **What it is**: Using fixed pixel values like `absolute top-8 left-16`
- **Problem**: Breaks on different screen sizes, conflicts with other elements
- **Solution**: Use CSS Grid, Flexbox, and configuration objects
- **Our lesson**: Caused positioning conflicts that overrode clean configs

**Absolute Positioning Overuse** 🚫
- **Problem**: Elements overlap, responsive design breaks, hard to maintain
- **When acceptable**: Modals, tooltips, overlays (sparingly)
- **Better approach**: CSS Grid for layout, Flexbox for alignment
- **Our experience**: Caused "the human mantle not correctly placed" issue

**Component Duplication** 🚫
- **Problem**: Multiple versions of same component (PlayerPosition, CleanPlayerPosition)
- **Result**: Confusion, maintenance burden, inconsistent behavior
- **Solution**: Single, well-designed component that handles all cases
- **Our cleanup**: Removed Clean*, Professional* duplicate components

**Portal Overengineering** 🚫
- **Problem**: Using complex React Portals when simple solutions work
- **Result**: Overcomplicated architecture, harder to debug
- **Lesson**: Sometimes simple CSS Grid is better than "enterprise" patterns
- **Our simplification**: Removed portal complexity, used direct grid placement

---

## 💡 **SESSION LEARNINGS**

**Configuration vs Hardcoded Values** 📊
- **Professional approach**: Define all layout rules in config objects
- **Amateur mistake**: Scatter positioning values throughout code
- **Our journey**: Started with hardcoded, evolved to configuration-driven
- **Result**: Maintainable, scalable architecture

**When to Simplify** 🎯
- **Lesson**: "Enterprise-grade" doesn't always mean "more complex"
- **Reality check**: User said "going in circles" with overcomplicated portals
- **Solution**: Step back, use simple CSS Grid approach
- **Wisdom**: Sometimes the simplest solution is the best solution

**Grid vs Absolute Positioning** ⚔️
- **Modern way**: CSS Grid with semantic areas
- **Old way**: Absolute positioning with pixel values
- **Winner**: Grid - no conflicts, responsive, maintainable
- **Our proof**: Final working solution uses simple grid layout

---

## 🔄 **WORKFLOW TERMS**

**CI/CD (Continuous Integration/Continuous Deployment)** 🔄
- **What it is**: Automated testing and deployment
- **Our setup**: GitHub + Vercel (automatic deployment)
- **Benefit**: Changes go live automatically when pushed

**Staging** 🎭
- **What it is**: Testing environment that looks like production
- **Purpose**: Test changes before going live
- **Our approach**: We test locally before deploying

**Rollback** ↩️
- **What it means**: Go back to previous working version
- **When needed**: If new deployment breaks something
- **Our safety**: Git allows easy rollbacks

---

## 💡 **COMMUNICATION TIPS**

**When talking to Copilot, use these terms:**
- "Deploy the changes" (not "put online")
- "Local development" (not "on my computer")  
- "Build the project" (not "make it ready")
- "Component" (not "piece of code")
- "Commit changes" (not "save to git")

**Pro Terms to Impress:**
- "Let's optimize the build" 
- "The component needs refactoring"
- "Check the deployment pipeline"
- "Update the dependencies"
- "Implement responsive design"

---

## 🎯 **NEXT PHASE VOCABULARY**

*Terms we'll use when adding user accounts:*

**Schema** 📋 - Database structure definition
**Migration** 🚚 - Database structure changes  
**JWT (JSON Web Token)** 🎫 - User authentication method
**Middleware** 🛡️ - Code that runs between requests
**Environment Variables** 🌍 - Secret configuration values
**CRUD** ✏️ - Create, Read, Update, Delete operations

---

**💡 TIP**: Keep this file open when we work together. Ask "What does [term] mean?" anytime!

**📝 NOTE**: We'll add more terms as we build new features. This glossary grows with your knowledge!
