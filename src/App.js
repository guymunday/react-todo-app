import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// list todos
// add todos
// toggle todos
// delete rodos

const GET_TODOS = gql`
  query getTodos {
    todos {
      done
      id
      text
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: { id: { _eq: $id } }, _set: { done: $done }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: { text: $text }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: { id: { _eq: $id } }) {
      returning {
        done
        id
        text
      }
    }
  }
`;

function App() {
  const [todoText, setTodoText] = React.useState("");
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText(""),
  });
  const [deleteTodo] = useMutation(DELETE_TODO);

  async function handleToggleTodo(todo) {
    await toggleTodo({
      variables: { id: todo.id, done: !todo.done },
    });
  }

  async function handleAddTodo(event) {
    event.preventDefault();
    if (!todoText.trim()) return;
    await addTodo({
      variables: { text: todoText },
      refetchQueries: [
        {
          query: GET_TODOS,
        },
      ],
    });
    // setTodoText("");
  }

  async function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm("Do you want to delete this todo?");
    if (isConfirmed) {
      await deleteTodo({
        variables: { id },
        update: (cache) => {
          const prevData = cache.readQuery({ query: GET_TODOS });
          const newTodos = prevData.todos.filter((todo) => todo.id !== id);
          cache.writeQuery({ query: GET_TODOS, data: { todos: newTodos } });
        },
      });
    }
  }

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error fetching todos!</div>;

  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
      <h1 className="f2 tc">
        GraphQL Checklist{" "}
        <span role="img" aria-label="checkmark">
          ✅
        </span>
      </h1>
      <h2 className="f4 tc">
        To-do CRUD app built with React, Apollo {"&"} Hasura.
      </h2>
      <p className="mb0 tc">Double click a to-do item to mark as complete.</p>
      <p className="mb4 tc">
        (Feel free to play around or even leave me a message{" "}
        <span role="img" aria-label="smiley face">
          🙂
        </span>
        )
      </p>
      <form onSubmit={handleAddTodo} className="mb3">
        <input
          className="pa2 f4 b--solid b--black"
          type="text"
          placeholder="Write a task"
          onChange={(event) => setTodoText(event.target.value)}
          value={todoText}
        />
        <button className="pa2 f4 bg-white b--black b--solid" type="submit">
          Create
        </button>
      </form>
      <div className="todo-list flex items-center justify-center flex-column">
        {data.todos.map((todo) => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span
              className={`list pa1 f3 pointer ${todo.done && "strike"}`}
              style={{ userSelect: "none" }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo)}
              className="bg-transparent bn f4"
            >
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
