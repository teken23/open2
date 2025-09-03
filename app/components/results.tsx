
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BarChart3, Download, Eye, Filter, Trash2, CheckCircle, Copy, Users, Target, Clock, Globe } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface ValidCombo {
  id: string
  combo: string
  username: string
  password: string
  responseCode: number
  responseTime: number
  timestamp: Date
  responseData: any
  apiEndpoint: string
  configName: string
}

export function Results() {
  const [sessions] = useState<any[]>([
    {
      id: '1',
      name: 'Demo Session - Login Testing',
      configName: 'Demo API Config',
      endpoint: 'https://demo-api.example.com/login',
      createdAt: new Date(),
      totalTested: 1000,
      validFound: 12,
      duration: '2m 34s',
      status: 'completed'
    }
  ])
  const [selectedSession, setSelectedSession] = useState('1')
  
  // Mock valid combos found
  const [validCombos] = useState<ValidCombo[]>([
    {
      id: '1',
      combo: 'admin@test.com:123456',
      username: 'admin@test.com',
      password: '123456',
      responseCode: 200,
      responseTime: 342,
      timestamp: new Date(Date.now() - 60000),
      responseData: { success: true, token: 'jwt_token_here', role: 'admin' },
      apiEndpoint: 'https://demo-api.example.com/login',
      configName: 'Demo API Config'
    },
    {
      id: '2',
      combo: 'user@domain.com:password123',
      username: 'user@domain.com',
      password: 'password123',
      responseCode: 200,
      responseTime: 278,
      timestamp: new Date(Date.now() - 120000),
      responseData: { success: true, token: 'jwt_token_user', role: 'user' },
      apiEndpoint: 'https://demo-api.example.com/login',
      configName: 'Demo API Config'
    },
    {
      id: '3',
      combo: 'test@email.com:qwerty',
      username: 'test@email.com',
      password: 'qwerty',
      responseCode: 200,
      responseTime: 298,
      timestamp: new Date(Date.now() - 180000),
      responseData: { success: true, token: 'jwt_token_test', role: 'user' },
      apiEndpoint: 'https://demo-api.example.com/login',
      configName: 'Demo API Config'
    }
  ])
  
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleExport = () => {
    const dataToExport = validCombos.map(combo => ({
      username: combo.username,
      password: combo.password,
      combo: combo.combo,
      responseCode: combo.responseCode,
      responseTime: combo.responseTime,
      timestamp: combo.timestamp.toISOString(),
      apiEndpoint: combo.apiEndpoint
    }))
    
    const jsonData = JSON.stringify(dataToExport, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valid-combos-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportTxt = () => {
    const txtData = validCombos.map(combo => combo.combo).join('\n')
    const blob = new Blob([txtData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valid-combos-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredCombos = validCombos.filter(combo => 
    combo.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    combo.password.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Combos Válidos Encontrados</h2>
          <p className="text-muted-foreground">Credenciales válidas detectadas durante el testing</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportTxt} disabled={validCombos.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar TXT
          </Button>
          <Button onClick={handleExport} disabled={validCombos.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar JSON
          </Button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay resultados</h3>
            <p className="text-muted-foreground text-center mb-4">
              Ejecuta algunos tests para ver los combos válidos aquí
            </p>
            <div className="text-xs text-muted-foreground text-center">
              💡 Los combos válidos se mostrarán automáticamente cuando sean detectados
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Session Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sesiones de Testing
              </CardTitle>
              <CardDescription>Historial de ejecuciones y combos válidos encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {session.name}
                        <Badge variant="secondary">{session.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.configName} • {session.endpoint}
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span>📊 {session.totalTested?.toLocaleString()} testeados</span>
                        <span className="text-green-600">✅ {session.validFound} válidos</span>
                        <span>⏱️ {session.duration}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Valid Combos Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Combos Válidos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{validCombos.length}</div>
                <p className="text-xs text-muted-foreground">Credenciales encontradas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios Únicos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(validCombos.map(c => c.username)).size}
                </div>
                <p className="text-xs text-muted-foreground">Usuarios diferentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {validCombos.length ? Math.round(validCombos.reduce((acc, c) => acc + c.responseTime, 0) / validCombos.length) : 0}ms
                </div>
                <p className="text-xs text-muted-foreground">Respuesta media</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">APIs Testeadas</CardTitle>
                <Globe className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(validCombos.map(c => c.apiEndpoint)).size}
                </div>
                <p className="text-xs text-muted-foreground">Endpoints únicos</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Credenciales Válidas Detectadas
              </CardTitle>
              <CardDescription>
                Combos que pasaron los criterios de detección automática
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-4">
                <Input
                  placeholder="Buscar usuario o contraseña..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  <Filter className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
              
              {filteredCombos.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600 opacity-50" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No se encontraron combos que coincidan con la búsqueda' : 'No hay combos válidos aún'}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredCombos.map((combo) => (
                      <div key={combo.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <code className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-sm">
                              {combo.combo}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(combo.combo)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>👤 {combo.username}</span>
                            <span>🔑 {'*'.repeat(combo.password.length)}</span>
                            <span>🕒 {combo.responseTime}ms</span>
                            <span>📡 {combo.responseCode}</span>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            🌐 {combo.apiEndpoint} • {combo.timestamp.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Detalles del Combo Válido</DialogTitle>
                                <DialogDescription>
                                  Información completa de la respuesta exitosa
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Credenciales</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><span className="font-medium">Usuario:</span> {combo.username}</div>
                                      <div><span className="font-medium">Contraseña:</span> {combo.password}</div>
                                      <div><span className="font-medium">Combo:</span> <code className="bg-muted px-2 py-1 rounded">{combo.combo}</code></div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Información de Respuesta</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><span className="font-medium">Código:</span> <Badge variant="default">{combo.responseCode}</Badge></div>
                                      <div><span className="font-medium">Tiempo:</span> {combo.responseTime}ms</div>
                                      <div><span className="font-medium">Endpoint:</span> <code className="bg-muted px-2 py-1 rounded text-xs">{combo.apiEndpoint}</code></div>
                                    </div>
                                  </div>
                                </div>
                                
                                {combo.responseData && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Datos de Respuesta</h4>
                                    <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-48">
                                      {JSON.stringify(combo.responseData, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(combo.combo)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
