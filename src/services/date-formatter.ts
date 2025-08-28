import dayjs from 'dayjs'

class DateFormatter {
  time(value: string) {
    return dayjs(value).format('HH:mm')
  }
}

export const dateFormatter = new DateFormatter()
