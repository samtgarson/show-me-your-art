import { createContext, Dispatch, SetStateAction } from 'react'
import { Submissions } from '~/types/entities'
import { Artist } from '../artists'

type State = {
  start: boolean
  data: Submissions
}

export const StateContext = createContext<State>({ start: false, data: {} })

export const TransitionState = createContext<
  Dispatch<SetStateAction<Artist | null>>
>(() => null)
