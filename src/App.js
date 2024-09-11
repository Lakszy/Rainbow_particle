import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { ConnectButton, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, injectedWallet, metaMaskWallet, rainbowWallet, trustWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { ParticleNetwork } from '@particle-network/auth';
import { particleWallet } from '@particle-network/rainbowkit-ext';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { useConnectModal } from '@particle-network/btc-connectkit';
const { openConnectModal, disconnect } = useConnectModal();
const PageRainbowKit = () => {
    const projectId = "3c7ddc5f-e2a6-4466-ad3b-ed1296379bf2"; // Manually entered REACT_APP_PROJECT_ID
    const clientKey = "cXLN1RJCzme0TJF2TQR8Q8mwm5e98VHu8qise60d"; // Manually entered REACT_APP_CLIENT_KEY
    const appId = "15e2e30a-f8d6-407d-ae81-7022c7206e9f"; // Manually entered REACT_APP_APP_ID
    const walletConnectProjectId = "c888e62e3e9736e6572ed638ab170a72"; // Manually entered REACT_APP_WALLETCONNECT_PROJECT_ID
    console.log(projectId, "projectId");
    const particle = useMemo(() => new ParticleNetwork({
        projectId: projectId,
        clientKey: clientKey,
        appId: appId,
        chainName: 'Ethereum',
        chainId: 1,
        // wallet: { displayWalletEntry: true },
    }), []);
    console.log(particle, "particle");
    const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet, polygon, optimism, arbitrum], [publicProvider()]);
    const commonOptions = { chains, projectId: walletConnectProjectId };
    console.log(commonOptions, "commonOptions");
    const popularWallets = useMemo(() => ({
        groupName: 'Popular',
        wallets: [
            particleWallet({ chains }),
            injectedWallet(commonOptions),
            rainbowWallet(commonOptions),
            coinbaseWallet({ appName: 'RainbowKit demo', ...commonOptions }),
            metaMaskWallet(commonOptions),
            walletConnectWallet(commonOptions),
        ],
    }), [particle]);
    const connectors = connectorsForWallets([
        popularWallets,
        {
            groupName: 'Other',
            wallets: [
                trustWallet(commonOptions),
            ],
        },
    ]);
    const wagmiClient = createConfig({
        autoConnect: false,
        connectors,
        publicClient,
        webSocketPublicClient,
    });
    return (_jsx(WagmiConfig, { config: wagmiClient, children: _jsx(RainbowKitProvider, { chains: chains, children: _jsx("div", { className: "rainbowkit-box", children: _jsx("div", { className: "rainbowkit-connect-btn", children: _jsx(ConnectButton, {}) }) }) }) }));
};
export default PageRainbowKit;
