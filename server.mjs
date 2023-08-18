import express from 'express'
import path from 'path'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
const __dirname = path.resolve()
import 'dotenv/config'

import authRouter from './routes/auth.mjs'
import postRouter from './routes/posts.mjs'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/mongoDB', authRouter)
app.use(express.static(path.join(__dirname,'public')))

app.use((req,res,next)=>{
    console.log('cookies: ', req.cookies)

    const token = req.cookies.token;

    try {
        var decoded = jwt.verify(token, process.env.SECRET);
        console.log('decoded: ', decoded)

        req.body.decoded = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
        }
        next()
      } catch(err) {
        // err
        res.status(401).send({
            message: 'Invalid token'
        })
      }
})

app.use('/api/v1/mongoDB', postRouter)



const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Example app listening on port ${PORT}`)
})
