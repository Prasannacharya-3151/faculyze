import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { FileText, Upload, Clock, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Documents",
      value: "24",
      icon: FileText,
      description: "Across all departments",
    },
    {
      title: "Uploaded This Week",
      value: "8",
      icon: Upload,
      description: "+3 from last week",
    },
  ]

  const quickActions = [
    {
      title: "Upload New Document",
      description: "Share notes and materials",
      icon: Upload,
      path: "/upload",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Recent Uploads",
      description: "View your latest files",
      icon: Clock,
      path: "/uploaded",
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      title: "Team Documents",
      description: "Collaborate with faculty",
      icon: Users,
      path: "/uploaded",
      color: "text-accent",
      bg: "bg-accent/10"
    }
  ]

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground font-heading">
          Print Hub Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back to <span className="text-primary font-semibold">Lorenta Technology</span> • Manage your print documents
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="
              border-border bg-card transition-all duration-300
              hover:shadow-lg hover:scale-[1.02] rounded-3xl shadow-md
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

      {/* QUICK ACTIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground font-heading">
            Quick Actions
          </h2>
          <span className="text-xs text-muted-foreground bg-muted/20 px-3 py-1 rounded-full">
            Print Hub v1.0
          </span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="
                  group relative overflow-hidden
                  flex flex-col items-start p-5
                  bg-card border border-border
                  rounded-2xl shadow-sm
                  hover:shadow-md hover:border-primary/30
                  transition-all duration-300
                "
              >
                <div className={`p-3 rounded-full ${action.bg} ${action.color} mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {action.title}
                </h3>
                <p className="text-xs text-muted-foreground text-left">
                  {action.description}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/0 group-hover:bg-primary/50 transition-all duration-300" />
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER / SYSTEM STATUS */}
      <div className="pt-6 mt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">LT</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary/20 border-2 border-background flex items-center justify-center">
                <span className="text-xs font-semibold text-secondary">PH</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Lorenta Technology • Print Hub
              </p>
              <p className="text-xs text-muted-foreground">
                Secure document management system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs text-muted-foreground">
              System operational
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}