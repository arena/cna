# CNA Skills App - Comprehensive Design Document

## App Overview
The CNA Skills App is a React-based web application designed for CNA students preparing for their skills competency tests. It provides three main modes: Practice Tests, Skills Browser, and AI Evaluator, along with an About section.

## Global App Structure

### **Main Container & Layout**
- **Container**: `max-w-4xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen`
- **Main Card**: `bg-white rounded-lg shadow-lg p-3 sm:p-6`
- **Responsive Design**: Uses Tailwind's responsive prefixes (`sm:`) for mobile-first design

### **Header Section**
- **Title**: `text-2xl sm:text-3xl font-bold text-gray-800` - "CNA Friend"
- **Tagline**: Dynamic based on current view:
  - Practice: "Practice set of 5 skills • 30 minute time limit"
  - Browser: "All twenty-two CNA skills"
  - About: "Your best friend on your path to getting your CNA license in the state of Nevada"

### **Navigation Tabs**
- **Container**: `flex border-b border-gray-200 mb-6`
- **Tab Buttons**: `px-4 py-2 font-medium text-sm border-b-2 transition-colors`
- **Active State**: `border-blue-500 text-blue-600`
- **Inactive State**: `border-transparent text-gray-500 hover:text-gray-700`
- **Tabs**: Practice, Skills, AI Eval, About

## View 1: Practice Test Mode

### **Purpose & User Flow**
Simulates the actual CNA skills test with 5 randomly generated skills, 30-minute timer, and step-by-step evaluation.

### **Timer Controls (Header Right)**
- **Container**: `flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4`
- **Timer Display**: 
  - Container: `bg-gray-100 rounded-lg p-3`
  - Time: `text-lg sm:text-xl font-mono font-bold` (red when ≤5 mins or negative)
  - Clock icon with play/pause and reset buttons
- **New Skill Set Button**: `bg-blue-600 text-white rounded-lg hover:bg-blue-700 px-4 py-3`

### **Skills List**
Each skill displays as an expandable card:

#### **Skill Header (Collapsed)**
- **Container**: `border border-gray-200 rounded-lg overflow-hidden`
- **Button**: `w-full p-3 sm:p-4 text-left bg-white hover:bg-gray-50`
- **Number Badge**: Circular, numbered 1-5
  - Default: `bg-blue-100 text-blue-800`
  - Completed (Passed): `bg-green-100 text-green-800` with CheckCircle icon
  - Completed (Failed): `bg-red-100 text-red-800` with X icon
- **Title**: `text-base sm:text-lg font-semibold text-gray-800`
- **Category Tags**: `bg-gray-100 px-2 py-1 rounded text-xs`
- **Type Indicators**: Water/Measurement icons with labels
- **Completion Time**: Shows when completed with pass/fail status
- **Chevron**: Up/Down based on expansion state

#### **Skill Content (Expanded)**
- **Container**: `border-t border-gray-200 bg-gray-50 p-3 sm:p-4`

##### **Supplies Needed Section**
- **Container**: `mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg`
- **Title**: `font-semibold text-blue-800 mb-2`
- **List Items**: `text-sm text-blue-700` with blue bullet points

##### **Steps Section**
Each step displays as:
- **Step Container**: Dynamic styling based on evaluation state:
  - Default: `bg-white border-gray-200`
  - Critical Default: `critical-step-default` (cream background)
  - Critical Good: `bg-green-50 border-green-200`
  - Critical Wrong: `bg-red-50 border-red-200`

- **Step Number**: Circular badge, color changes based on critical status and evaluation
- **Step Text**: `text-sm leading-relaxed`, bold for critical steps
- **Critical Badge**: `text-xs font-bold px-2 py-1 rounded` when step is critical
- **Evaluation Buttons**: Three buttons (Check, Minus, X) for Good/Skipped/Wrong

##### **Complete Skill Button**
- **Button**: `w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700`

### **Results Summary (All Skills Completed)**
- **Container**: `mt-6 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg`
- **Award Icon**: Top left with "Test Completed!"
- **Stats Grid**: 2-column grid showing:
  - Total Time Used vs 30:00
  - Skills Status (Passed/To Review counts with colored dots)
- **Individual Results**: List of each skill with time and pass/fail status
- **Overall Status**: Large centered badge - green for pass, yellow for needs review
- **Action Buttons**: "Try Again" and "Share Results"

