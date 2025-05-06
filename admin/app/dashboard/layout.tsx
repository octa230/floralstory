'use client'

import { userStore } from "@/Store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user } = userStore()

  // Protect dashboard routes
  useEffect(() => {
    if (!user?.token) {
      router.push('/')
    }
  }, [user])

  return (
    <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
      <main className="content-area">
        {children}
      </main>
    </div>
  )
}