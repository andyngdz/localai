import { motion } from 'framer-motion'
import { Key, PropsWithChildren } from 'react'

export interface SkeletonLoaderBlockProps {
  key: Key
}

export const SkeletonFadeBlock = ({
  key,
  children
}: PropsWithChildren<SkeletonLoaderBlockProps>) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
