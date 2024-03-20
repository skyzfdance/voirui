import { SizeEnum } from "/@/enums/sizeEnum"

export interface LoadingProps {
  tips: string
  size: SizeEnum
  absolute: boolean
  loading: boolean
  background: string
  theme: "dark" | "light"
}
