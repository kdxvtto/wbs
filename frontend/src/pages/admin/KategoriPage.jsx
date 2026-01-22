import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/molecules'
import { Button, Input, Label } from '@/components/atoms'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ConfirmDialog } from '@/components/organisms'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

export default function KategoriPage() {
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'Admin'
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '' })
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' })
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await api.get('/category')
      setCategories(res.data.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  )

  const openAddDialog = () => {
    setEditMode(false)
    setSelectedCategory(null)
    setFormData({ name: '' })
    setDialogOpen(true)
  }

  const openEditDialog = (category) => {
    setEditMode(true)
    setSelectedCategory(category)
    setFormData({ name: category.name })
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editMode) {
        await api.put(`/category/${selectedCategory._id}`, formData)
      } else {
        await api.post('/category', formData)
      }
      setDialogOpen(false)
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert(error.response?.data?.message || 'Gagal menyimpan kategori')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      await api.delete(`/category/${id}`)
      fetchCategories()
      setDeleteDialog({ open: false, id: null, name: '' })
    } catch (error) {
      console.error('Error deleting category:', error)
      alert(error.response?.data?.message || 'Gagal menghapus kategori')
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kategori Pengaduan</h1>
          <p className="text-muted-foreground">Kelola kategori pengaduan</p>
        </div>
        {isAdmin && (
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari kategori..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
                <th className="text-left p-4 font-medium text-muted-foreground">Nama Kategori</th>
                {isAdmin && (
                  <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 3 : 2} className="p-8 text-center text-muted-foreground">
                    Tidak ada kategori
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr key={category._id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground">{index + 1}</td>
                    <td className="p-4 font-medium text-foreground">{category.name}</td>
                    {isAdmin && (
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(category)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteDialog({ open: true, id: category._id, name: category.name })} className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Dialog - Only for Admin */}
      {isAdmin && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama kategori"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteDialog.name}"?`}
        confirmText="Ya, Hapus"
        variant="danger"
        loading={deleting}
        onConfirm={() => handleDelete(deleteDialog.id)}
      />
    </div>
  )
}
