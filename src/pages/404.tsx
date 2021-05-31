import React, { useEffect, useRef } from 'react'
import { NextPage } from 'next'
import {
  Bodies,
  Composites,
  Engine,
  MouseConstraint,
  Mouse,
  Render,
  Composite,
  Constraint,
  IEngineDefinition
} from 'matter-js'
import { Btn } from '../components/button'

const sprites = [
  { name: 'show', width: 265.8 },
  { name: 'me', width: 124.6 },
  { name: 'your', width: 264.3 },
  { name: 'art', width: 200.7 }
]

const FourOhFour: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const { innerHeight: height, innerWidth: width } = window
    const engine = Engine.create({} as IEngineDefinition)
    const render = Render.create({
      engine,
      canvas: canvasRef.current ?? undefined,
      options: {
        background: '#000',
        wireframes: false,
        width,
        height
      }
    })

    const words = Composites.stack(
      width / 2 - 100, // x
      -70 * 4, // y
      1, // cols
      4, // rows
      0, // col gap
      5, // row gap
      (
        x: number,
        y: number,
        _col: unknown,
        _row: unknown,
        _prev: unknown,
        i: number
      ) => {
        const sprite = sprites[i]
        return Bodies.rectangle(x, y, sprite.width, 70, {
          render: {
            sprite: {
              texture: `sprites/${sprite.name}.png`,
              xScale: 0.5,
              yScale: 0.5
            }
          }
        })
      }
    )

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      } as Constraint
    })

    const frameOpts = { isStatic: true }

    Composite.add(
      engine.world,
      Bodies.rectangle(-50, height / 2, 100, height * 10, frameOpts)
    )
    Composite.add(
      engine.world,
      Bodies.rectangle(width + 50, height / 2, 100, height * 10, frameOpts)
    )
    Composite.add(
      engine.world,
      Bodies.rectangle(width / 2, height + 50, width, 100, frameOpts)
    )
    Composite.add(engine.world, mouseConstraint.constraint)
    Composite.add(engine.world, words)

    Engine.run(engine)
    Render.run(render)
  }, [])

  return (
    <section className='fixed flex flex-col items-center justify-center w-screen h-screen text-white bg-black'>
      <canvas
        ref={canvasRef}
        className='absolute top-0 bottom-0 left-0 right-0 w-screen h-screen'
      />
      <p className='z-10 block mb-8 font-bold'>
        Sorry, something&apos;s gone wrong
      </p>
      <Btn href='/' className='z-10'>
        Back to homepage
      </Btn>
    </section>
  )
}

export default FourOhFour
