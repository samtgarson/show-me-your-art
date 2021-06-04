import cn from 'classnames'
import type { Point } from 'geojson'
import { MapboxGeoJSONFeature } from 'mapbox-gl'
import React, { FC, useCallback, useContext, useMemo, useState } from 'react'
import { Marker } from 'react-map-gl'
import { SubmissionWithMeta } from '~/types/entities'
import { StateContext } from 'src/services/state'
import { debounce } from 'src/util/debounce'
import { submissionImageSrc } from 'src/components/submission-panel'
import { Artist } from '~/src/artists'

export type MarkerClickEvent =
  | { cluster: true, clusterId: number, geom: Point }
  | { cluster: false, sub: SubmissionWithMeta }

type SubmissionMarkerProps = {
  feature: MapboxGeoJSONFeature
  selectedSubmission?: SubmissionWithMeta
  geom: Point
  id: string
  onClick(evt: MarkerClickEvent): void
  artist: Artist
  hidden?: boolean
  i: number
}

export const SubmissionMarker: FC<SubmissionMarkerProps> = ({
  feature,
  selectedSubmission,
  geom,
  id,
  onClick,
  artist,
  hidden = false,
  i
}) => {
  const { data } = useContext(StateContext)
  const { sub, cluster, selected, big, content, notSelected } = useMemo(() => {
    const sub = data[feature.properties?.id]
    const cluster = feature.properties?.cluster
    const selected = selectedSubmission?.id == id
    const big = selected || cluster
    const content = cluster ? feature.properties?.point_count : '×'
    const notSelected = selectedSubmission && !selected
    return { sub, cluster, selected, big, content, notSelected }
  }, [data, feature, id, selectedSubmission])

  const clickHandler = useCallback(() => {
    if (cluster) onClick({ cluster: true, clusterId: parseInt(id, 10), geom })
    else onClick({ cluster: false, sub })
  }, [cluster, geom, id, onClick, sub])

  const classes = useMemo(
    () =>
      cn(
        'transition-all flex items-center justify-center text-white cursor-pointer transform hover:scale-110 duration-300',
        {
          relative: !big,
          'font-thin text-3xl': selected,
          'font-bold text-xl': cluster,
          'opacity-0 pointer-events-none': hidden,
          '': notSelected
        }
      ),
    [big, cluster, hidden, notSelected, selected]
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
            backgroundColor: artist.bg,
            color: !big ? artist.bg : 'white',
            width: big ? 35 : 12,
            height: big ? 35 : 12,
            margin: big ? 0 : 12,
            transitionDelay: notSelected ? `${i * 10}ms` : '0ms'
          }}
          onClick={clickHandler}
        >
          {content}
        </span>
      </Marker>
      {sub && hover && !selected && !hidden && (
        <div
          className='hidden sm:block fixed top-0 left-0 z-40 p-4 bg-white'
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
