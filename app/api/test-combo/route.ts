
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { config, combo, proxy } = await request.json()
    
    const [username, password] = combo.split(config.separator || ':')
    
    // Replace variables in the request
    let url = config.url
    let body = config.body || ''
    let headers = config.headers || {}
    
    // Replace combo variables
    url = url.replace(/{COMBO_USER}/g, username)
    url = url.replace(/{COMBO_PASS}/g, password)
    url = url.replace(/{COMBO_FULL}/g, combo)
    
    body = body.replace(/{COMBO_USER}/g, username)
    body = body.replace(/{COMBO_PASS}/g, password)
    body = body.replace(/{COMBO_FULL}/g, combo)
    
    const startTime = Date.now()
    
    // Make the actual request
    const requestOptions: RequestInit = {
      method: config.method || 'POST',
      headers: headers,
      signal: AbortSignal.timeout(config.timeout * 1000 || 10000),
    }
    
    if (config.method !== 'GET' && body) {
      requestOptions.body = body
    }
    
    try {
      const response = await fetch(url, requestOptions)
      const responseTime = Date.now() - startTime
      const responseText = await response.text()
      
      // Check success conditions
      let isSuccess = false
      let isFailure = false
      
      // Check success conditions
      for (const condition of config.successConditions || []) {
        if (!condition.enabled) continue
        
        switch (condition.type) {
          case 'status_code':
            if (response.status.toString() === condition.value) {
              isSuccess = true
            }
            break
          case 'response_contains':
            if (responseText.toLowerCase().includes(condition.value.toLowerCase())) {
              isSuccess = true
            }
            break
          case 'response_not_contains':
            if (!responseText.toLowerCase().includes(condition.value.toLowerCase())) {
              isSuccess = true
            }
            break
          case 'response_length':
            if (responseText.length > parseInt(condition.value)) {
              isSuccess = true
            }
            break
        }
      }
      
      // Check failure conditions
      for (const condition of config.failureConditions || []) {
        if (!condition.enabled) continue
        
        switch (condition.type) {
          case 'status_code':
            if (response.status.toString() === condition.value) {
              isFailure = true
            }
            break
          case 'response_contains':
            if (responseText.toLowerCase().includes(condition.value.toLowerCase())) {
              isFailure = true
            }
            break
          case 'response_not_contains':
            if (!responseText.toLowerCase().includes(condition.value.toLowerCase())) {
              isFailure = true
            }
            break
        }
      }
      
      const result = {
        combo,
        username,
        status: isSuccess && !isFailure ? 'success' : 'failure',
        responseCode: response.status,
        responseTime,
        responseText: responseText.substring(0, 1000), // Limit response text
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      }
      
      return NextResponse.json(result)
      
    } catch (fetchError: any) {
      const responseTime = Date.now() - startTime
      
      return NextResponse.json({
        combo,
        username,
        status: 'error',
        responseCode: 0,
        responseTime,
        error: fetchError.message,
        timestamp: new Date().toISOString()
      })
    }
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