### **Info Box (When Test Not Completed)**
- **Container**: `mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg`
- **Content**: Bulleted list of test rules and instructions

### **State Management**
- **Skill Selection Algorithm**: Always Hand Hygiene first, then measurement skill, water skill, and two non-water skills
- **Timer**: 30-minute countdown with auto-start on first step evaluation
- **Step Tracking**: Each step evaluation stored as `skillId-stepIndex: evaluation`
- **Skill Completion**: Tracks completion times and critical failures

### **Visual States & Animations**
- **Current Skill Animation**: `current-skill` class with 8-second fade from blue to gray border
- **Visited Skills**: Subtle visual indication
- **Auto-scroll**: Scrolls to newly expanded skills
- **Responsive Breakpoints**: Mobile-first design with `sm:` breakpoints

## View 2: Skills Browser

### **Purpose & User Flow**
Browse all 22 CNA skills with individual practice mode, organized by number or skill type.

### **Organization Controls**
- **Container**: `flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg`
- **Toggle Buttons**: "Skill Number" vs "Skill Type" organization
- **Active**: `bg-blue-600 text-white`
- **Inactive**: `bg-white text-gray-600 hover:bg-gray-100`

### **Skill Number Organization**
Displays all 22 skills in order with practice timers and estimated completion times.

### **Skill Type Organization**
Groups skills into categories:
1. **Hand Hygiene** - Always performed first
2. **Measurement Skills** - Second skill in tests  
3. **Water Skills** - Personal care involving water
4. **Mobility Skills** - Movement, positioning, transfers
5. **Infection Control** - PPE and safety procedures
6. **Personal Care** - Non-water personal care

### **Individual Practice Mode**
When "Practice" button is clicked:

#### **Practice Header**
- **Container**: `mb-4 p-3 bg-green-50 border border-green-200 rounded-lg`
- **Timer**: Live timer with `formatDuration()` display
- **Controls**: Reset and Stop Practice buttons

#### **Step Display**
- **Tips**: Special blue styling with lightbulb icon and "Tip:" prefix
- **Regular Steps**: Same evaluation system as Practice Test mode
- **Critical Steps**: Highlighted with yellow styling

#### **Practice Complete State**
Three possible outcomes:
1. **Critical Failures**: `bg-yellow-50 border border-yellow-200` with "Try Again" button
2. **Some Steps Missed**: `bg-blue-50 border border-blue-200` with "Practice Again"  
3. **Perfect**: `bg-green-50 border border-green-200` with "Practice Again"

### **Skills Display (Both Organizations)**
- **Headers**: Category icons for skill type organization
- **Estimated Times**: `bg-blue-100 text-blue-700 font-medium` badges
- **Practice Button**: `bg-gray-500 text-white rounded hover:bg-gray-600 text-xs`

## View 3: AI Evaluator

### **Purpose & User Flow**
Voice-recognition powered skill evaluation that automatically detects completed steps as users verbalize their actions.

### **Component Structure**
- **File**: `/src/components/AIEvaluator.jsx` (separate component)
- **Container**: `max-w-5xl mx-auto space-y-6`

### **Header Section**
- **Container**: `bg-white rounded-lg border border-gray-200 p-6`
- **Title**: "AI Evaluator"
- **Description**: Explains voice recognition functionality
- **How It Works**: `bg-gray-50 border border-gray-200 rounded-lg p-4` instruction box

### **Skill Selection**
- **Grid**: `grid grid-cols-1 gap-2`
- **Skill Buttons**: Full-width with selection states:
  - Selected: `bg-blue-50 border-blue-500 text-blue-800`
  - Unselected: `bg-white border-gray-200 hover:bg-gray-50`
- **Skill Numbers**: Circular badges that change to blue when selected
- **Selected Skill Details**: Shows step count and reset button

### **Expanded AI Evaluation Section**
When skill is selected:
- **Container**: `bg-blue-50 rounded-b-lg border-l border-r border-b border-blue-500 p-4`

#### **Voice Recognition Controls**
- **Container**: `mb-6 p-4 bg-white rounded-lg ml-7`
- **Status Indicator**: Green dot for "Ready", red dot for "Not supported"
- **Main Button**: 
  - Start: `bg-blue-600 text-white hover:bg-blue-700`
  - Stop: `bg-red-600 text-white hover:bg-red-700`
- **Live Transcript**: Shows what's being heard in real-time
- **Test Buttons**: A+/B/F simulation buttons (development only)

