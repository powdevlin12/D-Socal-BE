import { NextFunction, Request, Response } from 'express'
import Todo from '~/models/schemas/Todo.schema'
import { ITodoRequest } from '~/models/schemas/requests/Todo.request'
import { instanceDatabase } from '~/services/database.service'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

export const addTodoController = async (
  req: Request<ParamsDictionary, any, ITodoRequest>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body
  const result = await instanceDatabase().todos.insertOne(
    new Todo({
      name
    })
  )

  return res.status(201).json(result)
}

export const getAddTodoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await instanceDatabase().todos.find({}).toArray()
  return res.json(result)
}

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  const result = await instanceDatabase().todos.findOneAndDelete({
    _id: new ObjectId(req.params.id)
  })

  return res.status(200).json(result)
}
