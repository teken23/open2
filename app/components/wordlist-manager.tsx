
'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, List, Download, Trash2, FileText, Users, Key, Mail, Phone } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function WordlistManager() {
  const [wordlists, setWordlists] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null as File | null,
    type: 'combo', // combo, usernames, passwords, emails, custom
    format: 'email:password',
    separator: ':',
    preview: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      file: null,
      type: 'combo',
      format: 'email:password',
      separator: ':',
      preview: ''
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const preview = lines.slice(0, 10).join('\n')
      
      setFormData({
        ...formData,
        file,
        name: formData.name || file.name.replace(/\.[^/.]+$/, ""),
        preview
      })
    }
  }

  const generateSampleWordlist = (type: string, format: string): string => {
    const comboSamples = {
      'email:password': 'admin@test.com:123456\nuser@domain.com:password123\ntest@email.com:qwerty\njohn.doe@company.com:admin2024',
      'username:password': 'admin:123456\nuser:password123\ntest:qwerty\njohndoe:admin2024',
      'phone:password': '+1234567890:123456\n+0987654321:password123\n+1122334455:qwerty'
    }
    
    const otherSamples = {
      usernames: 'admin\nuser\ntest\njohndoe\nadministrator\nroot\nguest',
      passwords: '123456\npassword\npassword123\nqwerty\nadmin\n123456789\nletmein',
      emails: 'admin@test.com\nuser@domain.com\ntest@email.com\njohn.doe@company.com'
    }
    
    if (type === 'combo') {
      return comboSamples[format as keyof typeof comboSamples] || comboSamples['email:password']
    }
    
    return otherSamples[type as keyof typeof otherSamples] || ''
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUpload = async () => {
    if (!formData.file && !formData.preview) return
    
    setUploading(true)
    try {
      let content = formData.preview
      let filename = formData.name + '.txt'
      let size = new Blob([content]).size
      
      if (formData.file) {
        content = await formData.file.text()
        filename = formData.file.name
        size = formData.file.size
      }
      
      const lines = content.split('\n').filter(line => line.trim())
      
      const newWordlist = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        filename: filename,
        size: size,
        lineCount: lines.length,
        type: formData.type,
        format: formData.format,
        separator: formData.separator,
        content: content,
        preview: lines.slice(0, 5).join('\n'),
        createdAt: new Date()
      }
      
      setWordlists([...wordlists, newWordlist])
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error uploading wordlist:', error)
    } finally {
      setUploading(false)
    }
  }

  const createSampleWordlist = () => {
    const sample = generateSampleWordlist(formData.type, formData.format)
    setFormData({
      ...formData,
      preview: sample,
      name: formData.name || `Sample ${formData.type} list`
    })
  }

  const handleDelete = (id: string) => {
    setWordlists(wordlists.filter(wordlist => wordlist.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Wordlists</h2>
          <p className="text-muted-foreground">Sube y gestiona listas de palabras para testing</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Gestionar Wordlists
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Gestión Avanzada de Wordlists
              </DialogTitle>
              <DialogDescription>
                Crea o sube wordlists para testing masivo de combos
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Subir Archivo</TabsTrigger>
                <TabsTrigger value="create">Crear Manual</TabsTrigger>
              </TabsList>
              
              {/* Upload Tab */}
              <TabsContent value="upload" className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="combo">Combos (usuario:contraseña)</SelectItem>
                      <SelectItem value="usernames">Solo Usuarios</SelectItem>
                      <SelectItem value="passwords">Solo Contraseñas</SelectItem>
                      <SelectItem value="emails">Solo Emails</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'combo' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Formato</Label>
                      <Select
                        value={formData.format}
                        onValueChange={(value) => setFormData({...formData, format: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email:password">email:password</SelectItem>
                          <SelectItem value="username:password">username:password</SelectItem>
                          <SelectItem value="phone:password">phone:password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Separador</Label>
                      <Input
                        className="col-span-3"
                        value={formData.separator}
                        onChange={(e) => setFormData({...formData, separator: e.target.value})}
                        placeholder=":"
                      />
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Nombre</Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Mi lista de combos"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">Archivo</Label>
                  <Input
                    id="file"
                    ref={fileInputRef}
                    type="file"
                    className="col-span-3"
                    accept=".txt,.csv,.lst"
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Descripción</Label>
                  <Input
                    className="col-span-3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descripción de la wordlist"
                  />
                </div>

                {formData.preview && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preview (primeras 10 líneas):</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <pre className="text-xs whitespace-pre-wrap">{formData.preview}</pre>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Create Manual Tab */}
              <TabsContent value="create" className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({...formData, type: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="combo">Combos (usuario:contraseña)</SelectItem>
                      <SelectItem value="usernames">Solo Usuarios</SelectItem>
                      <SelectItem value="passwords">Solo Contraseñas</SelectItem>
                      <SelectItem value="emails">Solo Emails</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Nombre</Label>
                  <Input
                    className="col-span-3"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Mi lista personalizada"
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="text-right">
                    <Label className="text-sm font-medium">Contenido</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs" 
                      onClick={createSampleWordlist}
                    >
                      Generar Ejemplo
                    </Button>
                  </div>
                  <Textarea
                    className="col-span-3 h-48 font-mono text-sm"
                    value={formData.preview}
                    onChange={(e) => setFormData({...formData, preview: e.target.value})}
                    placeholder={`Escribe o pega tu wordlist aquí...\n\nEjemplo para combos:\nadmin@test.com:123456\nuser@domain.com:password123\ntest@email.com:qwerty`}
                  />
                </div>

                <div className="col-span-4">
                  <Label className="text-sm font-medium">Formatos soportados:</Label>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted rounded-md">
                      <div className="font-mono text-xs">
                        <div className="font-semibold mb-1">📧 Email:Password</div>
                        admin@test.com:123456<br/>
                        user@domain.com:password123
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="font-mono text-xs">
                        <div className="font-semibold mb-1">👤 Username:Password</div>
                        admin:123456<br/>
                        user:password123
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => {setIsDialogOpen(false); resetForm()}}>
                Cancelar
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={(!formData.file && !formData.preview) || uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? 'Procesando...' : (formData.file ? 'Subir' : 'Crear')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Wordlists Grid */}
      <div className="grid gap-4">
        {wordlists.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay wordlists</h3>
              <p className="text-muted-foreground text-center mb-4">
                Sube tu primera wordlist de combos para empezar a hacer testing masivo
              </p>
              <div className="text-xs text-muted-foreground text-center mb-4">
                💡 Formatos: email:password, username:password, phone:password
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Gestionar Wordlists
              </Button>
            </CardContent>
          </Card>
        ) : (
          wordlists.map((wordlist) => (
            <Card key={wordlist.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      {wordlist.type === 'combo' ? <Users className="h-4 w-4" /> : 
                       wordlist.type === 'emails' ? <Mail className="h-4 w-4" /> :
                       wordlist.type === 'passwords' ? <Key className="h-4 w-4" /> :
                       wordlist.type === 'phone' ? <Phone className="h-4 w-4" /> :
                       <List className="h-4 w-4" />}
                      {wordlist.name}
                      <Badge variant="outline">{wordlist.type}</Badge>
                      {wordlist.format && <Badge variant="secondary">{wordlist.format}</Badge>}
                    </CardTitle>
                    <CardDescription>{wordlist.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(wordlist.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Archivo: {wordlist.filename}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">
                          {formatFileSize(wordlist.size)}
                        </Badge>
                        <Badge variant="outline">
                          {wordlist.lineCount?.toLocaleString()} combos
                        </Badge>
                        {wordlist.separator && (
                          <Badge variant="outline">
                            Sep: '{wordlist.separator}'
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-right">
                      <div>Creado: {new Date(wordlist.createdAt).toLocaleDateString()}</div>
                      <div className="mt-1">Tipo: {wordlist.type}</div>
                    </div>
                  </div>
                  
                  {wordlist.preview && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Vista previa:</Label>
                      <div className="p-2 bg-muted rounded-md">
                        <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                          {wordlist.preview}
                          {wordlist.lineCount > 5 && '\n...'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
