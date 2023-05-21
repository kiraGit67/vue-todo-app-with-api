"use strict";

Vue.createApp({
  data() {
    return {
      apiURL: "http://localhost:4730/todos",
      toDos: [],
      newToDo: "",
      filter: "all",
    };
  },
  created() {
    this.getToDoData();
  },
  computed: {
    filteredToDos() {
      if (this.filter === "done") {
        return this.toDos.filter((toDo) => toDo.done === true);
      } else if (this.filter === "open") {
        return this.toDos.filter((toDo) => toDo.done === false);
      } else {
        return this.toDos;
      }
    },
    countToDos() {
      return this.filteredToDos.length;
    },
    countText() {
      if (this.filter === "all") {
        return "Gesamt-Anzahl";
      } else {
        return "Anzahl " + this.filter;
      }
    },
  },
  methods: {
    getToDoData() {
      fetch(this.apiURL)
        .then((response) => response.json())
        .then((todosFromApi) => {
          this.toDos = todosFromApi;
        });
    },
    addNewToDo() {
      const newToDo = {
        description: this.newToDo,
        done: false,
      };
      fetch(this.apiURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newToDo),
      })
        .then((response) => response.json())
        .then((newToDoFromApi) => {
          console.log("Neues ToDo wurde angelegt: " + newToDoFromApi);
          this.toDos.push(newToDoFromApi);
          this.newToDo = "";
          //this.getToDoData();
        });
    },
    updateToDo(toDo) {
      const updatedToDo = {
        description: toDo.description,
        done: toDo.done,
      };
      fetch(this.apiURL + "/" + toDo.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedToDo),
      })
        .then((response) => response.json())
        .then((updatedToDoFromApi) => {
          toDo.done = updatedToDoFromApi.done;
        });
    },
    deleteDoneToDos() {
      this.toDos.forEach((toDo) => {
        if (toDo.done === true) {
          fetch(this.apiURL + "/" + toDo.id, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }).then((response) => response.json());
        }
      });
      this.toDos.filter((toDo) => toDo.done === true);
      //this.getToDoData();
    },
    deleteSelectedToDo(toDo) {
      fetch(this.apiURL + "/" + toDo.id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
      this.toDos.splice(
        this.toDos.findIndex((element) => element.id === toDo.id),
        1
      );
    },
  },
}).mount("#app");

//32:41
