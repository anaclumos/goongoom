
- When replacing imports with `edit` tool, be extremely careful about exact string matching. If the file has been formatted or modified, the match might fail silently or produce unexpected results. Always verify with `cat` if `tsc` reports missing imports that you thought you added.
- `tsc --noEmit` is reliable for checking if imports are actually present and resolved.
