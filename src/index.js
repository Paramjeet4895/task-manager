const express = require('express')
require('./DB/mongoose')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const app = express()
const port = process.env.PORT || 3000



// ////PARSE INCOMING JSON TO OBJECT/////
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is running at port ' + port)
})


// const Task=require('./models/task')
// const User=require('./models/user')

// const main =async() => {
//     const task =await Task.findById('5da9b0a2f426495f2c53caf2')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)

//     const user =await User.findById('5da9b07af426495f2c53caf0')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()