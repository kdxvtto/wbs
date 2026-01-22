import { useEffect, useState } from 'react'
import { Trash2, Plus, Search, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/molecules'
import { Button, Input, Label, Badge } from '@/components/atoms'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, ConfirmDialog } from '@/components/organisms'
import { useAuth } from '@/context/AuthContext'
import api from '@/services/api'

const roleColors = {
  'Admin': 'bg-red-100 text-red-700',
  'Pimpinan': 'bg-purple-100 text-purple-700',
  'Staf': 'bg-blue-100 text-blue-700',
  'Nasabah': 'bg-green-100 text-green-700',
}

export default function UserPage() {
  const { user: currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'Admin'
  
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState('Nasabah')
  const [formData, setFormData] = useState({
    nik: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    username: '',
    role: 'Staf',
  })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, type: null, name: '' })
  const [deleting, setDeleting] = useState(false)

  const fetchData = async () => {
    try {
      const usersRes = await api.get('/user')
      // All users are in /user endpoint (both admin and nasabah)
      setUsers(usersRes.data.data || [])
      setAdmins([]) // No separate admin endpoint
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // All users come from /user endpoint with role already set
  const allUsers = users.map(u => ({
    ...u,
    type: u.role === 'Nasabah' ? 'user' : 'admin'
  }))

  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.nik?.includes(search)
  )

  const openAddDialog = () => {
    setSelectedRole('Nasabah')
    setFormData({
      nik: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      username: '',
      role: 'Staf',
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (selectedRole === 'Nasabah') {
        await api.post('/user', {
          nik: formData.nik,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'Nasabah',
        })
      } else {
        await api.post('/user', {
          name: formData.name,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        })
      }
      setDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error adding user:', error)
      alert(error.response?.data?.message || 'Gagal menambahkan user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleting(true)
    try {
      // All users are deleted via /user endpoint
      await api.delete(`/user/${id}`)
      fetchData()
      setDeleteDialog({ open: false, id: null, type: null, name: '' })
    } catch (error) {
      console.error('Error deleting user:', error)
      alert(error.response?.data?.message || 'Gagal menghapus user')
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
          <h1 className="text-2xl font-bold text-foreground">Daftar User</h1>
          <p className="text-muted-foreground">Kelola pengguna sistem</p>
        </div>
        {isAdmin && (
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        )}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari berdasarkan nama, email, username, atau NIK..." 
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
                <th className="text-left p-4 font-medium text-muted-foreground">Nama</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Username/Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Terdaftar</th>
                {isAdmin && (
                  <th className="text-left p-4 font-medium text-muted-foreground">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-muted-foreground">
                    Tidak ada user
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground">{index + 1}</td>
                    <td className="p-4 font-medium text-foreground">{user.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {user.type === 'admin' ? user.username : user.email}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    {isAdmin && (
                      <td className="p-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeleteDialog({ open: true, id: user._id, type: user.type, name: user.name })} 
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Dialog - Only for Admin */}
      {isAdmin && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Tipe User</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Nasabah')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedRole === 'Nasabah' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    Nasabah (Pelapor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Admin')}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedRole !== 'Nasabah' 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    Admin/Staf
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              {selectedRole === 'Nasabah' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK (16 digit)</Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      placeholder="Masukkan NIK"
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Masukkan email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Masukkan no. telepon"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Staf">Staf</option>
                      <option value="Pimpinan">Pimpinan</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Masukkan password"
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
        title="Hapus User"
        description={`Apakah Anda yakin ingin menghapus user "${deleteDialog.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        variant="danger"
        loading={deleting}
        onConfirm={() => handleDelete(deleteDialog.id)}
      />
    </div>
  )
}
