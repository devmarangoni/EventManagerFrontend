export const daysOfWeekShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function getMonthName(month: number): string {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]
  return months[month]
}

export function getNumberOfDaysByMonth(month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return daysInMonth[month]
}

export function formatToDateTimeLocal(date: Date | string): string {
  // Garantir que temos uma instância de Date
  const dateObj = typeof date === "string" ? new Date(date) : date

  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0")
  const day = dateObj.getDate().toString().padStart(2, "0")
  const hours = dateObj.getHours().toString().padStart(2, "0")
  const minutes = dateObj.getMinutes().toString().padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function formatToScheduleObjTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toISOString()
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  const day = dateObj.getDate().toString().padStart(2, "0")
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0")
  const year = dateObj.getFullYear()

  return `${day}/${month}/${year}`
}

