import { redirect } from "next/navigation";
import { getMyPost } from "@/lib/data/employer";
import { JobEditor } from "../../JobEditor";

export const metadata = { title: "Edit post" };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { post } = await getMyPost(id);
  // Only drafts and rejected posts are editable; live, pending and closed posts are locked.
  if (post.status !== "draft" && post.status !== "rejected") redirect(`/employer/jobs/${post.id}?locked=1`);

  return (
    <JobEditor
      mode={post.status}
      rejectionReason={post.rejection_reason}
      back={{ href: `/employer/jobs/${post.id}`, label: post.title }}
      initial={{
        id: post.id,
        title: post.title,
        category_id: post.category_id,
        city_id: post.city_id,
        area: post.area ?? "",
        job_type: post.job_type,
        workplace_type: post.workplace_type,
        experience_level: post.experience_level,
        positions: post.positions,
        salary_min: post.salary_min,
        salary_max: post.salary_max,
        salary_note: post.salary_note ?? "",
        description: post.description,
        qualification: post.qualification,
        experience: post.experience,
        duties: post.duties,
        deadline: post.deadline,
      }}
    />
  );
}
