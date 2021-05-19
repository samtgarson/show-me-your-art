export type Artist = {
  id: string
  name: string
  bg: string
  fg: 'dark' | 'light'
}

export const artists: Record<string, Artist> = {
  burrill: {
    id: 'burrill',
    bg: '#FBBD1D',
    fg: 'dark',
    name: 'Anthony Burrill'
  },
  enzo: {
    id: 'enzo',
    name: 'Enzo Mari',
    bg: '#0A187F',
    fg: 'light'
  },
  walala: {
    id: 'walala',
    name: 'Camille Walala',
    bg: '#62C5BE',
    fg: 'dark'
  },
  favre: {
    id: 'favre',
    name: 'Malika Favre',
    bg: '#DF001A',
    fg: 'light'
  },
  jullien: {
    id: 'jullien',
    name: 'Jean Jullien',
    bg: '#E76037',
    fg: 'dark'
  },
  faure: {
    id: 'faure',
    name: 'Marylou Faure',
    bg: '#F3B0EE',
    fg: 'dark'
  },
  bingo: {
    id: 'bingo',
    name: 'Mr Bingo',
    bg: '#000',
    fg: 'light'
  }
}
