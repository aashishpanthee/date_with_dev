const express = require('express')

const app = express()

app.use('/test', (req, res) => {
  res.send('Hi from testpage')
})
app.use('/', (req, res) => {
  res.send('Hi from homepage')
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
