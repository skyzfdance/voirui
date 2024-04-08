import type { InjectionKey } from "vue"

export interface ScrollbarContext {
  scrollbarElement: HTMLDivElement | null
  wrapElement: HTMLDivElement | null
}

export const scrollbarContextKey: InjectionKey<ScrollbarContext> = Symbol("scrollbarContextKey")
