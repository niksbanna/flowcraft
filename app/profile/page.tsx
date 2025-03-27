import type { Metadata } from "next"
import { UserProfile } from "@/components/user-profile"

export const metadata: Metadata = {
  title: "User Profile | Workflow Platform",
  description: "Manage your profile, integrations, and preferences",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <UserProfile />
    </div>
  )
}

