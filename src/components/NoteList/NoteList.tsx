import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";

export interface NoteListProps {
  items: Note[];
}

export default function NoteList({ items }: NoteListProps) {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!items.length) return null;

  return (
    <ul className={css.list}>
      {items.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <button className={css.button} disabled={isPending} onClick={() => mutate(n.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
