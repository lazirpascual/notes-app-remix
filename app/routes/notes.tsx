import type { LinksFunction } from "@remix-run/node";
import NewNote, { links as newNoteStyles } from "~/components/NewNote";

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
}

export const links: LinksFunction = () => [...newNoteStyles()];
