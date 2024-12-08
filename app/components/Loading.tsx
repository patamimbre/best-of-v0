import { LoaderIcon } from "lucide-react"

export function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <LoaderIcon className="animate-spin" size={48} />
    </div>
  )
}
