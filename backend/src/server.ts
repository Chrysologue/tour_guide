import 'dotenv/config'
import express from 'express'
import {connectToDatabase} from './config/db.js'
import authRoutes from './routes/authRoutes.js';
import circuitRoutes from './routes/circuitRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import siteSettingRoutes from './routes/siteSettingRoutes.js'
import { Request, Response, NextFunction } from 'express'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes);
app.use('/api/circuits', circuitRoutes);
app.use("/api/medias", mediaRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/inquiries", inquiryRoutes)
app.use('/api/settings', siteSettingRoutes);
const port = process.env.PORT

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({message: "Welcome to Tour Guide API"})
})

app.use((req: Request, res: Response, next: NextFunction) => {
    next({status: 404, error: "Something went wrong"})
})

app.use((err:any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500
    const errorMessage = status === 404 ? err.error : "Internal server error"
    return res.status(status).json({error: errorMessage})
})

connectToDatabase()
.then(() => {
    app.listen(port, () => console.log("Listening on port", port))
}).catch(err => {
    console.error(err.message)
    process.exit(1)
})