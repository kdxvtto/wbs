import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Upload, MapPin, FileText, Tag, Info, X, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules'
import { Button, Input, Label } from '@/components/atoms'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export default function ComplaintFormPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    location: '',
    condition: '',
    description: '',
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/category')
        setCategories(res.data.data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      alert('Maksimal 5 foto')
      return
    }
    
    setImages([...images, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('category', formData.category)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('condition', formData.condition)
      formDataToSend.append('description', formData.description)
      
      images.forEach((image) => {
        formDataToSend.append('image', image)
      })

      await api.post('/complaint', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setSuccess(true)
      setFormData({ category: '', location: '', condition: '', description: '' })
      setImages([])
      setPreviews([])
      
      setTimeout(() => {
        setSuccess(false)
        navigate('/my-reports/progress')
      }, 2000)
    } catch (error) {
      console.error('Error submitting complaint:', error)
      alert(error.response?.data?.message || 'Gagal mengirim pengaduan')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Pengaduan Terkirim!</h2>
            <p className="text-muted-foreground">
              Pengaduan Anda berhasil dikirim. Anda akan dialihkan ke halaman progress...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Formulir Pengaduan</h1>
        <p className="text-muted-foreground">Laporkan pelanggaran yang Anda ketahui</p>
      </div>

      {/* Info Box */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Panduan Pengisian:</p>
              <p>Pastikan informasi yang Anda berikan memenuhi unsur <strong>4W + 1H</strong>: What (Apa), Where (Di mana), When (Kapan), Who (Siapa), dan How (Bagaimana).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Form Pengaduan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Kategori Pelanggaran <span className="text-destructive">*</span>
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="flex h-11 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Lokasi Kejadian <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Masukkan lokasi kejadian (alamat, tempat, dll)"
                required
              />
            </div>

            {/* Condition (When) */}
            <div className="space-y-2">
              <Label htmlFor="condition" className="flex items-center gap-2">
                Kondisi/Waktu Kejadian <span className="text-destructive">*</span>
              </Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                placeholder="Kapan kejadian terjadi? (tanggal, waktu, periode)"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Deskripsi Pengaduan <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan secara detail apa yang terjadi, siapa yang terlibat, dan bagaimana kejadian tersebut terjadi..."
                rows={6}
                required
                className="flex w-full rounded-lg border border-input bg-transparent px-4 py-3 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimal 50 karakter. Semakin detail, semakin mudah ditindaklanjuti.
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Bukti Foto (Opsional, maks 5 foto)
              </Label>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG hingga 5MB
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  'Mengirim...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Pengaduan
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setFormData({ category: '', location: '', condition: '', description: '' })
                  setImages([])
                  setPreviews([])
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
