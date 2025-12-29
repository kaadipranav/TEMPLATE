import { Spinner } from "@/components/ui/spinner"

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  )
}

