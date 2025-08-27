# Hammurabi Server


A headless Node.js implementation of the Decentraland protocol using Babylon.js for 3D scene processing.

This server can run Decentraland scenes in a headless environment, making it perfect for:
- **Server-side simulation** of Decentraland worlds
- **Multiplayer backend** processing with LiveKit communications  
- **Scene validation** and testing infrastructure
- **Headless bots** and automated agents
- **Performance testing** without browser overhead

## Features

- 🏃‍♂️ **Headless 3D Processing** - Full Babylon.js scene simulation without rendering
- 🌐 **LiveKit Communications** - Real multiplayer support via Node.js LiveKit SDK
- 🤖 **Scene Execution** - Runs Decentraland SDK7 scenes with full ECS support
- 🔧 **Asset Loading** - GLTF models, textures, and colliders for spatial logic
- 🎮 **Avatar System** - Multiplayer player management without visual rendering
- 🔄 **Hot Reload** - Development server with automatic scene updates
- ⚡ **Error Resilient** - Continues running despite scene errors

## Installation

### Global Installation
```bash
npm install -g @dcl/hammurabi-server
hammurabi --realm=localhost:8000
```

### Local Development
```bash
git clone https://github.com/decentraland/hammurabi
cd hammurabi
npm install
npm run build
./hammurabi --realm=localhost:8000
```

## Usage

### Basic Server
```bash
# Connect to local development realm
hammurabi --realm=localhost:8000

# Connect to remote realm
hammurabi --realm=https://sdk-team-cdn.decentraland.org
```

### Programmatic Usage
```typescript
import { main } from '@dcl/hammurabi-server'

const scene = await main({
  realmUrl: 'localhost:8000'
})

console.log('Headless scene running:', !!scene)
```

## Architecture

### Headless Components
- **Babylon.js NullEngine** - 3D processing without GPU rendering
- **In-process Scene Runtime** - WebWorker scripts via QuickJS  
- **LiveKit Node.js SDK** - Multiplayer communications
- **Asset Manager** - GLTF loading with collider support
- **Avatar Renderer** - Multiplayer entities without UI textures

### Scene Support  
- **ECS7 Scenes** - Full Decentraland SDK7 compatibility
- **Component Systems** - Transform, mesh, avatar, pointer events
- **CRDT Protocol** - Entity state synchronization
- **Asset Loading** - Models, textures, audio (headless)
- **Spatial Queries** - Raycasting and collision detection

## Development

### Build
```bash
npm run build      # Compile TypeScript
npm run test       # Run test suite  
npm start          # Start development server
```

### Environment Variables
```bash
# Optional: Configure LiveKit server
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_TOKEN=your-jwt-token
```

## Configuration

The server automatically:
- Creates guest identity for headless authentication
- Fetches realm configuration from `/about` endpoint  
- Establishes LiveKit room for multiplayer communications
- Loads and executes scene scripts in isolated runtime
- Processes CRDT messages for entity synchronization

## Publishing

This package is automatically published via GitHub Actions:
- **Main branch** → Latest release to npm  
- **Pull requests** → Snapshot versions for testing
- **Releases** → Tagged versions with provenance

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make changes and test: `npm run build && npm run test`
4. Create pull request - snapshots will be automatically published for testing

## License

Apache-2.0

---

**Protocol Squad** - Building the future of virtual worlds 🌐
