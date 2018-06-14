import * as R from 'ramda'
import { DeepFull } from './utils'
import { DeepPathOf as PathOf, DeepTypeOf as TypeOf, PathAppend } from './deep-path'

const lensPath = <T, P extends PathOf<T>>(p: P) =>
  R.lensPath<TypeOf<T, P>, T>(p)
type Lens<T, Path extends PathOf<T> | void> = (
  Path extends PathOf<T> ?
    R.ManualLens<TypeOf<T, Path>, T> :
    R.ManualLens<T, T>
)

type PrettyLens<
  T,
  Path extends PathOf<T> | void,
> = Lens<T, Path> & (Path extends PathOf<T> ? {
  [K in keyof TypeOf<T, Path>]: PrettyLens<T, PathAppend<T, Path, K>>
} : {
  [K in keyof T]: PrettyLens<T, [ K ]>
})

function nestedLensPath<T, Path extends PathOf<T>>(p: Path): PrettyLens<T, Path> {
  let handler = {
    get<N extends keyof TypeOf<T, Path> >(target: PrettyLens<T, Path>, name: N) {
      return nestedLensPath<T, PathAppend<T, Path, N>>(
        [ ...p, name ] as PathAppend<T, Path, N>
      )
    }
  }
  return new Proxy(lensPath<T, Path>(p), handler) as PrettyLens<T, Path>
}

function PrettyLens<T>() {
  let lens = R.lens<T, T>((t: T) => t, (t: T) => t) 
  let handler = {
    get<N extends keyof T>(target: typeof lens, name: N) {
      return nestedLensPath<T, [ N ]>([ name ])
    }
  }
  return new Proxy(lens, handler) as PrettyLens<T, void>
}

namespace PrettyLens {
  export type Path<T> = PathOf<T>
  export type Focus<T, P extends Path<T>> = TypeOf<T, P>
}

export default PrettyLens
