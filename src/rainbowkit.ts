// src/rainbowkit.ts
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookieStorage, createStorage } from 'wagmi';

const queryClient = new QueryClient();

const projectId = '8858363ef9c0a7419bc2570702a5efc9'; // Replace with your WalletConnect project ID

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  ssr: false,
  projectId,
  chains: [polygon],
  storage: createStorage({
    storage: cookieStorage,
  }),});


export { config, RainbowKitProvider, QueryClientProvider, queryClient };
