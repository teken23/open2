
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Play, Pause, Square, Settings2, Zap, CheckCircle, XCircle, Clock, Users, Target } from 'lucide-react'

interface ExecutionLog {
  id: string
  timestamp: Date
  combo: string
  status: 'success' | 'failure' | 'error'
  responseCode: number
  responseTime: number
  message: string
}

export function TestExecution() {
  const [selectedConfig, setSelectedConfig] = useState('')
  const [selectedWordlist, setSelectedWordlist] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentExecution, setCurrentExecution] = useState<any>(null)
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([])
  const [settings, setSettings] = useState({
    threads: 10,
    delay: 100,
    timeout: 10,
    retryCount: 2,
    randomizeOrder: true
  })

  const configs: any[] = [] // Mock empty for now
  const wordlists: any[] = [] // Mock empty for now

  const generateMockCombo = (index: number) => {
    const emails = ['admin@test.com', 'user@domain.com', 'test@email.com', 'john@company.com', 'mary@site.net']
    const passwords = ['123456', 'password123', 'qwerty', 'admin2024', 'letmein']
    return `${emails[index % emails.length]}:${passwords[index % passwords.length]}`
  }

  const addExecutionLog = (combo: string, status: 'success' | 'failure' | 'error', responseCode: number, message: string) => {
    const newLog: ExecutionLog = {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
      combo,
      status,
      responseCode,
      responseTime: Math.floor(Math.random() * 2000) + 100,
      message
    }
    
    setExecutionLogs(prev => [newLog, ...prev.slice(0, 99)]) // Keep last 100 logs
  }

  const handleStart = () => {
    if (!selectedConfig || !selectedWordlist) return
    
    setIsRunning(true)
    setExecutionLogs([])
    setCurrentExecution({
      id: Date.now().toString(),
      name: `Test masivo - ${new Date().toLocaleTimeString()}`,
      status: 'RUNNING',
      totalItems: 1000,
      processedItems: 0,
      successCount: 0,
      failureCount: 0,
      errorCount: 0,
      validCombos: [],
      startedAt: new Date(),
      avgResponseTime: 0
    })
    
    // Mock execution with realistic simulation
    let processed = 0
    const interval = setInterval(() => {
      if (isPaused) return
      
      const batchSize = Math.floor(Math.random() * settings.threads) + 1
      
      for (let i = 0; i < batchSize && processed < 1000; i++) {
        const combo = generateMockCombo(processed)
        const isSuccess = Math.random() < 0.05 // 5% success rate realistic
        const responseCode = isSuccess ? 200 : (Math.random() < 0.7 ? 401 : 403)
        
        if (isSuccess) {
          addExecutionLog(combo, 'success', responseCode, 'Login exitoso - Credenciales válidas')
          setCurrentExecution((prev: any) => ({
            ...prev,
            successCount: prev.successCount + 1,
            validCombos: [...prev.validCombos, combo]
          }))
        } else {
          addExecutionLog(combo, 'failure', responseCode, 
            responseCode === 401 ? 'Credenciales inválidas' : 'Acceso denegado')
          setCurrentExecution((prev: any) => ({
            ...prev,
            failureCount: prev.failureCount + 1
          }))
        }
        
        processed++
      }
      
      if (processed >= 1000) {
        processed = 1000
        setIsRunning(false)
        setCurrentExecution((prev: any) => ({
          ...prev,
          status: 'COMPLETED',
          processedItems: processed,
          completedAt: new Date()
        }))
        clearInterval(interval)
      }
      
      setProgress((processed / 1000) * 100)
      setCurrentExecution((prev: any) => ({
        ...prev,
        processedItems: processed,
        avgResponseTime: Math.floor(Math.random() * 1500) + 300
      }))
    }, settings.delay)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsPaused(false)
    setProgress(0)
    setCurrentExecution(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Motor de Testing Masivo</h2>
        <p className="text-muted-foreground">Ejecuta testing de combos en masa para detectar credenciales válidas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Configuración
            </CardTitle>
            <CardDescription>Setup del testing masivo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Configuración de API</Label>
              <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona config" />
                </SelectTrigger>
                <SelectContent>
                  {configs.length === 0 ? (
                    <SelectItem value="demo">Demo Config (para prueba)</SelectItem>
                  ) : (
                    configs.map((config: any) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wordlist de Combos</Label>
              <Select value={selectedWordlist} onValueChange={setSelectedWordlist}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona wordlist" />
                </SelectTrigger>
                <SelectContent>
                  {wordlists.length === 0 ? (
                    <SelectItem value="demo">Demo Combos (1000 combos)</SelectItem>
                  ) : (
                    wordlists.map((wordlist: any) => (
                      <SelectItem key={wordlist.id} value={wordlist.id}>
                        {wordlist.name} ({wordlist.lineCount} combos)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Hilos</Label>
                <Input 
                  type="number" 
                  value={settings.threads}
                  onChange={(e) => setSettings({...settings, threads: parseInt(e.target.value) || 10})}
                  min="1" max="100" 
                />
              </div>
              <div className="space-y-2">
                <Label>Delay (ms)</Label>
                <Input 
                  type="number" 
                  value={settings.delay}
                  onChange={(e) => setSettings({...settings, delay: parseInt(e.target.value) || 100})}
                  min="0" max="5000" 
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleStart} 
                disabled={isRunning || (!selectedConfig && !selectedWordlist)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Test
              </Button>
              {isRunning && (
                <>
                  <Button variant="outline" onClick={handlePause}>
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" onClick={handleStop}>
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Estadísticas Live
            </CardTitle>
            <CardDescription>Resultados en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            {!currentExecution ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-2">Esperando ejecución</div>
                <div className="text-sm text-muted-foreground">
                  Las estadísticas aparecerán aquí durante el test
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm">{currentExecution.name}</div>
                  <Badge variant={
                    currentExecution.status === 'RUNNING' ? (isPaused ? 'secondary' : 'default') :
                    currentExecution.status === 'COMPLETED' ? 'secondary' : 'destructive'
                  }>
                    {isPaused ? 'PAUSADO' : currentExecution.status}
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progreso</span>
                    <span>{currentExecution.processedItems?.toLocaleString()} / {currentExecution.totalItems?.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="text-xs text-muted-foreground mt-1 text-center">
                    {progress.toFixed(1)}%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {currentExecution.successCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Válidos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">
                      {currentExecution.failureCount || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Fallos</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {currentExecution.avgResponseTime || 0}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Tiempo avg</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Iniciado: {new Date(currentExecution.startedAt).toLocaleTimeString()}</div>
                  <div>Hilos activos: {settings.threads}</div>
                  <div>Rate: ~{Math.floor(60000 / (settings.delay + 200))} req/min</div>
                  {currentExecution.completedAt && (
                    <div className="text-green-600">Completado: {new Date(currentExecution.completedAt).toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Logs en Tiempo Real
            </CardTitle>
            <CardDescription>Últimos 100 intentos de combos</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              {executionLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">Los logs aparecerán aquí durante la ejecución</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {executionLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 p-2 rounded border text-sm">
                      {log.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : log.status === 'failure' ? (
                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs truncate">
                          {log.combo}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {log.message} ({log.responseCode}) - {log.responseTime}ms
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString().slice(-8)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Demo */}
      <Card className="border-dashed">
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">🚀 Demo Rápido</h3>
              <p className="text-muted-foreground mb-4">
                Prueba el motor de testing con configuración demo
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="font-semibold text-sm">1000 Combos Demo</div>
                <div className="text-xs text-muted-foreground">email:password</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="font-semibold text-sm">API Demo</div>
                <div className="text-xs text-muted-foreground">Login simulation</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="font-semibold text-sm">Motor Testing</div>
                <div className="text-xs text-muted-foreground">Detección automática</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2 text-sm">
              {(configs.length === 0 || wordlists.length === 0) && (
                <>
                  <Badge variant="outline" className="bg-blue-50">
                    💡 Tip: Selecciona "Demo Config" y "Demo Combos" para probar
                  </Badge>
                </>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground max-w-lg mx-auto">
              <strong>⚠️ Nota:</strong> Esta herramienta es para testing ético en sistemas propios o con autorización explícita.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
