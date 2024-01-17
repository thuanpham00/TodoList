import React from "react"
import styles from "./taskList.module.scss"
import Todo from "../../@types/todo.type"
import PropTypes from "prop-types"

interface TaskListProps {
  titleTaskList: boolean
  todo: Todo[]
  handleDoneTodo: (id: string, done: boolean) => void
  startEditTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

export default function TaskList(props: TaskListProps) {
  const { titleTaskList, todo, handleDoneTodo, startEditTodo, deleteTodo } = props

  // currying function // dò theo id của item
  const changeDoneTaskItem = (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDoneTodo(id, event.target.checked)
  }

  return (
    <div className="mb-2">
      <h2 className={styles.title}>{titleTaskList ? "Hoàn Thành" : "Chưa Hoàn Thành"}</h2>
      <div className={styles.taskList}>
        {todo.map((todoItem) => (
          <div className={styles.taskItem} key={todoItem.id}>
            <input
              type="checkBox"
              className={styles.taskItem__checkBox}
              checked={todoItem.done}
              onChange={changeDoneTaskItem(todoItem.id)}
            />
            <span className={styles.taskItem__name}>{todoItem.name}</span>
            <div className={styles.taskItem__row}>
              <button className={styles.taskItem__action} onClick={() => startEditTodo(todoItem.id)}>
                ✏️
              </button>
              <button className={styles.taskItem__action} onClick={() => deleteTodo(todoItem.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// vì startEditTodo là props truyền vào không có hàm sẵn nên không có
// onClick={startEditTodo} ❎ // nó sẽ thực thi liền nên =>
// onClick={() => startEditTodo()} ✅

TaskList.propTypes = {
  titleTaskList: PropTypes.bool.isRequired,
  todo: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      done: PropTypes.bool.isRequired
    })
  ).isRequired,
  handleDoneTodo: PropTypes.func.isRequired,
  startEditTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired
}
