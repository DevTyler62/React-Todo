import React, { useEffect, useRef, useState } from "react";
import todo_icon from "../assets/todo_icon.png";
import TodoItems from "./TodoItems";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Todo = () => {
  const [todoList, setTodoList] = useState(
    localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
  );
  const [taskText, setText] = useState("");

  const add = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (taskText !== "") {
      const newTodo = {
        id: Date.now(),
        text: taskText,
        isComplete: false,
      };

      setTodoList((prev) => [...prev, newTodo]);
      setText("");
    }
  };
  const deleteTodo = (id) => {
    setTodoList((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== id);
    });
  };

  const updateTodo = (id) => {
    const todoID = todoList.filter((todo) => todo.id == id);

    withReactContent(Swal).fire({
      title: "Update Task",
      input: "text",
      inputValue: todoID[0].text,
      showCancelButton: true,
      confirmButtonText: "Edit",
      confirmButtonColor: "#ea580c",
      color: "#000000",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
      preConfirm: (value) => {
        const newText = todoList.map((todo) => {
          if (todo.id === todoID[0].id) {
            return {
              ...todo,
              text: value,
            };
          } else {
            return todo;
          }
        });

        setTodoList(newText);
      },
    });
  };

  const toggle = (id) => {
    setTodoList((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    });
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl">
      <div className="flex items-center mt-7 gap-2">
        <img src={todo_icon} alt="todo icon" className="w-8" />
        <h1 className="text-3xl font-semibold">To Do List</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex my-7 bg-gray-200 rounded-full"
      >
        <input
          className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
          type="text"
          placeholder="Add your task"
          value={taskText}
          onChange={add}
        />
        <button
          type="submit"
          className=" ml-12 border-none rounded-full bg-orange-600 w-32 h-14 text-white text-lg font-medium cursor-pointer"
        >
          Add +
        </button>
      </form>

      <div>
        {todoList.map((item, index) => {
          return (
            <TodoItems
              key={index}
              text={item.text}
              id={item.id}
              isComplete={item.isComplete}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
              toggle={toggle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Todo;
