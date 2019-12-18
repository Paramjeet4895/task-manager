const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

////////////////////////////////////
//Resource Creation/////
////////////////////////////////////
router.use('/api', swaggerUi.serve);
router.get('/api', swaggerUi.setup(swaggerDocument));

router.post('/addusers', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }

})

///////////////////////////////
// //////////////////////////////////////
// ////Resource Reading/////
// //////////////////////////////////////
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me',auth, async (req, res) => {
        res.send(req.user)
    
})

////////ROUTE PARAMETER//////////////
// router.get('/users/:id', async (req, res) => {
//     //console.log(req.params)
//     const _id = req.params.id
//     try {
//         const users = await User.findById(_id)
//         if (!users) {
//             return res.status(404).send()
//         }
//         res.send(users)
//     } catch (e) {
//         return res.status(500).send()
//     }


// })
///////////////////////////////////////////
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
       const token=await user.generateAuthToken()
        res.send({user,token})
        
    } catch (e) {
        return res.status(400).send()
    }
})

router.post('/users/logout',auth, async (req, res) => {
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        return res.status(400).send()
    }
})


router.post('/users/logoutall',auth, async (req, res) => {
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch (e) {
        return res.status(400).send()
    }
})


/////////////////////////////////////////////////////////////
//////////////////////RESOURCE UPDATING/////////////////////
router.patch('/users/me', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }
    try {
        //const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
      
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }


})

///////////////////////////////////////////////
////////////DELETE TASK AND USER//////////////////
router.delete('/users/me',auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        return res.status(500).send()
    }
})


module.exports = router