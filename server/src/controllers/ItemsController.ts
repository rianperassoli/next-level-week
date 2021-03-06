import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {

  async index(request: Request, response: Response) {
    const items = await knex('item')

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        imageUrl: `http://192.168.1.14:3333/uploads/${item.image}`
      }
    })

    return response.json(serializedItems)
  }

}

export default ItemsController