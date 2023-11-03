import { api } from "~/utils/api"

export default function Upload() {
    const presigned = api.posts.createPresignedUrl.useMutation()
    
  return (
    <>
      <p>Upload a .png or .jpg image (max 1MB).</p>
      <input
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onChange={async (e) => {
            console.log("działa")
            const mutation = presigned.mutateAsync({postId: "clnyedjt000052zp4xbkac072"})
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            const file = e.target.files?.[0]!
        
            const formData = new FormData()
        
            Object.entries({ ...(await mutation).fields, file}).forEach(([key, value]) => {
            formData.append(key, value as unknown as string)
            })
        
            const upload = await fetch((await mutation).url, {
                method: 'POST',
                body: formData,
            })
        
            if (upload.ok) {
            console.log('Uploaded successfully!')
            } else {
            console.error('Upload failed.')
            console.error(upload.json())
            }
        }}
        type="file"
        accept="image/png, image/jpeg"
      />
    </>
  )
}

