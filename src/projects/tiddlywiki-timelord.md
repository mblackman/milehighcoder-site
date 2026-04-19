---
title: Timelord
description: A robust TiddlyWiki plugin providing infinite revision history, full restorations, and smart storage.
subdir: Project
repo: https://github.com/mblackman/tiddlywiki-timelord
demo: https://mblackman.github.io/tiddlywiki-timelord/
splash: /images/projects/timelord-splash.png
activeDevelopment: true
date: 2026-04-18
type: personal-project
hidden: false
tech:
  - JavaScript
  - TiddlyWiki
  - GitHub Actions
  - Jest
---

Timelord is a powerful TiddlyWiki plugin I developed as a hard fork of [`tiddlywiki-revision-history`](https://github.com/AshlinDuncan/tiddlywiki-revision-history), significantly improving the interface, storage mechanisms, and core TiddlyWiki integration. It solves the problem of data loss and tracking changes over time within TiddlyWiki by introducing an infinite, unpruned revision history where the wiki acts as the ultimate source of truth.

## Features

- **Infinite Revision History**: No automatic pruning. The complete history of every tiddler is retained safely.
- **Full Restorations**: You can restore any tiddler to its exact historical state with a single click, recovering text, fields, and tags perfectly. Restores are fully undoable.
- **Delete Capture**: Deleting a tiddler doesn't mean it's gone forever. The final state is captured before removal and kept accessible in a dedicated "Deleted Tiddlers" sidebar tab.
- **Diff View**: Visually compare what changed between any two revisions, tracking text diffs and metadata/field changes seamlessly.
- **Edit Summaries**: Allows annotating why specific changes were made, making historical edits easy to track and understand.
- **Smart Storage Compression**: Uses delta and diff compression under the hood to completely eliminate storage bloat while still retaining full historical fidelity of all metadata fields.
- **Chain Integrity Tools**: Built-in tools allow tracking, verifying, and repairing revision chains, easily rescuing broken histories.

## Technical Details

The plugin operates by silently archiving the previous version of a tiddler as a hidden system tiddler whenever a modification happens. This required deep integration with TiddlyWiki's core systems using JavaScript. For developers and contributors, the project ships with extensive automated testing via Jest and a custom TiddlyWiki mock runtime targeting ~90% code coverage. It also maintains a robust GitHub Actions CI/CD pipeline for generating releases and updating the interactive demo wiki.
