import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  fetchNotes,
  createNote,
  deleteNote,
  type FetchNotesParams,
  type CreateNoteBody,
  type FetchNotesResponse,
  type CreateNoteResponse,
  type DeleteNoteResponse,
} from "../services/noteService";

const KEY = "notes";

export function useNotesQuery(params: FetchNotesParams): UseQueryResult<FetchNotesResponse, Error> {
  return useQuery<FetchNotesResponse, Error>({
    queryKey: [KEY, params.page ?? 1, params.perPage ?? 12, params.search ?? ""],
    queryFn: () => fetchNotes(params),
    staleTime: 30_000,
  });
}

export function useCreateNote(): UseMutationResult<CreateNoteResponse, Error, CreateNoteBody> {
  const qc = useQueryClient();
  return useMutation<CreateNoteResponse, Error, CreateNoteBody>({
    mutationFn: createNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useDeleteNote(): UseMutationResult<DeleteNoteResponse, Error, string> {
  const qc = useQueryClient();
  return useMutation<DeleteNoteResponse, Error, string>({
    mutationFn: deleteNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}
