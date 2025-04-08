// src/app.js


const App = {
    web3: null,
    account: null,
    contracts: {},
    loading: false,
  
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
          // const statusEl = document.getElementById("account");
          // if (statusEl) {
          //   statusEl.innerText = `Connected: ${App.account}`;
          // }
  
        } catch (error) {
          console.error("❌ Wallet connection denied", error);
        }
      } else {
        alert("🦊 Please install MetaMask to use this dApp.");
      }
    },

    loadContract: async () => {
        const todoList = await fetch('TodoList.json').then(res => res.json())
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(App.web3.currentProvider)
        // console.log(todoList)
        // console.log("Provider:", App.contracts.TodoList.currentProvider);
        // console.log("Has send:", typeof App.contracts.TodoList.currentProvider.send);
        // console.log("Has request:", typeof App.contracts.TodoList.currentProvider.request);
        // console.log("Has sendAsync:", typeof App.contracts.TodoList.currentProvider.sendAsync);


          // 🔧 Safe patch for send/sendAsync
  // const provider = App.contracts.TodoList.currentProvider;

  // if (typeof provider.sendAsync !== "function") {
  //   provider.sendAsync = function () {
  //     if (typeof provider.send === "function") {
  //       return provider.send.apply(provider, arguments);
  //     } else {
  //       throw new Error("Provider does not support send or sendAsync.");
  //     }
  //   };
  // }

  // if (typeof provider.send !== "function" && typeof provider.request === "function") {
  //   provider.send = function (payload, callback) {
  //     provider.request(payload)
  //       .then(result => callback(null, result))
  //       .catch(error => callback(error, null));
  //   };
  // }

        App.todoList = await App.contracts.TodoList.deployed();

    },
  
    load: async () => {
      await App.loadWeb3();
      await App.loadContract();
      await App.render();
      await App.setLoading();
      // You can also call App.loadContract() or other init stuff here
    },

    render: async () => {
      //Prevent double render
      if (App.loading) {
        return
      }
      //update app loading state
      App.setLoading(true)
      //render acc
      $('#account').html(App.account)

      await App.renderTasks()

      //update loading state
      App.setLoading(false)

    },

    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    },

    renderTasks: async () => {
      //load task for blockchain
      const taskCount = await App.todoList.taskCount()
      const $taskTemplate = $('.taskTemplate')
      // console.log(taskCount.toNumber())

      //render out each task with task template
      for (var i = 1; i<= taskCount; i++) {
        // console.log("HAELOO")
        const task = await App.todoList.tasks(i)
        const taskId = task[0].toNumber()
        const taskContent = task[1]
        const taskCompleted = task[2]
        
        // console.log("HAELOO")
        console.log("taskContent",taskContent)

        //create html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name',taskId)
                        .prop('checked',taskCompleted)
                        .on('click',App.toggleCompleted)


    
      
      //put task in correct list
      console.log($taskTemplate)

   

      // const $taskItem = $('<li></li>').append($newTaskTemplate);

      if (taskCompleted){
        $('#completedTaskList').append($newTaskTemplate);
      } else {
        $('#taskList').append($newTaskTemplate);
      }

      
      //show the task
      $newTaskTemplate.show()
      
    }
    }
  };
  
 document.addEventListener("DOMContentLoaded", App.load);
