
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, Shield, Edit, Trash2, Save, TestTube } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function ProxySettings() {
  const [proxies, setProxies] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProxy, setEditingProxy] = useState<any>(null)
  const [testing, setTesting] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: '',
    type: 'HTTP',
    username: '',
    password: '',
    enabled: false
  })

  const resetForm = () => {
    setFormData({
      name: '',
      host: '',
      port: '',
      type: 'HTTP',
      username: '',
      password: '',
      enabled: false
    })
    setEditingProxy(null)
  }

  const handleSave = async () => {
    try {
      const newProxy = {
        id: Date.now().toString(),
        ...formData,
        port: parseInt(formData.port),
        createdAt: new Date(),
        working: null // Will be set after testing
      }
      
      setProxies([...proxies, newProxy])
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving proxy:', error)
    }
  }

  const handleDelete = (id: string) => {
    setProxies(proxies.filter(proxy => proxy.id !== id))
  }

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    setProxies(proxies.map(proxy => 
      proxy.id === id ? { ...proxy, enabled } : proxy
    ))
  }

  const handleTest = async (id: string) => {
    setTesting(id)
    // Mock test
    setTimeout(() => {
      const isWorking = Math.random() > 0.3 // 70% chance of working
      setProxies(proxies.map(proxy => 
        proxy.id === id ? { ...proxy, working: isWorking, lastTested: new Date() } : proxy
      ))
      setTesting(null)
    }, 2000)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'HTTP': return 'default'
      case 'HTTPS': return 'secondary'
      case 'SOCKS4': return 'outline'
      case 'SOCKS5': return 'destructive'
      default: return 'default'
    }
  }

  const getWorkingStatus = (proxy: any) => {
    if (proxy.working === null) return 'No probado'
    if (proxy.working === true) return 'Funcionando'
    return 'No funciona'
  }

  const getWorkingColor = (proxy: any) => {
    if (proxy.working === null) return 'secondary'
    if (proxy.working === true) return 'default'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configuración de Proxies</h2>
          <p className="text-muted-foreground">Gestiona proxies para el testing de APIs</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Añadir Proxy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProxy ? 'Editar Proxy' : 'Nuevo Proxy'}
              </DialogTitle>
              <DialogDescription>
                Configura un servidor proxy para enrutar las peticiones
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Mi Proxy"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HTTP">HTTP</SelectItem>
                    <SelectItem value="HTTPS">HTTPS</SelectItem>
                    <SelectItem value="SOCKS4">SOCKS4</SelectItem>
                    <SelectItem value="SOCKS5">SOCKS5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="host" className="text-right">Host</Label>
                <Input
                  id="host"
                  className="col-span-3"
                  value={formData.host}
                  onChange={(e) => setFormData({...formData, host: e.target.value})}
                  placeholder="proxy.ejemplo.com"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="port" className="text-right">Puerto</Label>
                <Input
                  id="port"
                  type="number"
                  className="col-span-3"
                  value={formData.port}
                  onChange={(e) => setFormData({...formData, port: e.target.value})}
                  placeholder="8080"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Usuario</Label>
                <Input
                  id="username"
                  className="col-span-3"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Usuario (opcional)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  className="col-span-3"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Contraseña (opcional)"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enabled" className="text-right">Habilitado</Label>
                <div className="col-span-3">
                  <Switch
                    checked={formData.enabled}
                    onCheckedChange={(enabled) => setFormData({...formData, enabled})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Proxies List */}
      <div className="grid gap-4">
        {proxies.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay proxies configurados</h3>
              <p className="text-muted-foreground text-center mb-4">
                Los proxies pueden ayudar a evitar limitaciones de rate limiting
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Primer Proxy
              </Button>
            </CardContent>
          </Card>
        ) : (
          proxies.map((proxy) => (
            <Card key={proxy.id} className={proxy.enabled ? 'border-green-200' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {proxy.name}
                      <Badge variant={getTypeColor(proxy.type)}>{proxy.type}</Badge>
                      <Badge variant={getWorkingColor(proxy)}>
                        {getWorkingStatus(proxy)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {proxy.host}:{proxy.port}
                      {proxy.username && ` (${proxy.username})`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={proxy.enabled}
                      onCheckedChange={(enabled) => handleToggleEnabled(proxy.id, enabled)}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleTest(proxy.id)}
                      disabled={testing === proxy.id}
                    >
                      <TestTube className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(proxy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex space-x-4">
                    <span>Estado: {proxy.enabled ? 'Habilitado' : 'Deshabilitado'}</span>
                    {proxy.lastTested && (
                      <span>Último test: {new Date(proxy.lastTested).toLocaleTimeString()}</span>
                    )}
                  </div>
                  {testing === proxy.id && (
                    <span className="text-muted-foreground">Probando...</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Información sobre Proxies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Los proxies ayudan a evitar la detección y limitaciones de rate limiting</p>
          <p>• Se pueden usar múltiples proxies rotándolos automáticamente</p>
          <p>• Tipos soportados: HTTP, HTTPS, SOCKS4, SOCKS5</p>
          <p>• Las credenciales de autenticación son opcionales según el proxy</p>
        </CardContent>
      </Card>
    </div>
  )
}
