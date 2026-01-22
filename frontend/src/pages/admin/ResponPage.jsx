import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search, MessageSquare, Plus, Send, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/molecules'
import { Button, Input, Label, Badge } from '@/components/atoms'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/organisms'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export default function ResponPage() {
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'Admin'
  
  const [responses, setResponses] = useState([])
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    idComplaint: '',
    response: '',
    progress: 0,
    status: 'in_progress',
  })

  const fetchData = async () => {
    try {
      const [responsesRes, complaintsRes] = await Promise.all([
        api.get('/response'),
        api.get('/complaint'),
      ])
      // Show all responses
      setResponses(responsesRes.data.data || [])
      const activeComplaints = (complaintsRes.data.data || []).filter(c => c.status !== 'completed')
      setComplaints(activeComplaints)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredResponses = responses.filter(r => 
    r.idComplaint?.description?.toLowerCase().includes(search.toLowerCase()) ||
    r.idComplaint?._id?.includes(search)
  )

  const openAddDialog = () => {
    setFormData({ idComplaint: '', response: '', progress: 0, status: 'in_progress' })
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/response', formData)
      
      if (formData.status === 'completed') {
        await api.put(`/complaint/${formData.idComplaint}`, { status: 'completed' })
      } else if (formData.status === 'in_progress') {
        await api.put(`/complaint/${formData.idComplaint}`, { status: 'in_progress' })
      }

      setDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error adding response:', error)
      alert(error.response?.data?.message || 'Gagal menambahkan respon')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus respon ini?')) return

    try {
      await api.delete(`/response/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting response:', error)
      alert(error.response?.data?.message || 'Gagal menghapus respon')
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daftar Respon</h1>
          <p className="text-muted-foreground">Respon yang belum selesai</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Respon
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari berdasarkan ID pengaduan..." 
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
                <th className="text-left p-4 font-medium text-muted-foreground">Tanggal</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Tidak ada respon pending
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
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${response.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{response.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(response.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Link to={`/dashboard/pengaduan/${response.idComplaint?._id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(response._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Response Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Respon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idComplaint">Pilih Pengaduan</Label>
              <select
                id="idComplaint"
                value={formData.idComplaint}
                onChange={(e) => setFormData({ ...formData, idComplaint: e.target.value })}
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">-- Pilih Pengaduan --</option>
                {complaints.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.description?.substring(0, 50)}... ({c.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="response">Pesan Respon</Label>
              <textarea
                id="response"
                value={formData.response}
                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                placeholder="Tulis respon untuk pengaduan ini..."
                rows={4}
                required
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
              <input
                type="range"
                id="progress"
                min="0"
                max="100"
                step="10"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="pending">Menunggu</option>
                <option value="in_progress">Diproses</option>
                <option value="completed">Selesai</option>
              </select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Mengirim...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
