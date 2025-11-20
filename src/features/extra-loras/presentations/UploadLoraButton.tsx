'use client'

import { useUploadLoraMutation } from '@/cores/api-queries'
import { addToast, Button } from '@heroui/react'
import { Upload } from 'lucide-react'

export const UploadLoraButton = () => {
  const uploadMutation = useUploadLoraMutation()

  const handleUploadClick = async () => {
    try {
      const filePath = await globalThis.window.electronAPI.selectFile([
        {
          name: 'LoRA Models',
          extensions: ['safetensors', 'ckpt', 'pt', 'bin', 'pth']
        }
      ])

      if (!filePath) return

      await uploadMutation.mutateAsync(filePath)

      addToast({
        title: 'LoRA uploaded',
        description: 'The LoRA model was uploaded successfully.',
        color: 'success'
      })
    } catch (error) {
      addToast({
        title: 'Upload failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to upload LoRA model.',
        color: 'danger'
      })
    }
  }

  return (
    <Button
      onPress={handleUploadClick}
      startContent={<Upload size={16} />}
      isLoading={uploadMutation.isPending}
      color="primary"
    >
      Upload LoRA
    </Button>
  )
}
