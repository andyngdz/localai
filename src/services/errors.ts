export const standardizeErrorMessage = (
  error: Error,
  defaultMessage: string
) => {
  return error.message || defaultMessage
}
