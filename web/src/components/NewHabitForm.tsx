import { Check } from "phosphor-react";

export function NewHabitForm() {
    return (
        <form className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="mt-6 font-semibold leading-tight">
                What is the habit you want to track?
            </label>
            
            <input 
                type="text" 
                name="name" 
                id="name" 
                placeholder="e.g. Read 30 minutes a day, drink water, etc"
                autoFocus
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
            />

            <label htmlFor="" className="mt-6 font-semibold leading-tight">
                What are the days you want to track this habit?
            </label>
            

            <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500">
                <Check size={20} weight="bold" />
                Confirm
            </button>

        </form>
    )
}