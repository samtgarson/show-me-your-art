import cn from 'classnames'
import type { Point } from 'geojson'
import { MapboxGeoJSONFeature } from 'mapbox-gl'
import React, { FC, useCallback, useContext, useMemo, useState } from 'react'
import { Marker } from 'react-map-gl'
import { SubmissionWithMeta } from '~/types/entities'
import { StateContext } from '../services/state'
import { debounce } from '../util/debounce'
import { submissionImageSrc } from './submission-panel'

export type MarkerClickEvent =
  | { cluster: true, clusterId: number, geom: Point }
  | { cluster: false, sub: SubmissionWithMeta }

type SubmissionMarkerProps = {
  feature: MapboxGeoJSONFeature
  selectedSubmission?: SubmissionWithMeta
  geom: Point
  id: string
  onClick(evt: MarkerClickEvent): void
  artist: string
  hidden?: boolean
}

export const SubmissionMarker: FC<SubmissionMarkerProps> = ({
  feature,
  selectedSubmission,
  geom,
  id,
  onClick,
  artist,
  hidden = false
}) => {
  const { data } = useContext(StateContext)
  const { sub, cluster, selected, big, content } = useMemo(() => {
    const sub = data[feature.properties?.id]
    const cluster = feature.properties?.cluster
    const selected = selectedSubmission?.id == id
    const big = selected || cluster
    const content = cluster ? feature.properties?.point_count : '×'
    return { sub, cluster, selected, big, content }
  }, [data, feature, id, selectedSubmission])

  const clickHandler = useCallback(() => {
    if (cluster) onClick({ cluster: true, clusterId: parseInt(id, 10), geom })
    else onClick({ cluster: false, sub })
  }, [cluster, geom, id, onClick, sub])

  const classes = useMemo(
    () =>
      cn(
        'transition flex items-center justify-center text-white cursor-pointer transform hover:scale-110 duration-300',
        {
          relative: !big,
          'font-thin text-3xl': selected,
          'font-bold text-xl': cluster,
          'opacity-0 pointer-events-none': hidden
        }
      ),
    [big, cluster, hidden, selected]
  )

  const [hover, setHover] = useState(false)
  const [[x, y], setPosition] = useState<[number, number]>([0, 0])

  return (
    <>
      <Marker
        key={id}
        latitude={geom.coordinates[1]}
        longitude={geom.coordinates[0]}
        offsetTop={-20}
        offsetLeft={-20}
        capturePointerMove={true}
        captureDrag={!hidden}
        captureClick={!hidden}
      >
        <span
          onMouseOver={() => setHover(true)}
          onMouseOut={() => setHover(false)}
          onMouseMove={debounce(
            (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
              setPosition([e.clientX, e.clientY])
            }
          )}
          className={classes}
          style={{
            backgroundColor: `var(--${artist})`,
            color: !big ? `var(--${artist})` : 'white',
            width: big ? 40 : 16,
            height: big ? 40 : 16,
            margin: big ? 0 : 12
          }}
          onClick={clickHandler}
        >
          {content}
        </span>
      </Marker>
      {sub && hover && !selected && !hidden && (
        <div
          className='fixed bg-white p-4 top-0 left-0 z-50'
          style={{
            transform: `translate(${x + 10}px, ${y + 10}px)`,
            width: 200
          }}
        >
          <img width='100%' src={submissionImageSrc(sub)} />
        </div>
      )}
    </>
  )
}
