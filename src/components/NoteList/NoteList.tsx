import css from "./NoteList.module.css";
import { useDeleteNote } from "../../hooks/queries";
import type { Note } from "../../types/note";

export interface NoteListProps {
  items: Note[];
}

export default function NoteList({ items }: NoteListProps) {
  const { mutate: remove, isPending } = useDeleteNote();

  if (!items.length) return null;

  return (
    <ul className={css.list}>
      {items.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button className={css.button} disabled={isPending} onClick={() => remove(n.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
