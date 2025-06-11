# RugProofAI - Crypto Token Safety Scanner

![RugProofAI Logo](/public/logo.png)

## Overview

RugProofAI is a browser extension that helps protect crypto users from scams, rugpulls, and malicious tokens. The extension allows you to scan wallet addresses for potentially harmful tokens and analyze smart contracts for honeypot characteristics across multiple blockchain networks.

## Features

### Wallet Scanner

- Scan any wallet address for spam and malicious tokens
- Filter tokens by safety status (safe/spam)
- Search functionality for finding specific tokens
- Supports multiple blockchain networks:
  - Ethereum
  - Polygon
  - BNB Smart Chain
  - Avalanche C-Chain
  - Arbitrum

### Honeypot Scanner

- Analyze token contracts for potential rugpull indicators
- Contract verification status checking
- Pair analysis for liquidity and trading status
- Top holders analysis to detect concentrated ownership

## Technology Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Build Tool**: Vite
- **Data Provider**: Covalent API (@covalenthq/client-sdk)
- **UI Components**: Custom components with Lucide icons
- **Extension Framework**: Chrome Extension Manifest V3

## Development

### Prerequisites

- Node.js (latest LTS recommended)
- Bun package manager

### Setup

1. Clone the repository

```bash
git clone https://github.com/vmmuthu31/RugproofAI-ChromeExtension
cd rugproofextension
```

2. Install dependencies

```bash
bun install
```

3. Start the development server

```bash
bun run dev
```

4. Build for production

```bash
bun run build
```

### Loading the Extension in Chrome

1. Build the extension
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the `build` directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
