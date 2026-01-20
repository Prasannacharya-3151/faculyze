import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { FileText, Upload, FolderOpen, TrendingUp } from "lucide-react"

export default function DashboardPage() {

  // 🔴 TEMP DATA (API WILL COME LATER)
  // TODO: Replace this with API response
  const stats = [
    {
      title: "Total Documents",
      value: "24",
      icon: FileText,
      description: "+12% from last month",
    },
    {
      title: "Uploaded This Week",
      value: "8",
      icon: Upload,
      description: "+3 from last week",
    },
    {
      title: "Storage Used",
      value: "2.4 GB",
      icon: FolderOpen,
      description: "of 10 GB available",
    },
    {
      title: "Active Shares",
      value: "12",
      icon: TrendingUp,
      description: "+2 new shares",
    },
  ]

  // 🔴 TEMP DATA (API WILL COME LATER)
  // TODO: Fetch recent activity from backend
  const recentActivity = [
    { action: "Uploaded", document: "Annual Report 2024.pdf", time: "2 hours ago" },
    { action: "Modified", document: "Project Proposal.docx", time: "5 hours ago" },
    { action: "Shared", document: "Marketing Strategy.pdf", time: "1 day ago" },
    { action: "Uploaded", document: "Team Photo.jpg", time: "2 days ago" },
    { action: "Deleted", document: "Old Invoice.pdf", time: "3 days ago" },
  ]

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your documents.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="
              border-border bg-transparent transition shadow-hover:shadow-lg hover:scale-[1.02] rounded-3xl shadow-md
            "
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                {stat.title}
              </CardTitle>

              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      {/* <Card
        className="
           border-border bg-transparent transition shadow-hover:shadow-4xl rounded-3xl
        "
      >
        <CardHeader>
          <CardTitle className="text-foreground">
            Recent Activity
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Your latest document actions and updates
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="
                  flex items-center justify-between
                  border-b border-border
                  last:border-0
                  pb-4 last:pb-0
                "
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    <span className="text-primary">
                      {activity.action}
                    </span>{" "}
                    {activity.document}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
