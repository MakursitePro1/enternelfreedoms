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
- Keep the home teacher carousel sourced from shared published teacher records and use Embla Auto Scroll for continuous motion, so admin edits and the teacher directory stay in sync while the cards never pause between steps.
- Render home and dedicated contact content through one shared contact section, so the same verified location and responsive design appear in both places.
- Keep campus facility records authoritative and show only existing local campus imagery and neutral space labels when no records are published, so the public page never appears empty or invents detailed claims.
- Keep every catalogue book published as an active book record with its own price and cover, so all listed books are fully orderable end-to-end.
- Derive teacher profile URLs from the published name plus an immutable short ID and accept legacy UUID links, so names read naturally while duplicates and old bookmarks remain valid.
- Admin panel lives only at a secret non-'admin' route with no public links and signup disabled, so the admin area is not discoverable.
- Keep admin authentication, data and existing forms in one persistent workspace layout, rendering registered URL-selected pages through an Outlet and shared page context, so deep links and browser history work without duplicating management handlers.
- Calculate overview metrics and charts from authorized live management records, distinguishing completed order values from pending orders, so summaries do not imply unverified revenue.
- Render admin page banners in the persistent workspace with page-specific actions tied to existing navigation and forms, so all management pages remain visually consistent without duplicating handlers.
- Keep fictional admission design-preview records in local component state, separate from live records and server mutations, so preview interactions never affect real applications or overview totals.
- Render individual admission detail URLs through the persistent admin workspace using authorized records and the same mounted admissions state for previews, so all submitted fields remain private and preview changes stay isolated.
- Share order detail and progress presentation between customer tracking and admin management; keep fictional orders in local state outside live metrics and mutations.
- Enforce order transitions, payment verification and approval-before-dispatch in a database trigger; reveal customer order details only after matching both reference and phone.

- Keep admin book editing and cover selection in a dedicated UI module with workspace-owned drafts and authenticated publishing callbacks, so catalogue management remains isolated without duplicating server handlers.
- Keep teacher management in a dedicated editor using the existing content records and authenticated workspace callbacks; synchronize public teacher reads through Realtime, cross-tab invalidation and recovery reads so published identities stay consistent without page reloads.
