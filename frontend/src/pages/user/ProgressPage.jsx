import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Clock, CheckCircle, AlertCircle, FileText, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules'
import { Button, Input, Badge } from '@/components/atoms'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

const statusColors = {
  'pending': { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'in_progress': { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  'completed': { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

export default function ProgressPage() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaint')
        // Filter only user's own complaints - handle both populated and non-populated user
        const userComplaints = (res.data.data || []).filter(c => {
          const complaintUserId = c.user?._id || c.user
          return complaintUserId === user?._id
        })
        setComplaints(userComplaints)
      } catch (error) {
        console.error('Error fetching complaints:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [user])

  const filteredComplaints = complaints.filter(c =>
    c.description?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  )

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
        <h1 className="text-2xl font-bold text-foreground">Progress Pengaduan</h1>
        <p className="text-muted-foreground">Pantau status pengaduan yang telah Anda kirim</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {complaints.filter(c => c.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Menunggu</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {complaints.filter(c => c.status === 'in_progress').length}
              </p>
              <p className="text-sm text-muted-foreground">Diproses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {complaints.filter(c => c.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Selesai</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengaduan..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Belum Ada Pengaduan</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum mengirimkan pengaduan apapun.
            </p>
            <Link to="/my-reports">
              <Button>Buat Pengaduan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => {
            const status = statusColors[complaint.status] || statusColors.pending
            const StatusIcon = status.icon

            return (
              <Card key={complaint._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(complaint.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="font-medium text-foreground line-clamp-2 mb-1">
                        {complaint.description?.substring(0, 100)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        📍 {complaint.location}
                      </p>
                    </div>
                    <Link to={`/my-reports/detail/${complaint._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
