const express=require('express')
const router=new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


router.use('/api', swaggerUi.serve);
router.get('/api', swaggerUi.setup(swaggerDocument));

///////////////////////////////////
router.post('/tasks',auth,async(req,res) => {
    //const task=new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    
 })

//////////////////////////////////////////////////////




router.get('/tasks',auth,async(req,res) =>{
    try{
     //const tasks= await  Task.find({owner:req.user._id})
     await req.user.populate('tasks').execPopulate()
     res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})


////////ROUTE PARAMETER//////////////
router.get('/tasks/:id',auth, async(req, res) => {
    //console.log(req.params)
    const _id = req.params.id
    try{
       // const tasks= await Task.find({_id})
       const tasks=await Task.findOne({_id,owner:req.user._id})
        if (!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    }
    catch(e){
        return res.status(500).send()
    }
})





router.patch('/tasks/:id',auth,async(req,res) =>{
    const updates= Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation =updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Updates'})
    }
    try{
  const task= await Task.findOne({_id:req.params.id,owner:req.user._id})
    // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if(!task){
        return res.status(404).send()
    }
    updates.forEach((update)=>task[update]=req.body[update])
    await task.save()
    res.send(task)
    
    }catch(e){
     res.status(400).send(e)
    }


})


//////////////////////////////////////////////////////////////////



router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
      const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
      if(!task){
          return res.status(404).send()
      }
      res.send(task)
    }catch(e){
        return res.status(500).send()
    }
})





////////////////////////////////////////////////////

module.exports=router