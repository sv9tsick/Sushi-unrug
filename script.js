document.addEventListener("DOMContentLoaded", () => {
    const pairName = document.getElementById("pair-name");
    const pairPrice = document.getElementById("pair-price");
    const pairVolume = document.getElementById("pair-volume");

    async function fetchPairData() {
        try {
            const query = `{
                pair(id: "0xd0b2331968e14bd39b89d32117f896c48b9bc9c8") {
                    token0 {
                        symbol
                    }
                    token1 {
                        symbol
                    }
                    token0Price
                    volumeUSD
                }
            }`;

            const response = await fetch("https://api.thegraph.com/subgraphs/name/sushiswap/metis-exchange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query })
            });

            const result = await response.json();
            const data = result.data.pair;

            if (data) {
                pairName.textContent = `${data.token0.symbol} / ${data.token1.symbol}`;
                pairPrice.textContent = `1 ${data.token0.symbol} = ${parseFloat(data.token0Price).toFixed(4)} ${data.token1.symbol}`;
                pairVolume.textContent = `$${parseFloat(data.volumeUSD).toLocaleString()}`;
            } else {
                pairName.textContent = "Pair not found";
                pairPrice.textContent = "N/A";
                pairVolume.textContent = "N/A";
            }
        } catch (error) {
            console.error("Error fetching pair data:", error);
            pairName.textContent = "Error loading data";
            pairPrice.textContent = "Error loading data";
            pairVolume.textContent = "Error loading data";
        }
    }

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                alert(`Wallet connected: ${userAddress}`);
            } catch (error) {
                console.error("Wallet connection failed:", error);
            }
        } else {
            alert("MetaMask not found! Please install it.");
        }
    }

    const connectButton = document.createElement("button");
    connectButton.textContent = "Connect Wallet";
    connectButton.addEventListener("click", connectWallet);
    document.body.appendChild(connectButton);

    fetchPairData();
});
