import dayjs from 'dayjs'

class DateFormatter {
  time(value: string) {
    return dayjs(value).format('HH:mm')
  }

  date(value: string) {
    return dayjs(value).format('MMM D, YYYY')
  }
}

export const dateFormatter = new DateFormatter()
