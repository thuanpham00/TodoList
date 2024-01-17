import React, { useState } from "react"
import styles from "./taskInput.module.scss"
import Todo from "../../@types/todo.type"
import PropTypes, { array, oneOf } from "prop-types"
interface TaskInputProps {
  addTodo: (name: string) => void
  editTodo: (name: string) => void
  currentTodo: Todo | null
  finishEditTodo: () => void
}

export default function TaskInput(props: TaskInputProps) {
  const { addTodo, editTodo, currentTodo, finishEditTodo } = props
  const [name, setName] = useState<string>("")

  const onChangeValueInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value // value input
    if (currentTodo) {
      editTodo(value)
    } else {
      setName(value) // setState cho name khi onChange
    }
  }

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentTodo) {
      finishEditTodo()
      setName("") // sau đó set lại input rỗng
    } else {
      addTodo(name)
      setName("") // sau đó set lại input rỗng
    }
  }

  return (
    <div className="mb-2">
      <h1 className={styles.title}>Todo List Typescript</h1>
      <form className={styles.form} onSubmit={onSubmitForm}>
        <input
          type="text"
          className={styles.input}
          value={currentTodo ? currentTodo.name : name}
          onChange={onChangeValueInput}
        />
        <button className={styles.btn}>{currentTodo ? "✔️" : "➕"}</button>
      </form>
    </div>
  )
}

// gán name cho value và setState liên tục qua sự kiện onChange

TaskInput.propType = {
  addTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired,
  currentTodo: PropTypes.oneOfType([
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      bool: PropTypes.bool.isRequired
    }),
    PropTypes.oneOf([null])
  ]).isRequired,
  finishEditTodo: PropTypes.func.isRequired
}
