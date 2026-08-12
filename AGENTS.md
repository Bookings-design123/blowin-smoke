# Blowin' Smoke — Codex Working Agreement

These instructions apply to every Codex task in this repository unless the user explicitly overrides them.

## Repository and branch

- Repository: `Bookings-design123/blowin-smoke`
- Delivery branch: `main`
- Do not create a new branch unless the user explicitly requests one.
- Never force-push, rewrite remote history, or amend existing remote commits.

## Start-of-task synchronization

Before editing files:

1. Inspect the working tree with `git status --short`.
2. Fetch `origin`.
3. Identify the latest `origin/main`.
4. Integrate the task safely on top of the latest remote `main` while preserving all existing research, prototype, insight-bank, and customer-intelligence commits.
5. Do not redo completed work merely because the remote advanced.

## Mandatory delivery contract

Any task that creates or modifies repository files is not complete until the result is visible on remote GitHub.

Before reporting completion:

1. Run the task's required checks.
2. Inspect the final diff.
3. Commit all intended changes with the requested commit message, or a concise accurate message when none is provided.
4. Confirm the worktree is clean after the commit.
5. Fetch `origin` again.
6. Rebase or otherwise integrate safely if `origin/main` advanced during the task.
7. Push the completed commit to `origin/main`.
8. Do not stop after making only a local commit.
9. Verify the pushed commit and required output paths through remote GitHub, not only through the local working tree.
10. Report the final remote commit SHA and confirm that the remote push succeeded.

If network or permission limitations prevent the push:

- Do not claim completion.
- Preserve all local work and commits.
- Report the exact failed command and error.
- State the smallest action required to complete remote delivery.

## Existing-work protection

- Preserve all newer remote commits.
- Do not delete, rename, regenerate, or overwrite earlier research or prototype iterations unless the user explicitly authorizes it.
- Treat completed prototype iterations as immutable comparison evidence.
- Do not modify production directories during static research/design phases.

## Efficiency

- Do not rerun successful checks or regenerate unchanged screenshots without a concrete reason.
- Limit validation and screenshots to the files and surfaces materially affected by the task, unless the user explicitly requests a full-suite rerun.
- Use existing repository scripts and evidence when they remain valid.
- Prefer one implementation pass, one focused review pass, and one correction pass.
- Keep the final report factual and brief.

## Completion report

For repository-changing work, report at minimum:

- final remote commit SHA;
- files or package paths created or modified;
- checks performed and their result;
- confirmation that the push to `origin/main` succeeded;
- confirmation that no force-push occurred;
- any unresolved gate or limitation.
