import express from 'express'
import knex from './database/connection'

const routes = express.Router()

routes.get('/items', async (request, response) => {
  const items = await knex('item').select('*')

  const serializedItems = items.map(item => {
    return {
      id: item.id,
      title: item.title,
      imageUrl: `http://localhost:3333/uploads/${item.image}`
    }
  })

  return response.json(serializedItems)
})

routes.post('/points', async (request, response) => {
  const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body

  const trx = await knex.transaction()

  const insertedIds = await trx('point').insert({ image: 'image-fake', name, email, whatsapp, latitude, longitude, city, uf })

  const point_id = insertedIds[0]

  const pointItems = items.map((item_id: number) => {
    return { item_id, point_id }
  })

  await trx('point_item').insert(pointItems)

  return response.json({ success: true })
})

export default routes
