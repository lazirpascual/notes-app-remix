import {
  ActionFunctionArgs,
  json,
  LinksFunction,
  redirect,
} from "@remix-run/node";
import NewNote, { links as newNoteStyles } from "~/components/NewNote";
import { getStoredNotes, storeNotes } from "~/data/notes";
import NoteList, { links as noteListLink } from "~/components/NoteList";
import {
  Link,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw new Response("Could not find any notes.", {
      status: 404,
    });
  }
  return notes;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.toString().trim().length > 5) {
    return { message: "Invalid title - must be at least 5 characters long." };
  }

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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <NewNote />
        <p className="info-message">{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <main className="error">
        <h1>An error related to your notes occurred!</h1>
        <p>{error?.message}</p>
        <p>
          Back to <Link to="/">safety</Link>!
        </p>
      </main>
    );
  } else {
    return <h1>Unkown Error</h1>;
  }
}
