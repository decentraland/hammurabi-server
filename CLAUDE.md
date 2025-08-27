# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

This project is a headless Node.js server implementation of the Decentraland protocol using Babylon.js NullEngine for 3D scene processing without rendering.

```bash
# Build TypeScript to JavaScript
npm run build

# Run tests
npm run test

# Start development server
npm start  # runs: ./start --realm=localhost:8000

# Run the server with specific realm
npx @dcl/hammurabi-server --realm=localhost:8000
```

The project uses simple TypeScript compilation (`tsc`) instead of complex bundling. The compiled output goes to `dist/` folder.

## Project Architecture

This is the **Hammurabi Server** - a headless implementation of the Decentraland protocol that runs entirely in Node.js without browser dependencies.

### Core Architecture Components

**Engine Initialization (`src/lib/engine-main.ts`)**:
- Entry point that creates Babylon.js NullEngine for headless 3D processing
- Creates guest identity for authentication
- Fetches realm configuration from `/about` endpoint
- Initializes all systems (avatar rendering, scene culling, character controller, etc.)
- Scene loading uses `loadSceneContextFromLocal` with hot reload support

**Scene Management (`src/lib/babylon/scene/`)**:
- `SceneContext` - Central class managing scene state, CRDT message processing, and entity lifecycle
- `BabylonEntity` - Wrapper around Babylon.js objects with component-based architecture
- **Node.js Runtime**: Uses `connectSceneContextUsingNodeJs` with in-process WebWorker runtime and MemoryTransport (no actual worker threads)
- Hot reload support for local development

**Communications System (`src/lib/decentraland/communications/`)**:
- **LiveKit Transport** (`transports/livekit.ts`): Uses `@livekit/rtc-node` package for Node.js multiplayer
  - Room management without browser-specific APIs
  - Uses `connectionState` instead of `state` property
  - No `waitForPCInitialConnection()` in Node.js version
- `CommsTransportWrapper` - Transport abstraction layer
- Scene-specific communications via `createSceneComms`
- Local gatekeeper connection at `localhost:3000` for preview scenes

**Headless Adaptations**:
- **Babylon.js** (`src/lib/babylon/index.ts`): Always uses NullEngine, no canvas/WebGL
- **Avatar Rendering** (`src/lib/babylon/avatars/AvatarRenderer.ts`): 
  - Skips UI texture creation when `OffscreenCanvas` is undefined
  - No emote loading in headless mode
  - Avatar components created but not visually rendered
- **Asset Loading**: Custom XMLHttpRequest polyfill in `cli.ts` for GLTF loading
- **Environment**: Simplified lighting without complex visual materials

### Key Technical Details

- **Node.js 18+**: Uses native fetch API, no polyfills needed
- **Error Resilience**: Global uncaught exception handlers prevent server crashes
- **No DOM Dependencies**: All browser-specific code is conditional or removed
- **LiveKit Node SDK**: Direct imports from `@livekit/rtc-node`, no conditional loading
- **Entity Allocation**: Unity-compatible reserved ranges (1 for local player, 32-255 for remote)
- **CRDT Protocol**: Component-based entity system with conflict resolution
- **Profile System**: ADR-204 compliant with Catalyst-based fetching

### CLI Structure (`src/cli.ts`)

The CLI provides:
- XMLHttpRequest polyfill for Babylon.js asset loading
- Argument parsing for `--realm`, `--address`, `--authenticated` flags  
- Global error handlers that keep server running despite errors
- Direct execution as npm bin via `dist/cli.js`

### GitHub Actions Publishing

The `.github/workflows/build-release.yaml` workflow:
- Triggers on pushes to main, all PRs, and releases
- Uses `decentraland/oddish-action@master` for npm/S3 publishing
- Creates deterministic snapshots for PR testing
- Publishes to `@dcl/hammurabi-server` on npm

### Testing

The project uses Jest for testing. Integration tests may require the testing realm to be built, though most of that infrastructure has been simplified for the headless server.