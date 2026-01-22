import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Tag, FileImage, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules'
import { Button } from '@/components/atoms'
import api from '@/services/api'

const statusColors = {
  'pending': { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'in_progress': { label: 'Diproses', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  'completed': { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchData()
  }, [id])

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
  const StatusIcon = status.icon
  const latestResponse = responses[0]
  const progress = latestResponse?.progress || 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Detail */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-xl">Detail Pengaduan</CardTitle>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Kondisi/Waktu</p>
                    <p className="font-medium">{complaint.condition}</p>
                  </div>
                </div>
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
                Riwayat Tanggapan ({responses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {responses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada tanggapan dari admin
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
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <p className="font-bold text-primary">{res.progress}%</p>
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

        {/* Sidebar - Progress */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Progress Penanganan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${progress * 3.52} 352`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{progress}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${complaint.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' : 'bg-muted/50'}`}>
                  <Clock className={`w-5 h-5 ${complaint.status === 'pending' ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                  <span className={complaint.status === 'pending' ? 'font-medium' : 'text-muted-foreground'}>Menunggu</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${complaint.status === 'in_progress' ? 'bg-blue-50 border border-blue-200' : 'bg-muted/50'}`}>
                  <AlertCircle className={`w-5 h-5 ${complaint.status === 'in_progress' ? 'text-blue-600' : 'text-muted-foreground'}`} />
                  <span className={complaint.status === 'in_progress' ? 'font-medium' : 'text-muted-foreground'}>Diproses</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${complaint.status === 'completed' ? 'bg-green-50 border border-green-200' : 'bg-muted/50'}`}>
                  <CheckCircle className={`w-5 h-5 ${complaint.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span className={complaint.status === 'completed' ? 'font-medium' : 'text-muted-foreground'}>Selesai</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
