<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep public institutional content in shared page components and route-specific files, so each page has distinct navigation and metadata.
- Use Cloud tables with RLS for admissions, book orders, notices, books, and separate admin roles, so public submissions cannot reveal private records.
- Use server functions to validate public submissions and calculate order totals, so visitors cannot tamper with prices or read others' data.
- Keep the home hero's English heading font in its own theme token and load it from the root head, so Bengali display typography remains unchanged.
