import { useStyleSectionsQuery } from '@/cores/api-queries'
import { useMemo } from 'react'

export const useStyleSections = () => {
  const { data: styleSections = [], isLoading, error } = useStyleSectionsQuery()

  const styleItems = useMemo(() => {
    return styleSections.map((section) => section.styles).flat()
  }, [styleSections])

  return { styleSections, styleItems, isLoading, error }
}
