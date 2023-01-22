"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const prisma_1 = require("./lib/prisma");
const zod_1 = require("zod");
const dayjs_1 = __importDefault(require("dayjs"));
async function appRoutes(app) {
    const createHabitBody = zod_1.z.object({
        title: zod_1.z.string(),
        weekDays: zod_1.z.array(zod_1.z.number().min(0).max(6))
    });
    const getDayBody = zod_1.z.object({
        date: zod_1.z.coerce.date(),
    });
    const toggleHabit = zod_1.z.object({
        id: zod_1.z.string().uuid(),
    });
    app.post('/create-habit', async (request) => {
        const { title, weekDays } = createHabitBody.parse(request.body);
        const today = (0, dayjs_1.default)().startOf('day').toDate();
        await prisma_1.prisma.habit.create({
            data: {
                name: title,
                creadtedAt: today,
                weekDays: {
                    create: weekDays.map(weekDay => ({
                        week_day: weekDay
                    }))
                }
            }
        });
    });
    app.get('/', async (request) => {
        return { text: 'Welcome to the API' };
    });
    app.get('/day', async (request) => {
        const { date } = getDayBody.parse(request.query);
        const parsedDate = (0, dayjs_1.default)(date).startOf('day');
        const weekDay = parsedDate.get('day');
        const possibleHabits = await prisma_1.prisma.habit.findMany({
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
        });
        const day = await prisma_1.prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabit: true
            }
        });
        const completedHabits = day?.dayHabit.map(dayHabit => dayHabit.habit_id) ?? [];
        return {
            possibleHabits,
            completedHabits
        };
    });
    app.patch('/habits/:id/toggle', async (request) => {
        const { id } = toggleHabit.parse(request.params);
        const today = (0, dayjs_1.default)().startOf('day').toDate();
        let day = await prisma_1.prisma.day.findUnique({
            where: {
                date: today
            },
        });
        if (!day) {
            day = await prisma_1.prisma.day.create({
                data: {
                    date: today
                }
            });
        }
        const dayHabit = await prisma_1.prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        });
        if (dayHabit) {
            await prisma_1.prisma.dayHabit.delete({
                where: {
                    day_id_habit_id: {
                        day_id: day.id,
                        habit_id: id
                    }
                }
            });
        }
        else {
            await prisma_1.prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            });
        }
    });
    app.get('/summary', async (request) => {
        const summary = await prisma_1.prisma.$queryRaw `
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
        return summary;
    });
}
exports.appRoutes = appRoutes;
