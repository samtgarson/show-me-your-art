import { createContext } from "react"
import { Submissions } from "~/types/data"

type State = {
  start: boolean
  data: Submissions
}

export const StateContext = createContext<State>({ start: false, data: {} })
