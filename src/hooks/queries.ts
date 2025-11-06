import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  fetchNotes,
  createNote,
  deleteNote,
  type FetchNotesParams,
  type FetchNotesResponse,
  type CreateNoteBody,
} from "../services/noteService";
import type { Note } from "../types/note";

const KEY = "notes";

export function useNotesQuery(params: FetchNotesParams) {
  return useQuery<FetchNotesResponse, Error>({
    queryKey: [KEY, params.page ?? 1, params.perPage ?? 12, params.search ?? ""],
    queryFn: () => fetchNotes(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation<Note, Error, CreateNoteBody>({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation<Note, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}
