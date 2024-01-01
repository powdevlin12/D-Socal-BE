import { Router } from 'express'
import { addTodoController, deleteTodo, getAddTodoController } from '~/controllers/todos.controller'
import { wrapRequestHandler } from '~/utils/handlers'
const todosRouter = Router()

todosRouter.post('/add', wrapRequestHandler(addTodoController))
todosRouter.get('/get-all', wrapRequestHandler(getAddTodoController))
todosRouter.delete('/delete/:id', wrapRequestHandler(deleteTodo))

export default todosRouter
