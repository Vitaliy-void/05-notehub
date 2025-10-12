import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useCreateNote } from "../../hooks/queries";
import type { NoteTag } from "../../types/note";

export interface NoteFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag | "";
}

const Schema = Yup.object({
  title: Yup.string().min(3, "Min 3").max(50, "Max 50").required("Required"),
  content: Yup.string().max(500, "Max 500"),
  tag: Yup.mixed<NoteTag>().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required("Required"),
});

export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const { mutateAsync, isPending } = useCreateNote();

  const initialValues: NoteFormValues = { title: "", content: "", tag: "" };

  const onSubmit = async (values: NoteFormValues, helpers: FormikHelpers<NoteFormValues>) => {
    await mutateAsync({ title: values.title.trim(), content: values.content.trim(), tag: values.tag as NoteTag });
    helpers.resetForm();
    onSuccess?.();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={Schema} onSubmit={onSubmit}>
      {({ isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" type="text" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="" disabled>Select tag…</option>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>Cancel</button>
            <button type="submit" className={css.submitButton} disabled={!isValid || isPending}>
              {isPending ? "Creating…" : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
