import { getCurrentEmployer } from "@/lib/demo";
import { logoUrl } from "../ui";
import { CompanyForm } from "./CompanyForm";

export const metadata = { title: "Company profile" };

export default async function CompanyPage() {
  const { company, email } = await getCurrentEmployer();
  return (
    <>
      <section className="em-head">
        <div className="em-wrap">
          <h1 className="em-h1">Company profile</h1>
          <p className="em-lede">How your company appears to job seekers on every post. Demo account: {email}.</p>
        </div>
      </section>
      <div className="em-wrap em-body">
        <CompanyForm
          initial={{
            name: company.name,
            description: company.description ?? "",
            website: company.website ?? "",
            logoUrl: company.logo_path ? logoUrl(company.logo_path) : null,
          }}
        />
      </div>
    </>
  );
}
