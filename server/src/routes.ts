import { prisma } from "./lib/prisma"
import { z } from 'zod'
import {FastifyInstance} from "fastify"
import dayjs from "dayjs"

export async function appRoutes(app: FastifyInstance) {
    const createHabitBody = z.object({
        title: z.string(),
        weekDays: z.array(
            z.number().min(0).max(6)
        )
    })

    const getDayBody = z.object({
        date: z.coerce.date(),
    })

    app.post('/create-habit', async (request) => {
        const {title, weekDays} = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data: {
                name: title,
                creadtedAt: today,
                weekDays: {
                    create: weekDays.map(weekDay => ({
                        week_day: weekDay
                    }))
                }
            }
        })
    })

    
    app.get('/day', async (request) => {
        const { date } = getDayBody.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')

        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where: {
                creadtedAt: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }

            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabit: true
            }
        })

        const completedHabits = day?.dayHabit.map(dayHabit => dayHabit.habit_id);

        return {
            possibleHabits, 
            completedHabits
        }
    })

    app.post('/toggle-habit', async (request) => {    
        
    })  

    app.post('/resume', async (request) => {

    })


}