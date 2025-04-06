// src/app.js


const App = {
    web3: null,
    account: null,
    contracts: {},
  
    loadWeb3: async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request wallet connection
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
          });
  
          // Create a Web3 instance
          App.web3 = new Web3(window.ethereum);
          App.account = accounts[0];
  
        //   console.log("✅ Connected wallet:", App.account);
  
          // Optional: Display connected account in UI
          const statusEl = document.getElementById("status");
          if (statusEl) {
            statusEl.innerText = `Connected: ${App.account}`;
          }
  
        } catch (error) {
          console.error("❌ Wallet connection denied", error);
        }
      } else {
        alert("🦊 Please install MetaMask to use this dApp.");
      }
    },

    loadContract: async () => {
        const todoList = await fetch('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3)
        // console.log(todoList)
    },
  
    load: async () => {
      await App.loadWeb3();
      await App.loadContract();
      // You can also call App.loadContract() or other init stuff here
    }
  };
  
  document.addEventListener("DOMContentLoaded", App.load);
