import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/molecules'
import { Button, Input, Badge } from '@/components/atoms'
import api from '@/services/api'

export default function LaporanResponPage() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await api.get('/response')
        // Filter responses where complaint status is completed
        const completedResponses = (res.data.data || []).filter(r => 
          r.idComplaint?.status === 'completed'
        )
        setResponses(completedResponses)
      } catch (error) {
        console.error('Error fetching responses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResponses()
  }, [])

  const filteredResponses = responses.filter(r => 
    r.idComplaint?.description?.toLowerCase().includes(search.toLowerCase()) ||
    r.idComplaint?._id?.includes(search)
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
          <h1 className="text-2xl font-bold text-foreground">Laporan Respon</h1>
          <p className="text-muted-foreground">Respon yang sudah selesai (100%)</p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari berdasarkan judul pengaduan..." 
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
                <th className="text-left p-4 font-medium text-muted-foreground">ID Pengaduan</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Pengaduan</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Pesan</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Progress</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Selesai Pada</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Tidak ada laporan respon selesai
                  </td>
                </tr>
              ) : (
                filteredResponses.map((response) => (
                  <tr key={response._id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {response.idComplaint?._id?.slice(-8) || '-'}
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground line-clamp-1 max-w-xs">
                        {response.idComplaint?.description?.substring(0, 50) || '-'}...
                      </p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <p className="line-clamp-1 max-w-xs">{response.response}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant="success" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {response.progress || 100}%
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(response.updatedAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <Link to={`/dashboard/pengaduan/${response.idComplaint?._id}`}>
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
