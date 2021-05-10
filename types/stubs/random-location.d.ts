declare module 'random-location' {
  type Coordinates = {
    latitude: number
    longitude: number
  }

  type RNG = () => number

  export function randomCirclePoint (centerPoint: Coordinates, radius: number, randomFn?: RNG): Coordinates
  export function randomCircumferencePoint (centerPoint: Coordinates, radius: number, randomFn?: RNG): Coordinates
  export function randomAnnulusPoint (centerPoint: Coordinates, innerRadius: number, outerRadius: number, randomFn?: RNG): Coordinates
}
