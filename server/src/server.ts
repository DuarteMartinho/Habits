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
    port: 3000,
    host: '0.0.0.0',
}).then(() => {
    console.log('Server listening on port 3333')
})

export default async (req: any, res: any) => {
    await app.ready();
    app.server.emit('request', req, res);
}