#### **Steps Evaluation**
- **Container**: `space-y-2 ml-7`
- **Step States**:
  - Pending: `bg-gray-50 border-gray-200`
  - Completed: `bg-green-50 border-green-200` with green badge
  - Skipped: `bg-yellow-50 border-yellow-200` with yellow badge
  - Missed: Yellow styling for steps not completed
- **Step Numbers**: Circular badges with state-based colors
- **Status Labels**: "Completed!", "Just detected!", "Skipped", "Missed"
- **Auto-scroll**: Automatically scrolls to newly completed steps

#### **Results Summary**
Appears when "skill complete" is detected:
- **Container**: `p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded border border-green-200`
- **Completion Message**: "🎉 Skill Complete!"
- **Summary Text**: Dynamic based on completion rate
- **Stats Grid**: 2x2 grid showing:
  - Steps Completed (green)
  - Time Taken (blue)
- **Share Button**: `bg-green-600 text-white rounded-lg hover:bg-green-700`

### **Speech Recognition Integration**
- **API**: Uses Web Speech API (`SpeechRecognition` or `webkitSpeechRecognition`)
- **Settings**: Continuous mode, interim results, English US
- **Word Matching**: Filters common words, matches key terms with 30% threshold
- **Completion Detection**: Listens for "skill complete" phrase
- **Auto-timing**: Starts timer on first detection, ends on completion

### **State Management**
- **Voice State**: `isListening`, `transcript`, `speechRecognition`
- **Evaluation State**: `aiStepEvaluations`, `detectedMatches`
- **Timing**: `aiEvalStartTime`, `aiEvalEndTime`
- **Selected Skill**: `aiEvalSkill`

## View 4: About

### **Purpose & User Flow**
Information about the app, usage instructions, disclaimer, and links.

### **Layout**
- **Container**: `max-w-3xl mx-auto space-y-6`
- **Main Card**: `bg-white rounded-lg border border-gray-200 p-6`

### **Content Sections**

#### **Who is this for?**
- **Title**: `font-semibold text-gray-800 mb-2`
- **Text**: `text-sm leading-relaxed`
- **Share Button**: `bg-blue-600 text-white rounded-lg hover:bg-blue-700`

#### **Why this app exists**
- **Purpose**: Focus on practicing skills rather than navigation

#### **How to use this app**
- **List**: `text-sm space-y-1 ml-4`
- **Items**: Three usage modes with bullet points and bold titles

#### **Free to Use**
- **Pricing**: Information about free access and sharing

#### **Contribute**
- **Feedback**: Link to GitHub repository
- **Button**: `bg-gray-600 text-white rounded-lg hover:bg-gray-700`

#### **Important Disclaimer**
- **Container**: `p-4 bg-yellow-50 border border-yellow-200 rounded-lg`
- **Text**: `text-sm leading-relaxed text-yellow-800`
- **Content**: Legal disclaimer about study purposes only

#### **Footer**
- **Text**: "Created by students for students 💙"

## Global State Management

### **Main App State**
- **Current View**: `practice | browser | ai-eval | about`
- **Skills Organization**: `number | type`
- **Current Skills**: Array of 5 skills for practice test
- **Expanded Skill**: ID of currently expanded skill
- **Timer State**: `timeRemaining`, `isTimerRunning`
- **Visited Skills**: Set of skill IDs that have been expanded

### **Evaluation Tracking**
- **Step Evaluations**: `stepEvaluations[skillId-stepIndex] = good|skipped|wrong`
- **Completion Times**: `skillCompletionTimes[skillId] = seconds`
- **Start Times**: `skillStartTimes[skillId] = seconds`

### **Practice Mode State**
- **Practice Mode**: Current skill ID being practiced
- **Practice Timer**: `practiceTime`, `isPracticeRunning`
- **Practice Evaluations**: Separate evaluation state for practice mode
- **Practice Completed**: Boolean flag

## Icon System

### **Built-in SVG Icons**
All icons use `className="icon"` with consistent sizing:
- **ClockIcon**: Timer display
- **PlayIcon** / **PauseIcon**: Timer controls
- **RotateIcon**: Reset timer
- **ShuffleIcon**: New skill set
- **ChevronDownIcon** / **ChevronUpIcon**: Expand/collapse
- **CheckIcon**: Good evaluation
- **XIcon**: Wrong evaluation  
- **MinusIcon**: Skipped evaluation
- **CheckCircleIcon**: Completed skills
- **DropletsIcon**: Water skills indicator
- **AwardIcon**: Measurement skills indicator
- **ShareIcon**: Share functionality

