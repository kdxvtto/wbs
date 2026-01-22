import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, User, Tag, FileImage, MessageSquare, Send, Clock, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules'
import { Button, Input, Label, Badge } from '@/components/atoms'
import { ConfirmDialog } from '@/components/organisms'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

const statusColors = {
  'pending': { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  'in_progress': { label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
  'completed': { label: 'Selesai', color: 'bg-green-100 text-green-700' },
}

export default function DetailPengaduanPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isAdmin = ['Admin', 'Pimpinan', 'Staf'].includes(currentUser?.role)
  
  const [complaint, setComplaint] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [responseForm, setResponseForm] = useState({
    response: '',
    progress: 0,
    status: 'in_progress',
  })

  // Confirm dialog states
  const [deleteComplaintDialog, setDeleteComplaintDialog] = useState(false)
  const [deleteResponseDialog, setDeleteResponseDialog] = useState({ open: false, id: null })
  const [statusDialog, setStatusDialog] = useState({ open: false, status: null })
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    try {
      const [complaintRes, responsesRes] = await Promise.all([
        api.get(`/complaint/${id}`),
        api.get(`/response?idComplaint=${id}`),
      ])
      setComplaint(complaintRes.data.data)
      setResponses(responsesRes.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleSubmitResponse = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await api.post('/response', {
        idComplaint: id,
        ...responseForm,
      })
      
      if (responseForm.status === 'completed') {
        await api.put(`/complaint/${id}`, { status: 'completed' })
      } else if (responseForm.status === 'in_progress') {
        await api.put(`/complaint/${id}`, { status: 'in_progress' })
      }

      setResponseForm({ response: '', progress: 0, status: 'in_progress' })
      fetchData()
    } catch (error) {
      console.error('Error submitting response:', error)
      alert(error.response?.data?.message || 'Gagal mengirim respon')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    if (!isAdmin) {
      alert('Hanya Admin yang dapat mengubah status')
      return
    }
    setDeleting(true)
    try {
      await api.put(`/complaint/${id}`, { status: newStatus })
      fetchData()
      setStatusDialog({ open: false, status: null })
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Gagal mengubah status')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteComplaint = async () => {
    if (!isAdmin) return
    setDeleting(true)

    try {
      await api.delete(`/complaint/${id}`)
      navigate('/dashboard/pengaduan')
    } catch (error) {
      console.error('Error deleting complaint:', error)
      alert('Gagal menghapus pengaduan')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteResponse = async (responseId) => {
    if (!isAdmin) return
    setDeleting(true)

    try {
      await api.delete(`/response/${responseId}`)
      fetchData()
      setDeleteResponseDialog({ open: false, id: null })
    } catch (error) {
      console.error('Error deleting response:', error)
      alert('Gagal menghapus respon')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pengaduan tidak ditemukan</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Kembali
        </Button>
      </div>
    )
  }

  const status = statusColors[complaint.status] || statusColors.pending

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        {isAdmin && (
          <Button variant="destructive" size="sm" onClick={() => setDeleteComplaintDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Pengaduan
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Detail */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl mb-2">Detail Pengaduan</CardTitle>
                  <p className="text-sm text-muted-foreground font-mono">
                    ID: {complaint._id}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pelapor</p>
                    <p className="font-medium">{complaint.user?.name || 'Anonim'}</p>
                    <p className="text-xs text-muted-foreground">{complaint.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kategori</p>
                    <p className="font-medium">{complaint.category?.name || '-'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lokasi</p>
                    <p className="font-medium">{complaint.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Lapor</p>
                    <p className="font-medium">
                      {new Date(complaint.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Kondisi</h4>
                <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  {complaint.condition}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Deskripsi Pengaduan</h4>
                <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              {complaint.image && complaint.image.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <FileImage className="w-4 h-4" />
                    Bukti Foto ({complaint.image.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {complaint.image.map((img, index) => {
                      const imageUrl = img.startsWith('http') ? img : `http://localhost:3000${img}`
                      return (
                        <a 
                          key={index} 
                          href={imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="aspect-square rounded-lg overflow-hidden border border-border hover:opacity-80 transition-opacity"
                        >
                          <img 
                            src={imageUrl} 
                            alt={`Bukti ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Responses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Riwayat Respon ({responses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {responses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada respon
                </p>
              ) : (
                <div className="space-y-4">
                  {responses.map((res) => (
                    <div key={res._id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {res.idUser?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{res.idUser?.name || 'Admin'}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(res.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground">Progress</span>
                            <p className="font-bold text-primary">{res.progress}%</p>
                          </div>
                          {isAdmin && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeleteResponseDialog({ open: true, id: res._id })}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{res.response}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions - Only for Admin */}
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ubah Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant={complaint.status === 'pending' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setStatusDialog({ open: true, status: 'pending' })}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Menunggu
                </Button>
                <Button 
                  variant={complaint.status === 'in_progress' ? 'default' : 'outline'} 
                  className="w-full justify-start"
                  onClick={() => setStatusDialog({ open: true, status: 'in_progress' })}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Diproses
                </Button>
                <Button 
                  variant={complaint.status === 'completed' ? 'default' : 'outline'} 
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                  onClick={() => setStatusDialog({ open: true, status: 'completed' })}
                >
                  <span className="w-4 h-4 mr-2">✓</span>
                  Selesai
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Add Response - For All */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kirim Respon</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="response">Pesan Respon</Label>
                  <textarea
                    id="response"
                    value={responseForm.response}
                    onChange={(e) => setResponseForm({ ...responseForm, response: e.target.value })}
                    placeholder="Tulis respon untuk pengaduan ini..."
                    rows={4}
                    required
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress">Progress ({responseForm.progress}%)</Label>
                  <input
                    type="range"
                    id="progress"
                    min="0"
                    max="100"
                    step="10"
                    value={responseForm.progress}
                    onChange={(e) => setResponseForm({ ...responseForm, progress: parseInt(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={responseForm.status}
                    onChange={(e) => setResponseForm({ ...responseForm, status: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="pending">Menunggu</option>
                    <option value="in_progress">Diproses</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    'Mengirim...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Respon
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        open={deleteComplaintDialog}
        onOpenChange={setDeleteComplaintDialog}
        title="Hapus Pengaduan"
        description="Apakah Anda yakin ingin menghapus pengaduan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteComplaint}
      />

      <ConfirmDialog
        open={deleteResponseDialog.open}
        onOpenChange={(open) => setDeleteResponseDialog({ ...deleteResponseDialog, open })}
        title="Hapus Respon"
        description="Apakah Anda yakin ingin menghapus respon ini?"
        confirmText="Ya, Hapus"
        variant="danger"
        loading={deleting}
        onConfirm={() => handleDeleteResponse(deleteResponseDialog.id)}
      />

      <ConfirmDialog
        open={statusDialog.open}
        onOpenChange={(open) => setStatusDialog({ ...statusDialog, open })}
        title="Ubah Status"
        description={`Apakah Anda yakin ingin mengubah status pengaduan menjadi "${statusDialog.status === 'pending' ? 'Menunggu' : statusDialog.status === 'in_progress' ? 'Diproses' : 'Selesai'}"?`}
        confirmText="Ya, Ubah"
        variant="warning"
        loading={deleting}
        onConfirm={() => handleUpdateStatus(statusDialog.status)}
      />
    </div>
  )
}
