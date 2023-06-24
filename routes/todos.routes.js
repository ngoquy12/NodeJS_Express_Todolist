// Khởi tạo server
const express = require("express");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const { per_page } = req.query;
  try {
    let todos = JSON.parse(fs.readFileSync("./database/todos.json"));
    if (per_page) {
      const slicedTodos = todos.splice(0, +per_page); // Cắt bớt mảng todos và lưu vào biến slicedTodos
      res.status(200).json({
        message: "success",
        result: per_page,
        data: slicedTodos, // Trả về dữ liệu đã cắt bớt
      });
    } else {
      res.status(200).json({
        message: "success",
        result: todos.length,
        data: todos,
      });
    }
  } catch (error) {
    res.json({
      error,
    });
  }
});

// Middleware để validate title
const checkExistTitle = (req, res, next) => {
  let { title } = req.body;
  if (!title) {
    res.json({
      message: "Input blank",
    });
  } else {
    try {
      let todos = JSON.parse(fs.readFileSync("./database/todos.json"));
      let isExistTodo = todos.find(
        (todo, i) => todo.title.toLowerCase() === title.toLowerCase()
      );
      if (isExistTodo) {
        return res.status(404).json({ message: "Task exists" });
      } else {
        next();
      }
    } catch (error) {}
  }
};

// Create todo
router.post("/", checkExistTitle, (req, res) => {
  console.log(req.body);
  let { title } = req.body;

  try {
    let todos = JSON.parse(fs.readFileSync("./database/todos.json"));
    let newTodoId = 0;
    if (todos) {
      for (let index = 0; index < todos.length; index++) {
        if (todos[index].id > newTodoId) {
          newTodoId = todos[index].id;
        }
      }
    }

    let newTodo = {
      userId: 1,
      id: newTodoId + 1,
      title: title,
      completed: false,
    };
    todos.unshift(newTodo);
    fs.writeFileSync("./database/todos.json", JSON.stringify(todos));
    res.json({
      message: "Create successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

const checkExistId = (req, res, next) => {
  const { id } = req.params;
  try {
    let todos = JSON.parse(fs.readFileSync("./database/todos.json"));
    const existingTodo = todos.find((todo) => todo.id === +id);
    if (!existingTodo) {
      return res.status(404).json({ message: "Todo not found" });
    } else {
      next();
    }
  } catch (error) {
    res.json({
      error,
    });
  }
};
// update trạng thái
router.put("/:id", checkExistId, (req, res) => {
  console.log("123");
  let { id } = req.params;
  try {
    const todos = JSON.parse(fs.readFileSync("./database/todos.json"));
    let ishaveTodoId = todos.findIndex((todo, i) => todo.id === +id);
    let completed = !todos[ishaveTodoId].completed;
    todos[ishaveTodoId] = { ...todos[ishaveTodoId], completed };
    fs.writeFileSync("./database/todos.json", JSON.stringify(todos));
    res.json({
      message: "Update successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

router.delete("/:id", checkExistId, (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    const todos = JSON.parse(fs.readFileSync("./database/todos.json"));
    const newTodos = todos.filter((e, i) => e.id != id);
    fs.writeFileSync("./database/todos.json", JSON.stringify(newTodos));
    res.json({
      message: "Delete successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

// delete all
router.delete("/", (req, res) => {
  try {
    const newTodos = [];
    fs.writeFileSync("./database/todos.json", JSON.stringify(newTodos));

    res.json({
      message: "Delete successfully",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

module.exports = router;
