import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/molecules'
import { Button, Input, Badge } from '@/components/atoms'
import api from '@/services/api'

export default function LaporanPengaduanPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaint')
        // Filter only completed complaints
        const completedComplaints = (res.data.data || []).filter(c => c.status === 'completed')
        setComplaints(completedComplaints)
      } catch (error) {
        console.error('Error fetching complaints:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Laporan Pengaduan</h1>
          <p className="text-muted-foreground">Pengaduan yang sudah selesai</p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari berdasarkan deskripsi atau lokasi..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">No</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Deskripsi</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Kategori</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Selesai Pada</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Tidak ada laporan pengaduan selesai
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint, index) => (
                  <tr key={complaint._id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground">{index + 1}</td>
                    <td className="p-4">
                      <p className="font-medium text-foreground line-clamp-2">{complaint.description?.substring(0, 80)}...</p>
                      <p className="text-sm text-muted-foreground">📍 {complaint.location}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">{complaint.category?.name || '-'}</td>
                    <td className="p-4">
                      <Badge variant="success" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selesai
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(complaint.updatedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <Link to={`/dashboard/pengaduan/${complaint._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
