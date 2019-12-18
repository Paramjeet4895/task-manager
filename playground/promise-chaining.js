require('../src/DB/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5da7f57f738e201bc841ea27',{age:1}).then((user) =>{
//     console.log(user)
//     return User.countDocuments({age :1})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

//////////ASYNC -AWAIT//////////////
const updateAgeAndCount=async (id,age) =>{
    const user=await User.findByIdAndUpdate(id,{age})
    const count=await User.countDocuments({age})
    return count
}
updateAgeAndCount('5da709d0c1fc905fabcfe340',20).then((count) =>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})