require('../src/DB/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5da7fb8ef4b3701f11273409').then((task) =>{
//     console.log(task)
//     return Task.countDocuments({completed:false})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount=async (id) =>{
   await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:false})
    return count
}
deleteTaskAndCount('5da7fb95649d961f26837918').then((count) =>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})