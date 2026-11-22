## Agency process (opt-in, scoped trial)

Applies only when the task is designing or building UI from a Figma design, a spec or
a ticket, or when I say "use the agency process". For anything else, ignore this section.

Process root: /Users/jimmy/Dropbox/04 Projects/AI Shared/typographic-agency-os
If the files below are missing, say so and stop; do not improvise a process.

When it applies:
- Small tasks (a single-file tweak or fix, no new screens or states) skip the gates: add
  one line to run-log.md, and a learnings note only if something new came up. If unsure,
  treat the task as full.
- Read agency/master-brief.md (Part 8 governs), loop/README.md, the role file under
  roles/ for the job, and only the loop/learnings.md entries for this role and gate.
- Keep brief.md (scope, version, acceptance checks, one shared task budget), run-log.md,
  parameter-manifest.md and screenshots/ in this project folder. brief.md and run-log.md
  already exist here: extend them, do not replace them.
- At each Checks-pass gate (define, design, build, release) run loop/score.py with a
  separate read-only reviewer. Creator is not the reviewer. PASS continues; FAIL means
  fix and recheck within the budget; NOT RUN holds.
- Learnings written to loop/learnings.md stay generic: the pattern, the check and the
  evidence pointer, not client figures, copy or data.
- Without my explicit yes: no merging, no edits to the process files or evals, no
  publishing, Figma writes, contacting anyone, spending, deleting or scheduling.
