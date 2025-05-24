import DashboardWrapper from "@/components/dashboard/wrapper";
import UserForm from "@/components/ui/user-form";
import { getUserProfile } from "@/server/users";

export default async function AccountPage() {
  const userProfile = await getUserProfile();

  return (
    <DashboardWrapper
      breadcrumb={[{ title: "Account", href: "/dashboard/account" }]}
    >
      <UserForm defaultValues={userProfile} />
    </DashboardWrapper>
  );
}
