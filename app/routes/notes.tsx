import { ActionFunctionArgs, LinksFunction, redirect } from "@remix-run/node";
import NewNote, { links as newNoteStyles } from "~/components/NewNote";
import { getStoredNotes, storeNotes } from "~/data/notes";
import NoteList, { links as noteListLink } from "~/components/NoteList";

export default function NotesPage() {
  return (
    <main>
      <NewNote />
      <NoteList />
    </main>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toDateString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
}

export const links: LinksFunction = () => [
  ...newNoteStyles(),
  ...noteListLink(),
];
