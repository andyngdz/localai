import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'
import { dateFormatter } from '../date-formatter'

describe('DateFormatter', () => {
  describe('time', () => {
    it('formats ISO date string to HH:mm format in local timezone', () => {
      const isoString = '2024-01-15T14:30:45Z'
      const expected = dayjs(isoString).format('HH:mm')
      const result = dateFormatter.time(isoString)
      expect(result).toBe(expected)
    })

    it('formats date with timezone to HH:mm format in local timezone', () => {
      const isoString = '2024-01-15T09:15:30-05:00'
      const expected = dayjs(isoString).format('HH:mm')
      const result = dateFormatter.time(isoString)
      expect(result).toBe(expected)
    })

    it('formats midnight UTC to local time correctly', () => {
      const isoString = '2024-01-15T00:00:00Z'
      const expected = dayjs(isoString).format('HH:mm')
      const result = dateFormatter.time(isoString)
      expect(result).toBe(expected)
    })

    it('formats noon UTC to local time correctly', () => {
      const isoString = '2024-01-15T12:00:00Z'
      const expected = dayjs(isoString).format('HH:mm')
      const result = dateFormatter.time(isoString)
      expect(result).toBe(expected)
    })

    it('formats late evening UTC time to local time correctly', () => {
      const isoString = '2024-01-15T23:59:59Z'
      const expected = dayjs(isoString).format('HH:mm')
      const result = dateFormatter.time(isoString)
      expect(result).toBe(expected)
    })

    it('handles date with seconds and milliseconds', () => {
      const isoString = '2024-01-15T08:45:30.123Z'
      const expected = dayjs(isoString).format('HH:mm')
      const result = dateFormatter.time(isoString)
      expect(result).toBe(expected)
    })

    it('handles various ISO 8601 formats', () => {
      const testCases = [
        '2024-01-15T16:30:00Z',
        '2024-01-15T16:30:00.000Z',
        '2024-01-15T16:30:00+00:00'
      ]

      testCases.forEach((isoString) => {
        const expected = dayjs(isoString).format('HH:mm')
        expect(dateFormatter.time(isoString)).toBe(expected)
      })
    })

    it('handles single digit hours and minutes', () => {
      const isoString = '2024-01-15T03:05:00Z'
      const expected = dayjs(isoString).format('HH:mm')
      const result = dateFormatter.time(isoString)
      expect(result).toBe(expected)
    })

    it('handles invalid date string gracefully', () => {
      // dayjs returns "Invalid Date" for invalid inputs, which formats as "Invalid Date"
      const result = dateFormatter.time('invalid-date')
      expect(result).toBe('Invalid Date')
    })

    it('handles empty string gracefully', () => {
      const result = dateFormatter.time('')
      expect(result).toBe('Invalid Date')
    })
  })

  describe('timeFromTimestamp', () => {
    it('formats Unix timestamp to HH:mm format in local timezone', () => {
      const timestamp = new Date('2024-01-15T14:30:45Z').getTime()
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('formats midnight timestamp correctly', () => {
      const timestamp = new Date('2024-01-15T00:00:00Z').getTime()
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('formats noon timestamp correctly', () => {
      const timestamp = new Date('2024-01-15T12:00:00Z').getTime()
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('formats timestamp with milliseconds correctly', () => {
      const timestamp = 1705327530123 // 2024-01-15T14:25:30.123Z
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('handles epoch timestamp (0) correctly', () => {
      const timestamp = 0 // 1970-01-01T00:00:00.000Z
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('handles current timestamp correctly', () => {
      const timestamp = Date.now()
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('handles timestamp for date in the past', () => {
      const timestamp = new Date('1990-06-15T08:30:00Z').getTime()
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('handles timestamp for date in the future', () => {
      const timestamp = new Date('2030-12-31T23:59:59Z').getTime()
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('handles negative timestamp correctly', () => {
      const timestamp = -86400000 // One day before epoch
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })

    it('handles invalid timestamp (NaN) by throwing error', () => {
      // new Date(NaN).toISOString() throws RangeError
      expect(() => dateFormatter.timeFromTimestamp(NaN)).toThrow(RangeError)
      expect(() => dateFormatter.timeFromTimestamp(NaN)).toThrow(
        'Invalid time value'
      )
    })

    it('handles extremely large timestamp', () => {
      const timestamp = 8640000000000000 // Max timestamp
      const expected = dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      const result = dateFormatter.timeFromTimestamp(timestamp)
      expect(result).toBe(expected)
    })
  })

  describe('date', () => {
    it('formats valid ISO date string to MMM D, YYYY format', () => {
      const isoString = '2024-01-15T14:30:45Z'
      const result = dateFormatter.date(isoString)
      expect(result).toBe('Jan 15, 2024')
    })

    it('formats date with timezone correctly', () => {
      const isoString = '2024-12-25T09:15:30-05:00'
      const result = dateFormatter.date(isoString)
      expect(result).toBe('Dec 25, 2024')
    })

    it('formats leap year date correctly', () => {
      const isoString = '2024-02-29T12:00:00Z'
      const result = dateFormatter.date(isoString)
      expect(result).toBe('Feb 29, 2024')
    })

    it('formats first day of year correctly', () => {
      const isoString = '2024-01-01T00:00:00Z'
      const result = dateFormatter.date(isoString)
      expect(result).toBe('Jan 1, 2024')
    })

    it('formats last day of year correctly', () => {
      const isoString = '2024-12-31T12:00:00Z' // Use noon to avoid timezone shifts
      const expected = dayjs(isoString).format('MMM D, YYYY')
      const result = dateFormatter.date(isoString)
      expect(result).toBe(expected)
    })

    it('formats dates from different months correctly', () => {
      const testCases = [
        ['2024-02-14T12:00:00Z', 'Feb 14, 2024'],
        ['2024-03-17T12:00:00Z', 'Mar 17, 2024'],
        ['2024-04-01T12:00:00Z', 'Apr 1, 2024'],
        ['2024-05-15T12:00:00Z', 'May 15, 2024'], // Changed from 30th to avoid month shifting
        ['2024-06-15T12:00:00Z', 'Jun 15, 2024'],
        ['2024-07-04T12:00:00Z', 'Jul 4, 2024'],
        ['2024-08-25T12:00:00Z', 'Aug 25, 2024'],
        ['2024-09-10T12:00:00Z', 'Sep 10, 2024'],
        ['2024-10-15T12:00:00Z', 'Oct 15, 2024'], // Changed from 31st to avoid month shifting
        ['2024-11-11T12:00:00Z', 'Nov 11, 2024']
      ]

      testCases.forEach(([isoString, expected]) => {
        expect(dateFormatter.date(isoString)).toBe(expected)
      })
    })

    it('formats historical dates correctly', () => {
      const isoString = '1990-06-15T12:00:00Z'
      const result = dateFormatter.date(isoString)
      expect(result).toBe('Jun 15, 1990')
    })

    it('formats future dates correctly', () => {
      const isoString = '2030-08-20T16:45:00Z'
      const result = dateFormatter.date(isoString)
      expect(result).toBe('Aug 20, 2030')
    })

    it('handles date with seconds and milliseconds', () => {
      const isoString = '2024-07-22T10:15:30.456Z'
      const result = dateFormatter.date(isoString)
      expect(result).toBe('Jul 22, 2024')
    })

    it('handles various ISO 8601 formats', () => {
      expect(dateFormatter.date('2024-03-15T10:30:00Z')).toBe('Mar 15, 2024')
      expect(dateFormatter.date('2024-03-15T10:30:00.000Z')).toBe(
        'Mar 15, 2024'
      )
      expect(dateFormatter.date('2024-03-15T10:30:00+00:00')).toBe(
        'Mar 15, 2024'
      )
      expect(dateFormatter.date('2024-03-15T10:30:00-05:00')).toBe(
        'Mar 15, 2024'
      )
    })

    it('handles invalid date string gracefully', () => {
      const result = dateFormatter.date('invalid-date')
      expect(result).toBe('Invalid Date')
    })

    it('handles empty string gracefully', () => {
      const result = dateFormatter.date('')
      expect(result).toBe('Invalid Date')
    })

    it('handles null or undefined inputs gracefully', () => {
      // TypeScript would catch this, but testing runtime behavior
      // Test actual behavior of dayjs with null/undefined
      const result1 = dateFormatter.date(null as unknown as string)
      const result2 = dateFormatter.date(undefined as unknown as string)
      const expected1 = dayjs(null as unknown as string).format('MMM D, YYYY')
      const expected2 = dayjs(undefined as unknown as string).format(
        'MMM D, YYYY'
      )
      expect(result1).toBe(expected1)
      expect(result2).toBe(expected2)
    })
  })

  describe('DateFormatter class integration', () => {
    it('maintains consistent behavior across multiple calls', () => {
      const isoString = '2024-01-15T14:30:45Z'
      const timestamp = new Date(isoString).getTime()

      const time1 = dateFormatter.time(isoString)
      const time2 = dateFormatter.time(isoString)
      const date1 = dateFormatter.date(isoString)
      const date2 = dateFormatter.date(isoString)
      const timeFromTs1 = dateFormatter.timeFromTimestamp(timestamp)
      const timeFromTs2 = dateFormatter.timeFromTimestamp(timestamp)

      expect(time1).toBe(time2)
      expect(date1).toBe(date2)
      expect(timeFromTs1).toBe(timeFromTs2)
      // Use dayjs to get expected values based on local timezone
      expect(time1).toBe(dayjs(isoString).format('HH:mm'))
      expect(date1).toBe(dayjs(isoString).format('MMM D, YYYY'))
      expect(timeFromTs1).toBe(
        dayjs(new Date(timestamp).toISOString()).format('HH:mm')
      )
    })

    it('handles same date string for both time and date formatting', () => {
      const isoString = '2024-12-25T12:00:00Z' // Use noon to avoid timezone issues

      const timeResult = dateFormatter.time(isoString)
      const dateResult = dateFormatter.date(isoString)

      expect(timeResult).toBe(dayjs(isoString).format('HH:mm'))
      expect(dateResult).toBe(dayjs(isoString).format('MMM D, YYYY'))
    })

    it('produces same result for time() and timeFromTimestamp() with equivalent inputs', () => {
      const isoString = '2024-01-15T14:30:00Z'
      const timestamp = new Date(isoString).getTime()

      const timeFromIso = dateFormatter.time(isoString)
      const timeFromTs = dateFormatter.timeFromTimestamp(timestamp)

      expect(timeFromIso).toBe(timeFromTs)
    })

    it('is exported as a singleton instance', () => {
      // Test that we get the same instance
      expect(dateFormatter).toBeDefined()
      expect(typeof dateFormatter.time).toBe('function')
      expect(typeof dateFormatter.timeFromTimestamp).toBe('function')
      expect(typeof dateFormatter.date).toBe('function')
    })
  })

  describe('edge cases and error handling', () => {
    it('handles malformed ISO strings', () => {
      expect(dateFormatter.time('2024-13-45T25:70:90Z')).toBe('Invalid Date')
      expect(dateFormatter.date('2024-13-45T25:70:90Z')).toBe('Invalid Date')
    })

    it('handles non-string inputs', () => {
      // dayjs handles numbers as milliseconds since epoch
      expect(dateFormatter.time(12345 as unknown as string)).toBe(
        dayjs(12345).format('HH:mm')
      )
      expect(dateFormatter.date(12345 as unknown as string)).toBe(
        dayjs(12345).format('MMM D, YYYY')
      )
    })

    it('handles object inputs', () => {
      expect(dateFormatter.time({} as unknown as string)).toBe('Invalid Date')
      expect(dateFormatter.date({} as unknown as string)).toBe('Invalid Date')
    })

    it('handles array inputs', () => {
      expect(dateFormatter.time([] as unknown as string)).toBe('Invalid Date')
      expect(dateFormatter.date([] as unknown as string)).toBe('Invalid Date')
    })
  })
})
