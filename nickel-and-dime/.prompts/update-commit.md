# Auto-Commit Generator

Analyze the current git changeset, stage all files, and generate a smart commit message based on the changes. Then provide the executable git command.

## Instructions:
1. First, examine the current changeset using `git diff` and `git status`
2. Analyze what files were modified, added, or deleted
3. Determine the type and scope of changes (feat, fix, refactor, docs, style, etc.)
4. Generate a descriptive commit message following conventional commit format
5. Stage all files with `git add .`
6. Provide the complete executable `git commit` command

## Analysis Steps:
- Check `git status` to see what files are modified/added/deleted
- Use `git diff` to understand the nature of changes
- Categorize changes by type (feature, bugfix, refactor, documentation, etc.)
- Identify the main components/areas affected
- Create a concise but descriptive commit message
- Format as conventional commit: `type(scope): description`

## Output Format:
Provide the final executable command in a code block that the user can copy and run:
```bash
git add . && git commit -m "your smart commit message here"
```