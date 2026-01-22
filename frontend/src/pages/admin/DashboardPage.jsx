import { useEffect, useState } from 'react'
import { FileText, MessageSquare, Users, CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules'
import api from '@/services/api'

function StatCard({ title, value, icon: Icon, description, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const actionLabels = {
  create: { label: 'Membuat', color: 'bg-green-100 text-green-700' },
  update: { label: 'Mengubah', color: 'bg-blue-100 text-blue-700' },
  delete: { label: 'Menghapus', color: 'bg-red-100 text-red-700' },
}

const resourceLabels = {
  complaint: 'Pengaduan',
  response: 'Respon',
  category: 'Kategori',
  user: 'User',
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    completedComplaints: 0,
    totalResponses: 0,
    pendingResponses: 0,
    totalUsers: 0,
  })
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch complaints
        const complaintsRes = await api.get('/complaint')
        const complaints = complaintsRes.data.data || []
        
        // Fetch users
        const usersRes = await api.get('/user')
        const users = usersRes.data.data || []

        // Fetch responses
        const responsesRes = await api.get('/response')
        const responses = responsesRes.data.data || []

        // Fetch activity logs
        const activityRes = await api.get('/activity?limit=10')
        setActivityLogs(activityRes.data.data || [])

        setStats({
          totalComplaints: complaints.length,
          pendingComplaints: complaints.filter(c => c.status !== 'completed').length,
          completedComplaints: complaints.filter(c => c.status === 'completed').length,
          totalResponses: responses.length,
          pendingResponses: responses.filter(r => r.progress < 100).length,
          totalUsers: users.length,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatTimeAgo = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Baru saja'
    if (minutes < 60) return `${minutes} menit lalu`
    if (hours < 24) return `${hours} jam lalu`
    return `${days} hari lalu`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan data sistem pengaduan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Pengaduan"
          value={stats.totalComplaints}
          icon={FileText}
          description="Semua pengaduan yang masuk"
          color="primary"
        />
        <StatCard
          title="Pengaduan Pending"
          value={stats.pendingComplaints}
          icon={Clock}
          description="Menunggu ditindaklanjuti"
          color="warning"
        />
        <StatCard
          title="Pengaduan Selesai"
          value={stats.completedComplaints}
          icon={CheckCircle}
          description="Sudah diselesaikan"
          color="success"
        />
        <StatCard
          title="Total Respon"
          value={stats.totalResponses}
          icon={MessageSquare}
          description="Respon yang diberikan"
          color="primary"
        />
        <StatCard
          title="Respon Pending"
          value={stats.pendingResponses}
          icon={AlertCircle}
          description="Belum selesai 100%"
          color="warning"
        />
        <StatCard
          title="Total User"
          value={stats.totalUsers}
          icon={Users}
          description="Pelapor terdaftar"
          color="primary"
        />
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada aktivitas
            </p>
          ) : (
            <div className="space-y-4">
              {activityLogs.map((log) => {
                const action = actionLabels[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-700' }
                const resource = resourceLabels[log.resource] || log.resource

                return (
                  <div key={log._id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {log.userName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">{log.userName}</span>
                        {' '}
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${action.color}`}>
                          {action.label}
                        </span>
                        {' '}
                        <span className="text-muted-foreground">{resource}:</span>
                        {' '}
                        <span className="text-foreground">{log.resourceName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(log.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
