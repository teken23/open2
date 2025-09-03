
'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfigManager } from '@/components/config-manager'
import { WordlistManager } from '@/components/wordlist-manager'
import { TestExecution } from '@/components/test-execution'
import { Results } from '@/components/results'
import { ProxySettings } from '@/components/proxy-settings'
import { Activity, Settings, List, Play, BarChart3, Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            API Testing Suite
          </h1>
          <p className="text-muted-foreground text-lg">
            Prueba APIs con wordlists y configuraciones personalizadas
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configuraciones</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">APIs configuradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wordlists</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Listas cargadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ejecuciones</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Tests ejecutados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resultados</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Tasa de éxito</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
            <TabsTrigger value="wordlists" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Wordlists
            </TabsTrigger>
            <TabsTrigger value="execution" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Ejecución
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="proxy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Proxy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="mt-6">
            <ConfigManager />
          </TabsContent>
          
          <TabsContent value="wordlists" className="mt-6">
            <WordlistManager />
          </TabsContent>
          
          <TabsContent value="execution" className="mt-6">
            <TestExecution />
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <Results />
          </TabsContent>
          
          <TabsContent value="proxy" className="mt-6">
            <ProxySettings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
