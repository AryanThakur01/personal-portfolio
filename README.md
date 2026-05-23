# 🚀 Personal Portfolio

> This is a personal portfolio project built to showcase my skills and projects. It serves as a platform to demonstrate my experience in software development, design, and other relevant areas.

[![CI](https://github.com/AryanThakur01/personal-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/AryanThakur01/personal-portfolio/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/AryanThakur01/personal-portfolio)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Good Coding Practices](#good-coding-practices)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

<!-- Explain the problem this project solves. Keep it brief but clear. -->
This project is designed to provide a comprehensive showcase of my skills and projects in software development. It serves as a personal portfolio that highlights my experience, expertise, and the various technologies I have worked with.

- **What** it does?
- **Why** it exists
- **Who** it's for

---

## Tech Stack

| Layer       | Technology |
|-------------|------------|
| Language    | -          |
| Framework   | -          |
| Database    | -          |
| Infra/Cloud | -          |
| CI/CD       | GitHub Actions |

---

## Getting Started

### Prerequisites

List everything required to run this project locally.

```bash
# Example
node >= 18
python >= 3.10
docker
```

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/repo-name.git
cd repo-name

# 2. Copy environment variables
cp .env.example .env

# 3. Install dependencies (replace with your package manager)
npm install

# 4. Run setup script
bash scripts/setup.sh

# 5. Start development server
npm run dev
```

---

## Project Structure

```
personal-portfolio/
├── .github/                  # GitHub-specific config
│   ├── ISSUE_TEMPLATE/       # Standardized issue forms
│   ├── workflows/            # CI/CD pipelines
│   ├── CODEOWNERS            # Auto-assign reviewers
│   ├── dependabot.yml        # Dependency automation
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                     # Documentation
│   ├── guides/               # Tech-specific guides
│   ├── architecture.md       # System design decisions
│   ├── setup.md              # Detailed setup docs
│   └── deployment.md         # How to deploy
├── scripts/                  # Automation scripts
│   ├── setup.sh              # Environment bootstrap
│   └── deploy.sh             # Deployment helper
├── src/                      # Source code (add your own)
├── tests/                    # Test files
├── .editorconfig             # Editor formatting rules
├── .env.example              # Environment variable template
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── SECURITY.md
└── README.md
```

---

## Development Guide

See detailed guides for your specific stack:

| Type | Guide |
|------|-------|
| Web / Full-stack | [docs/guides/web-fullstack.md](docs/guides/web-fullstack.md) |
| API / Backend | [docs/guides/api-backend.md](docs/guides/api-backend.md) |
| Mobile | [docs/guides/mobile.md](docs/guides/mobile.md) |
| CLI / Library | [docs/guides/cli-library.md](docs/guides/cli-library.md) |
| AI / ML | [docs/guides/ai-ml.md](docs/guides/ai-ml.md) |

---

## ✅ Good Coding Practices

> These apply regardless of language or framework. Follow them on every project.

---

### 1. Naming Conventions

- **Variables & Functions:** Use intention-revealing names. `getUserById()` not `getU()`.
- **Booleans:** Prefix with `is`, `has`, `can`, `should` — e.g., `isLoading`, `hasPermission`.
- **Constants:** `UPPER_SNAKE_CASE` for true constants (`MAX_RETRY_COUNT`).
- **Files:** `kebab-case` for files (`user-service.ts`), `PascalCase` for components (`UserCard.tsx`).
- **Avoid abbreviations** unless universally understood (`url`, `id`, `html` are fine; `usrMgr` is not).

---

### 2. Function Design

- **Single Responsibility:** Every function does one thing and does it well.
- **Keep them short:** If a function exceeds ~30 lines, it's doing too much.
- **Pure functions first:** No hidden side effects where possible.
- **Fail fast:** Validate inputs at the top, return early on error conditions.

```js
// ❌ Bad
function process(data) {
  if (data) {
    // 60 lines of mixed logic
  }
}

// ✅ Good
function processUserData(user) {
  if (!user) throw new Error('User is required');
  const validated = validateUser(user);
  return formatUser(validated);
}
```

---

### 3. Error Handling

- **Never swallow errors silently.** Always log or rethrow.
- **Use typed/custom errors** for different failure categories.
- **Always handle async errors** — never leave a promise unhandled.
- **Show user-friendly messages;** log technical details server-side.

```js
// ❌ Bad
try { doSomething(); } catch (e) {}

// ✅ Good
try {
  await doSomething();
} catch (error) {
  logger.error('Failed to do something', { error, context });
  throw new AppError('Operation failed', { cause: error });
}
```

---

### 4. Code Comments

- **Comment the WHY, not the WHAT.** Code shows what; comments explain reasoning.
- **No commented-out code** in production — use git history instead.
- **TODO comments** must include a ticket/issue reference: `// TODO(#123): remove after migration`.
- **Document public APIs** — every exported function/class should have a docstring.

```js
// ❌ Bad
// increment i by 1
i++;

// ✅ Good
// Retry limit is 3 to balance reliability vs latency per SLA requirements
const MAX_RETRIES = 3;
```

---

### 5. Git Discipline

- **Commit often, push meaningful.** Small, atomic commits.
- **Use Conventional Commits:**

  ```
  feat: add user authentication
  fix: resolve null pointer in payment flow
  docs: update API usage guide
  refactor: extract validation logic to utils
  test: add unit tests for auth service
  chore: upgrade dependencies
  ```

- **Never commit secrets.** Use `.env.example` for templates.
- **Branch naming:** `feature/short-description`, `fix/issue-123`, `chore/update-deps`.
- **Delete merged branches.**

---

### 6. Security Basics

- **Never hardcode secrets** — use environment variables.
- **Validate all inputs** on the server side, always.
- **Use HTTPS everywhere.**
- **Least privilege principle** — services and users only get the permissions they need.
- **Keep dependencies updated** — use Dependabot (configured in this repo).
- **Sanitize user inputs** before display or persistence.
- **Log security events** but never log passwords, tokens, or PII.

---

### 7. Testing

- **Test behaviour, not implementation.**
- **Follow the Testing Pyramid:** unit > integration > e2e.
- **Aim for coverage that matters** — 80% meaningful coverage beats 100% trivial coverage.
- **Each test should have one reason to fail.**
- **Name tests clearly:** `should return 404 when user is not found`.

```js
// ✅ Good test structure (Arrange / Act / Assert)
it('should return 404 when user is not found', async () => {
  // Arrange
  const nonExistentId = 'abc-123';

  // Act
  const response = await request(app).get(`/users/${nonExistentId}`);

  // Assert
  expect(response.status).toBe(404);
  expect(response.body.message).toBe('User not found');
});
```

---

### 8. Performance Mindset

- **Measure before optimizing** — profile first, never guess.
- **Avoid premature optimization.**
- **Paginate large data sets** — never fetch unlimited rows.
- **Cache aggressively where data does not change often.**
- **Lazy-load** what is not needed immediately.

---

### 9. Code Reviews

- **Review the logic, not the style** — that is linters job.
- **Be kind and specific** in feedback: "consider extracting this into a helper" not "this is bad".
- **Author: address every comment** or explain why you disagree.
- **No PR without tests** if it adds logic.
- **Keep PRs small** — under 400 lines of change where possible.

---

### 10. Documentation

- **Treat docs as code** — keep them in the repo, update them in the same PR.
- **README must always be runnable** — someone new should be able to follow it from zero.
- **Document decisions** in `docs/architecture.md` — future you will thank you.
- **Use `CHANGELOG.md`** to track meaningful changes per release.

---

## Deployment

See [docs/deployment.md](docs/deployment.md) for full deployment guide.

```bash
# Quick deploy
bash scripts/deploy.sh
```

---

## Contributing

I welcome all contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the [MIT License](LICENSE).
