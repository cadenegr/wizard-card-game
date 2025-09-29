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

---

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