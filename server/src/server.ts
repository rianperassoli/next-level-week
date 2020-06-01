import express from 'express'

const app = express()

app.get('/users', (request, respose) => {
  respose.json([
    'Diego',
    'Cleiton',
    'Robson',
    'Rian',
  ])
})

app.listen(3333, () => {
  console.log('listening on port 3333')
});