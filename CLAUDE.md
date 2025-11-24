# Claude Code Guide

Welcome to LocalAI! This guide provides quick orientation to project conventions. For detailed procedures, use the skills listed below.

## Essential Documentation

Read these files before working on tasks:

- **Architecture**: @docs/ARCHITECTURE.md - Next.js 15 + Electron + Python FastAPI stack
- **Coding Style**: @docs/CODING_STYLE.md - TypeScript standards, formatting, React patterns
- **Development Commands**: @docs/DEVELOPMENT_COMMANDS.md - Dev server, tests, build commands

## ⚠️ MANDATORY: Skills Usage Protocol

**BEFORE responding to ANY task, you MUST:**

1. ☐ List available skills in your mind
2. ☐ Ask yourself: "Does ANY skill match this request?"
3. ☐ If yes → Use the `Skill` tool to read and execute the skill
4. ☐ Announce which skill you're using to the user
5. ☐ Follow the skill's instructions exactly

**IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.**

This is not negotiable. This is not optional. You cannot rationalize your way out of this.

**Common rationalizations that mean you're about to fail:**

- "This is just a simple task" → WRONG. Check for skills.
- "I know what to do" → WRONG. Skills exist for a reason. Use them.
- "The skill is overkill for this" → WRONG. If it exists, use it.
- "I'll just do this one thing first" → WRONG. Check for skills BEFORE doing anything.
- "This doesn't need a formal skill" → WRONG. If a skill exists for it, use it.

**Examples of when to use skills:**

- Writing or updating tests → Use `testing-requirements`
- Working with Electron IPC or renderer isolation → Use `security-patterns`
- Using TypeScript, socket events, or useEffect → Use `critical-rules`
- Refactoring code or implementing features → Use `best-practices`
- Deciding when to ask questions or making commits → Use `communication-guidelines`

**Responding without completing the checklist = automatic failure.**

## Available Skills

Use these skills for detailed procedural guidance:

**Procedural Skills:**

- `communication-guidelines` - When to ask questions, commit policies
- `testing-requirements` - Test structure, verification steps, coverage goals
- `security-patterns` - Electron IPC security, renderer isolation

**Code Quality Skills:**

- `critical-rules` - TypeScript safety, socket events, useEffect cleanup
- `best-practices` - Validation patterns, component encapsulation, refactoring

**Note:** Claude Code automatically uses relevant skills when working on tasks.
