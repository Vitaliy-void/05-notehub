import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useNotesQuery } from "../../hooks/queries";
import css from "./App.module.css";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDebounced] = useDebounce(search, 500);
  const [isModal, setIsModal] = useState(false);

  const { data, isLoading, isError, error } = useNotesQuery({
  page,
  perPage: PER_PAGE,
  search: searchDebounced.trim(),
});

const notes = data?.notes ?? [];
const totalPages = data?.totalPages ?? 0;


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setPage(1);
            setSearch(v);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModal(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p style={{ padding: 16 }}>Loading…</p>}
      {isError && (
        <p style={{ padding: 16, color: "crimson" }}>
          {(error as Error)?.message ?? "Request error"}
        </p>
      )}

      {notes.length ? (
        <NoteList items={notes} />
      ) : (
        !isLoading && <p style={{ padding: 16 }}>No notes yet</p>
      )}

      <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
        <NoteForm onCancel={() => setIsModal(false)} />
      </Modal>
    </div>
  );
}
