import React, { useEffect, useState } from "react"
import TaskInput from "../TaskInput"
import TaskList from "../TaskList"
import styles from "./todoList.module.scss"
import Todo from "../../@types/todo.type"

interface handler {
  (todos: Todo[]): Todo[]
}

const syncReactToLocal = (handler: handler) => {
  const todoString = localStorage.getItem("todos")
  const todoObj: Todo[] = JSON.parse(todoString || "[]") //  Chuyển đổi một đối tượng JavaScript thành một chuỗi JSON.
  const newTodo = handler(todoObj)
  localStorage.setItem("todos", JSON.stringify(newTodo)) // Chuyển đổi một chuỗi JSON thành một đối tượng JavaScript.
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]) // khởi tạo mảng todos rỗng phần tử
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const doneTaskList = todos.filter((todo) => todo.done) // phân loại phần tử thỏa mãn điều kiện
  const notDoneTaskList = todos.filter((todo) => !todo.done)

  // render localStorage
  useEffect(() => {
    const todoString = localStorage.getItem("todos")
    const todoObj: Todo[] = JSON.parse(todoString || "[]") //  Chuyển đổi một đối tượng JavaScript thành một chuỗi JSON.
    setTodos(todoObj)
  }, [])

  // addTodo vào mảng todos
  const addTodo = (name: string) => {
    const handler = (todoObj: Todo[]) => {
      return [...todoObj, todo]
    }
    const todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }
    setTodos((prev) => [...prev, todo]) // copy lại mảng và thêm phần tử mới vào
    syncReactToLocal(handler)
  }

  // change Done in TaskList // dò theo id của Item rồi gán Done mới vào
  const handleDoneTodo = (id: string, done: boolean) => {
    // này phải set lại todos do Done thay đổi giữa 2 list
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done } // update mỗi done
        }
        return todo
      })
    })
  }
  // prev là giá trị trạng thái trước đó (nhận vào callback) và dùng hàm map duyệt qua từng phần tử trong mảng todos
  // check điều kiện và change

  // edit todo dựa vào currentTodo nếu click vào button thì có trạng thái currentTodo (id) dò id rồi sửa name
  // dựa vào id của item để dò tìm
  const startEditTodo = (id: string) => {
    // này dò mảng todos
    const find = todos.find((todoItem) => todoItem.id === id)
    if (find) {
      setCurrentTodo(find)
    }
  }

  // change name input
  // đã tìm dc item có id thì truy cập vào setCurrentTodo // thay đổi name
  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) {
        return { ...prev, name }
      }
      return null
    })
  }

  // sau khi change name input rồi setTodos ở các list lại theo name mới
  const finishEditTodo = () => {
    const handler = (prev: Todo[]) => {
      return prev.map((todo) => {
        if (todo.id === (currentTodo as Todo).id) {
          return currentTodo as Todo
        }
        return todo
      })
    }
    setTodos(handler)
    syncReactToLocal(handler)
    setCurrentTodo(null)
  }

  // delete todo dựa vào id
  // kiểm tra setTodos dò theo id
  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handler = (prev: Todo[]) => {
      const index = prev.findIndex((todo) => todo.id === id)
      if (index > -1) {
        const result = [...prev] // clone lại
        result.splice(index, 1)
        return result
      }
      return prev
    }
    setTodos((prev) => {
      const index = prev.findIndex((todo) => todo.id === id)
      if (index > -1) {
        const result = [...prev] // clone lại
        result.splice(index, 1)
        return result
      }
      return prev
    })
    syncReactToLocal(handler)
  }

  console.log(todos)

  return (
    <div className={styles.todoList}>
      <div className={styles.container}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          titleTaskList={false}
          todo={notDoneTaskList}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          titleTaskList={true}
          todo={doneTaskList}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}

// bước đầu khởi tạo mảng todos rỗng
// addTodo truyền vào TaskInput để add todo mới vào list
// todo phân loại phần tử thỏa mản Done
// handleDoneTodo change Done giữa 2 TaskList

// filter thì nó lọc phần tử thỏa mãn điều kiện nào đó
// map tạo ra mảng mới và duyệt qua từng phần tử
// forEach không tạo ra mảng mới và duyệt qua từng phần tử
// find tìm phần tử dựa vào điều kiện trả về phần tử
// findIndex tìm vị trí phần tử dựa vào điều kiện trả về vị trí phần tử
