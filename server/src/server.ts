import Fastify from "fastify"
import cors from "@fastify/cors"
import { appRoutes } from "./routes"


// Read the .env file.
import * as dotenv from "dotenv";
dotenv.config();

const app = Fastify()


app.register(cors)
app.register(appRoutes)

app.listen({
    port: 80,
    host: '0.0.0.0',
}).then(() => {
    console.log('Server listening on port 80')
})

module.exports = app;