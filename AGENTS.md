# Repository guidance

## Project and sources of truth

- This is the Yasong Museum monorepo: `frontend/` is React/Vite, `backend/` is Spring Boot, `scripts/` contains local/build helpers, and `deployment/` contains Ubuntu/systemd deployment tools.
- Use JDK 21, Node.js 22 (`.nvmrc`), Python 3, and the Maven Wrapper in `backend/`.
- Read the relevant code and `README.md` before changing behavior. `deployment/README.md` is the deployment entry point and `deployment/guides/production.md` contains current server setup and operations. Older setup scripts may describe obsolete workflows.
- Inspect `git status` before editing and preserve unrelated user changes. Keep each issue focused; do not combine a targeted fix with unrelated CRUD or architecture rewrites.

## Private local handoff

- If `docs/AI_CONTEXT.md` exists, read it at the start of work for prior decisions, completed work, and open questions. It is optional local context, not a dependency for building or using this repository.
- Check its statements against current code and Git status; historical notes are not proof of current production state or authorization for external actions.
- Update it after meaningful decisions or completed work, keeping the current state concise. Do not copy entire conversations or record secret values.
- Keep this file ignored and untracked. Do not force-add it, copy private findings into public documentation, or require it to exist in another checkout.

## Local execution and configuration

Run these commands from the repository root unless stated otherwise:

- Backend development: `./scripts/dev-backend.sh`.
- Frontend development: run `npm ci` and `npm run dev` in `frontend/`.
- Integrated build, tests, and package verification: `./scripts/build.sh`.
- Run the built application: `./scripts/run-local.sh`.
- Development uses frontend port 5173 and backend port 8080 by default; the integrated JAR serves both on port 8080.
- Local backend helpers read the ignored `backend/src/main/resources/application-local.properties` as external Spring configuration. They do not automatically load a root or backend `.env` file.
- Local helpers default `FILE_UPLOAD_DIR` to the repository-root `uploads/`, preserving an explicit override. Direct IDE/Maven launches need equivalent configuration; relative paths depend on the working directory.
- Frontend environment files are read by Vite in `frontend/`. Development uses `.env.development`; production builds use `.env.production`. Local overrides belong in the corresponding ignored `.env.<mode>.local` file.
- `VITE_*` values used by frontend code are public build-time configuration. Never put JWT signing keys, database passwords, SSH keys, or service-account credentials in them. A backend runtime `.env` change does not update an already-built frontend.
- `backend/.env.example` describes server runtime settings only; frontend build variables belong in `frontend/`. Example files are templates, not automatically loaded runtime configuration.
- Production environment variables are supplied through systemd's `EnvironmentFile`, as documented in `deployment/README.md`. Do not source that file in deployment scripts or overwrite existing credentials.

## Data, files, and migrations

- Use disposable or explicitly configured development databases for tests. Never use production credentials or run tests/migrations against production implicitly.
- Preserve existing uploads and private local configuration. Do not bulk-delete files, migrate storage, rotate keys, or change production data as incidental cleanup.
- Use `UploadStoragePaths` and `FileStorageService` for upload paths and basic file operations. Keep physical storage locations separate from public URLs.
- When modifying file lifecycle behavior, validate/store the new file first, update the DB reference, and delete the old file only after a successful commit. Clean up newly created files on rollback and provide a retry strategy for failed cleanup.
- A database transaction does not roll back filesystem operations. Include actual commit failures, not just service-method exceptions, in relevant regression coverage.
- Before implementing orphan cleanup, account for references across all domains and rich-text content, concurrent operations, a grace period, and dry-run output. Do not assume an unreferenced-looking file is safe to delete.
- These are required design principles for new changes, not a claim that every existing service already follows them.
- Do not edit or remove Flyway migrations already applied to an existing database. Add forward migrations and verify both fresh installation and upgrade behavior where relevant.

## Validation

- Match verification to the change and add focused regression tests for behavioral/security fixes. Avoid unrelated test expansion for documentation-only changes.
- Backend changes: run relevant Maven tests; use `./scripts/build.sh` when the integrated application or packaging is affected. Context/integration tests currently need MySQL and appropriate test configuration.
- Frontend changes: run `python3 scripts/check-frontend-imports.py` from the repository root, then `npm run build` in `frontend/`. Do not assume lint, typecheck, or frontend test scripts exist; inspect `package.json` first.
- Deployment/shell changes: run syntax checks and the relevant Python tests. The full suite is `python3 -m unittest discover -s tests -v`; deployment tests target Linux and require tools such as `flock`, so use a disposable Linux environment or CI when necessary.
- CI supplies disposable MySQL and ephemeral test credentials. A passing CI run does not prove that the production deployment or production configuration is correct.
- Report checks actually run, their results, and any limitations. Do not report unexecuted checks as passing.

## Build and deployment boundaries

- Build frontend assets through `scripts/build.sh`; Maven packages `frontend/dist/` into the JAR. Do not manually copy or commit generated frontend files under backend resources.
- Do not commit build output, uploads, local configuration, private keys, heap dumps, or credential JSON files. Respect `.gitignore` and the package verification script.
- Main pushes and pull requests run CI. Production deployment currently requires manually dispatching the workflow on `main` with `deploy` enabled.
- Do not commit, push, publish issues/advisories, or deploy unless the user's request authorizes that action. Never claim an operation happened without verifying its result.
- JAR rollback does not revert database migrations, environment files, or uploads. Treat those recovery concerns separately.

## Security and communication

- Keep real secrets out of code, examples, test fixtures, logs, generated assets, and replies. Examples must use placeholders or clearly disposable test values.
- Do not publish details of unpatched production vulnerabilities in public Issues, PRs, commit messages, or repository documentation. Keep detailed analysis in a private channel or ignored local notes; ordinary labels do not make public content private.
- Distinguish source-code findings from verified production behavior, and implemented configuration from configuration confirmed on the server.
- Respond in Korean unless requested otherwise. Use English Conventional Commit messages when providing commit messages.
- Explain what changed, why, how it was checked, and material remaining limitations. Challenge unsupported assumptions with evidence; avoid emojis and unnecessary closing questions or offers.
