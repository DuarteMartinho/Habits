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

    const toggleHabit = z.object({
        id: z.string().uuid(),
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

    app.patch('/habits/:id/toggle', async (request) => { 

        const { id } = toggleHabit.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            },
        })

        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }

        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }    
            }
        })

        if (dayHabit) {
            await prisma.dayHabit.delete({
                where: {
                    day_id_habit_id: {
                        day_id: day.id,
                        habit_id: id
                    }
                }
            })
        } else {
            await prisma.dayHabit.create({  
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }
    })  

    app.get('/summary', async (request) => {

        const summary = await prisma.$queryRaw`
            SELECT 
                D.id, 
                D.date,
                (
                    SELECT 
                        cast(COUNT(*) as float) 
                    FROM day_habits DH 
                    WHERE DH.day_id = D.id
                ) as completed,
                (
                    SELECT
                        cast(COUNT(*) as float)
                    FROM habit_week_days HWD
                    JOIN habits H 
                        ON H.id = HWD.habit_id
                    WHERE 
                        HWD.week_day = cast(strftime('%w', D.date/1000, 'unixepoch') as int) 
                        AND H.creadtedAt <= D.date
                        
                ) as possible
            FROM day D 
        `;
        return summary

    })


}