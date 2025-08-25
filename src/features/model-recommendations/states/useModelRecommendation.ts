import { api, useModelRecommendationsQuery } from '@/services'
import { socket, SocketEvents } from '@/sockets'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ModelRecommendationFormProps } from '../types'

export const useModelRecommendation = () => {
  const router = useRouter()
  const methods = useForm<ModelRecommendationFormProps>()
  const { data } = useModelRecommendationsQuery()
  const { setValue } = methods

  const onSubmit: SubmitHandler<ModelRecommendationFormProps> = async (values) => {
    const id = values.id

    if (id) {
      await api.downloadModel(id)
    }
  }

  const onDownloadCompleted = useCallback(() => {
    router.replace('/editor')
  }, [router])

  useEffect(() => {
    socket.on(SocketEvents.DOWNLOAD_COMPLETED, onDownloadCompleted)

    return () => {
      socket.off(SocketEvents.DOWNLOAD_COMPLETED, onDownloadCompleted)
    }
  }, [onDownloadCompleted, router])

  useEffect(() => {
    if (data) {
      setValue('id', data.default_selected_id)
    }
  }, [data, setValue])

  return { methods, onSubmit, data }
}
