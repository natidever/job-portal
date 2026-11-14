import { JobEditor } from "../JobEditor";

export const metadata = { title: "Post a job" };

export default function NewJobPage() {
  return <JobEditor mode="new" back={{ href: "/employer/jobs", label: "My posts" }} />;
}
