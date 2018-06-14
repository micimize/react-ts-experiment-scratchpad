import * as R from 'ramda'
import { DeepPathOf, DeepTypeOf, PathAppend } from './deep-path'

import { DeepFull } from './utils'

type PathOf<T> = DeepPathOf<DeepFull<T>>
type TypeOf<T, Path extends PathOf<T>> = DeepTypeOf<DeepFull<T>, Path>

const optLensPath = <T, P extends PathOf<T>>(p: P) =>
  R.lensPath<TypeOf<T, P> | undefined, T>(p)

type NestedPrettyLens<
  T,
  Path extends PathOf<T>,
  DT extends TypeOf<T, Path> = TypeOf<T, Path> 
> = R.ManualLens<DT | undefined, T> & {
  [K in keyof DT]-?: NestedPrettyLens<T, PathAppend<DeepFull<T>, Path, K>>
}

type TopPrettyLens<T> = R.ManualLens<T, T> & {
  [K in keyof T]-?: NestedPrettyLens<T, [ K ]>
}

function nestedLensPath<T, Path extends PathOf<T>>(p: Path): NestedPrettyLens<T, Path> {
  let handler = {
    get<N extends keyof TypeOf<T, Path> >(target: NestedPrettyLens<T, Path>, name: N) {
      return nestedLensPath<T, PathAppend<DeepFull<T>, Path, N>>(
        [ ...p, name ] as PathAppend<DeepFull<T>, Path, N>
      )
    }
  }
  return new Proxy(optLensPath<T, Path>(p), handler) as NestedPrettyLens<T, Path>
}

type PrettyLens<T, Path extends PathOf<T> = never> =
  Path extends never ? TopPrettyLens<T> : NestedPrettyLens<T, Path>

function PrettyLens<T>() {
  let lens = R.lens((t: T) => t, (t: T) => t)
  let handler = {
    get<N extends keyof T>(target: typeof lens, name: N) {
      return nestedLensPath<T, [ N ]>([ name ])
    }
  }
  return new Proxy(lens, handler) as TopPrettyLens<T>
}

namespace PrettyLens {
  export type Path<T> = PathOf<T>
  export type Focus<T, P extends Path<T>> = TypeOf<T, P>
}

let fooLens = PrettyLens<{ x: { y?: { z: 'foobar' } } }>().x.y
let foo = R.view(fooLens.z)({ x: { y: { z: 'foobar' } } })

export default PrettyLens