### **Custom Category Icons**
Located in `/src/data/icons/`:
- **Hand Hygiene**: `./icon-handwashing.svg` (external SVG)
- **Vital Signs**: `./icon-vitals.svg` (external SVG)
- **Urinary Output**: `./icon-output.svg` (external SVG)
- **Water Skills**: `WaterIcon.jsx` (custom SVG component)
- **Personal Care**: `CareIcon.jsx` (custom SVG component)
- **PPE/Gloves**: `GlovesIcon.jsx` (custom SVG component)
- **Mobility**: `MobilityIcon.jsx` (custom SVG component)
- **Stockings**: `StockingsIcon.jsx` (custom SVG component)

## Color System

### **Primary Colors**
- **Blue**: `#3b82f6` (blue-600) - Primary actions, active states
- **Green**: `#16a34a` (green-600) - Success, completed, good evaluations
- **Red**: `#dc2626` (red-600) - Errors, wrong evaluations, critical failures
- **Yellow**: `#ca8a04` (yellow-600) - Warnings, skipped steps, needs review

### **Background Colors**
- **App Background**: `bg-gray-50`
- **Card Background**: `bg-white`
- **Success Background**: `bg-green-50`
- **Error Background**: `bg-red-50`
- **Warning Background**: `bg-yellow-50`
- **Info Background**: `bg-blue-50`
- **Critical Step Background**: `#FFF8DC` (custom cream color)

### **Text Colors**
- **Primary Text**: `text-gray-800`
- **Secondary Text**: `text-gray-600`
- **Success Text**: `text-green-700`
- **Error Text**: `text-red-700`
- **Warning Text**: `text-yellow-700`
- **Info Text**: `text-blue-700`

## Responsive Design

### **Breakpoints**
- **Mobile First**: Default styles for mobile
- **Small (sm:)**: 640px+ for tablets and small desktops
- **Large**: Max-width containers prevent excessive stretching

### **Layout Adaptations**
- **Header**: Stacks vertically on mobile, horizontal on desktop
- **Timer Controls**: Column layout on mobile, row on desktop
- **Step Evaluations**: Buttons stack vertically on mobile
- **Text Sizes**: Smaller on mobile (`text-sm` vs `text-base`)
- **Padding**: Reduced padding on mobile (`p-3` vs `p-6`)

## Data Flow

### **Skills Data Structure**
- **File**: `/src/data/skills_data.json`
- **Structure**: 
  - `testInfo`: Overall test configuration
  - `skills`: Array of skill objects with steps, supplies, metadata

### **Content Data**
- **File**: `/src/content.yml`
- **Structure**: All UI text, labels, and copy organized by feature

### **Skill Generation Algorithm**
1. Always start with Hand Hygiene (`isAlwaysFirst: true`)
2. Add one measurement skill (`isMeasurementSkill: true`)
3. Add one water skill from Personal Care (`isWaterSkill: true`)
4. Add two non-water, non-measurement skills

### **Step Evaluation Flow**
1. User clicks evaluation button
2. Auto-starts timer on first evaluation
3. Stores evaluation in state as `skillId-stepIndex: evaluation`
4. Critical failures tracked for pass/fail determination
5. Skill completion triggers time recording and next skill opening

## Critical Components for Refactoring

### **Components Already Extracted**
- `AIEvaluator.jsx` - Complete AI evaluation functionality
- Various icon components in `/src/data/icons/`

### **Components to Extract**
1. **PracticeView** - Practice test mode with timer and 5 skills
2. **SkillsBrowserView** - All skills browser with individual practice
3. **AboutView** - Static about content
4. **SkillCard** - Individual skill display with expansion
5. **StepEvaluation** - Step with evaluation buttons
6. **Timer** - Timer controls and display
7. **ResultsSummary** - Test completion results

### **Utility Functions to Extract**
- `formatTime()` / `formatDuration()` - Time formatting
- `generateSkillSet()` - Skill selection algorithm
- `getSkillTypeIcon()` / `getSkillCategoryIcon()` - Icon logic
- `hasSkillCriticalFailures()` - Pass/fail determination

### **Custom Hooks to Extract**
- Timer management logic
- Step evaluation state management
- Skill expansion/collapse logic
- Auto-scroll behavior

This design document serves as the complete reference for maintaining exact functionality and styling during the refactoring process.