import { getSession } from "@void/auth";
import { Link } from "@repo/i18n/navigation";
import { UserNav } from "@/components/layout/user-nav";

export async function UserNavFetcher() {
  const session = await getSession();
  
  if (!session?.user) {
    return (
        <Link 
            href="/login" 
            className="text-sm font-medium hover:text-primary transition-colors"
        >
            Login
        </Link>
    );
  }

return <UserNav user={session.user} />;

}
