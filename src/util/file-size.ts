type ImageDimensions = { width: number, height: number }

export const fileSize = (file: File): Promise<ImageDimensions> =>
  new Promise<ImageDimensions>(resolve => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.width, height: img.height })
    }
    img.src = url
  })
