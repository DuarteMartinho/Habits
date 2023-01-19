import dayjs from "dayjs";


export function generateDates() {
  const firstDay = dayjs().startOf("year");
  const today = new Date();

  const dates = [];
  let comparedate = firstDay;

  while (comparedate.isBefore(today)) {
    dates.push(comparedate.toDate());
    comparedate = comparedate.add(1, "day");
  }

  return dates;
}