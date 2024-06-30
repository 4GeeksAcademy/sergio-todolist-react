import React, { useEffect, useState } from "react";
import { Spinner } from '../component/Spinner.jsx';

export const TodoListWithFetch = () => {
  const [task, setTask] = useState('');
  const [list, setList] = useState();

  const [edit, setEdit] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  const host = 'https://playground.4geeks.com/todo';
  const user = 'spain-72';

  // 10. MANEJA EL ENVÍO DEL FORMULARIO PARA AGREGAR UNA TAREA
  const handleAddTodo = async (event) => {
    event.preventDefault();
    // 11. DATOS QUE NECESITAMOS ENVIAR A LA API PARA CREAR UNA NUEVA TAREA
    const dataToSend = {
      label: task,
      is_done: false
    };
    // 12. CONFIGURACIÓN DE LA SOLICITUD POST A LA API
    const uri = `${host}/todos/${user}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend) // 13. CONVERTIMOS LOS DATOS A FORMATO JSON
    };
    const response = await fetch(uri, options);
    // 14. VALIDAMOS SI LA RESPUESTA DE LA API ES CORRECTA
    if (!response.ok) {
      console.log('Error', response.status, response.statusText);
      return;
    }
    // 15. SI LA RESPUESTA ES CORRECTA, ACTUALIZAMOS LA LISTA DE TAREAS Y LIMPIAMOS EL FORMULARIO
    getTodos();  
    setTask('');  // 16. RESTABLECEMOS EL ESTADO `TASK` A UNA CADENA VACÍA
  };

  // 21. MANEJA EL ENVÍO DEL FORMULARIO PARA EDITAR UNA TAREA
  const handleEditTodo = async (event) => {
    event.preventDefault();
    // 22. DATOS QUE NECESITAMOS ENVIAR A LA API PARA ACTUALIZAR LA TAREA
    const dataToSend = {
      label: task,
      is_done: currentTodo.is_done
    };
    // 23. CONFIGURACIÓN DE LA SOLICITUD PUT A LA API
    const uri = `${host}/todos/${currentTodo.id}`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend) // 24. CONVERTIMOS LOS DATOS A FORMATO JSON
    };
    const response = await fetch(uri, options);
    // 25. VALIDAMOS SI LA RESPUESTA DE LA API ES CORRECTA
    if (!response.ok) {
      console.log('Error', response.status, response.statusText);
      return;
    }
    // 26. SI LA RESPUESTA ES CORRECTA, ACTUALIZAMOS LA LISTA DE TAREAS Y RESTABLECEMOS EL FORMULARIO
    getTodos();
    setTask('');
    setEdit(false);
    setCurrentTodo({});
  };

  // 19. MANEJA EL EVENTO DE CLIC PARA EDITAR UNA TAREA
  const editTask = (item) => {
    setTask(item.label);
    setEdit(true);
    setCurrentTodo(item);
  };

  // 20. RESTABLECE EL ESTADO DE EDICIÓN
  const resetEdit = () => {
    setTask('');
    setEdit(false);
    setCurrentTodo({});
  };

  // 4. OBTIENE LAS TAREAS DE LA API CUANDO EL COMPONENTE SE MONTA
  const getTodos = async () => {
    const uri = `${host}/users/${user}`;
    const options = {
      method: 'GET'
    };
    const response = await fetch(uri, options);
    // 5. TRATAMOS EL ERROR SI LA RESPUESTA NO ES CORRECTA
    if (!response.ok) {
      return;
    }
    // 6. SI LA RESPUESTA ES CORRECTA, GUARDAMOS LOS DATOS OBTENIDOS
    const data = await response.json();
    // 7. CONFIGURAMOS LA LISTA DE TAREAS CON LOS DATOS OBTENIDOS
    setList(data.todos);
  };

  // 17. BORRA UNA TAREA CUANDO SE HACE CLIC EN EL ICONO DE ELIMINAR
  const deleteTask = async (item) => {
    const uri = `${host}/todos/${item.id}`;
    const options = {
      method: 'DELETE'
    };
    const response = await fetch(uri, options);
    // 18. TRATAMOS EL ERROR SI LA RESPUESTA NO ES CORRECTA
    if (!response.ok) {
      return;
    }
    // 9. ACTUALIZAMOS LA LISTA DE TAREAS DESPUÉS DE BORRAR UNA TAREA
    getTodos();
  };

  // 8. INVOCA LA FUNCIÓN PARA OBTENER LAS TAREAS CADA VEZ QUE SE RECARGA LA APLICACIÓN
  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="container col-10 col-sm-8 col-md-6">
      <h1 className="mt-5">Todo List with Fetch</h1>
      {/* 1. VERIFICA SI LA LISTA DE TAREAS EXISTE. SI NO, MUESTRA UN SPINNER */}
      {!list ? 
        <div className="container">
          <p>No existe usuario</p>
          {/* 2. AQUÍ PODEMOS HACER UN FORMULARIO PARA CREAR UN USUARIO */}
          <Spinner />
        </div>
        :
        <div className="text-start mt-2">
          {/* 3. FORMULARIO PARA AGREGAR O EDITAR UNA TAREA */}
          <form onSubmit={edit ? handleEditTodo : handleAddTodo}>
            <label htmlFor="exampleInputEmail1" className="form-label mt-3">
              {edit ? 'Editar Tarea:' : 'Agregar Tarea:'}
            </label>
            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
              value={task}
              onChange={(event) => setTask(event.target.value)}
            />
            {edit && (
              <div className="mt-2">
                <button type="button" className="btn btn-secondary" onClick={resetEdit}>Cancelar</button>
              </div>
            )}
          </form>
          <h6 className="mt-5 mx-2">
            Listado de Tareas
          </h6>
          <ul className="list-group">
            {/* 27. MAPEA LA LISTA DE TAREAS OBTENIDA PARA MOSTRAR CADA TAREA */}
            {list.map((item, id) =>
              <li key={id} className="list-group-item d-flex justify-content-between hidden-icon">
                <div>
                  {item.is_done ? 
                    <i className="text-success me-2 fas fa-thumbs-up"></i> 
                    : 
                    <i className="text-danger me-2 fas fa-ban"></i>}
                  {item.label}
                </div>
                <div>
                  <span onClick={() => editTask(item)} className="me-2">
                    <i className="fas fa-edit text-success"></i>
                  </span>
                  <span onClick={() => deleteTask(item)}>
                    <i className="fas fa-trash text-danger"></i>
                  </span>
                </div>
              </li>
            )}
            {/* 28. MUESTRA UN MENSAJE SI NO HAY TAREAS O LA CANTIDAD DE TAREAS */}
            <li className="list-group-item text-end bg-light fw-lighter">
              {list.length === 0 ? 'Por favor, añade una nueva tarea' : `${list.length} tasks`}
            </li>
          </ul>
        </div>
      }
    </div>
  );
};


