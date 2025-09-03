#!/usr/bin/env node

import { main, resetEngine } from './lib/engine-main'

// Parse arguments
const args = process.argv.slice(2)
let realmUrl = 'localhost:8000'
let developmentMode = true  // Default to development mode (interactive) for manual usage

for (const arg of args) {
  if (arg === '--help' || arg === '-h') {
    console.log(`
Usage: npx @dcl/hammurabi-server [--realm=<url>] [--production]

Options:
  --realm=<url>    Realm URL to connect to (default: localhost:8000)
  --production     Run in production mode without interactive controls (for process spawning)
  --help, -h       Show this help

Example:
  npx @dcl/hammurabi-server --realm=localhost:8000
  npx @dcl/hammurabi-server --realm=localhost:8000 --production
`)
    process.exit(0)
  }
  
  if (arg.startsWith('--realm=')) {
    realmUrl = arg.split('=')[1]
  }
  
  if (arg === '--production') {
    developmentMode = false
  }
}

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Error:', error.message)
  if (developmentMode) {
    console.log('Press [R] to restart or [Ctrl+C] to exit')
  }
})

process.on('unhandledRejection', (reason: any) => {
  console.error('❌ Error:', reason?.message || reason)
  if (developmentMode) {
    console.log('Press [R] to restart or [Ctrl+C] to exit')
  }
})

// Simple restart mechanism
let isRestarting = false

async function start() {
  try {
    const scene = await main({ realmUrl })
    if (developmentMode) {
      console.log('✅ Server running - Press [R] to restart or [Ctrl+C] to exit')
    } else {
      console.log('✅ Server running in production mode')
    }
    return scene
  } catch (error: any) {
    console.error('❌ Failed to start:', error.message)
    if (developmentMode) {
      console.log('Press [R] to retry or [Ctrl+C] to exit')
    }
    throw error
  }
}

async function restart() {
  if (isRestarting) return
  
  isRestarting = true
  console.log('🔄 Restarting...')
  
  try {
    resetEngine()
    await new Promise(resolve => setTimeout(resolve, 100))
    await start()
  } catch (error) {
    console.error('❌ Restart failed')
  }
  
  isRestarting = false
}

// Key listener - only in development mode
if (developmentMode) {
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  process.stdin.on('data', (key) => {
    const keyStr = key.toString()
    if (keyStr === 'r' || keyStr === 'R') restart()
    if (keyStr === '\u0003') process.exit(0) // Ctrl+C
  })
}

// Start server
start().catch(() => {
  // Error already logged, just setup retry listener
})