import * as R from 'ramda'
import { DeepPathOf, DeepTypeOf, PathAppend } from './deep-path'

const LensProperties = [ '_fake_lens_getter', '_fake_lens_setter' ]
type LensProperties = '_fake_lens_getter' | '_fake_lens_setter'
function isLensProp(k: any): k is LensProperties {
  return LensProperties.includes(k)
}

const CURRENT_PATH = Symbol('CURRENT_PATH')
type CURRENT_PATH = typeof CURRENT_PATH 
const isCurrentPathQuery = (n: any): n is CURRENT_PATH => n === CURRENT_PATH

type PathOf<T> = DeepPathOf<DeepFull<T>>
type TypeOf<T, Path extends PathOf<T>> = DeepTypeOf<DeepFull<T>, Path>

const optLensPath = <T, P extends PathOf<T>>(p: P) =>
  R.lensPath<TypeOf<T, P> | undefined, T>(p)

type NestedPrettyLens<
  T,
  Path extends PathOf<T>,
  DT extends TypeOf<T, Path> = TypeOf<T, Path> 
> = R.ManualLens<DT | undefined, T> & {
  [K in keyof DT]-?: K extends keyof DeepTypeOf<DeepFull<T>, Path> ?
    NestedPrettyLens<T, PathAppend<DeepFull<T>, Path, K>> :
    never
}

type TopPrettyLens<T> = R.ManualLens<T, T> & {
  [K in keyof T]-?: NestedPrettyLens<T, [ K ]>
}

function nestedLensPath<T, Path extends PathOf<T>>(p: Path): NestedPrettyLens<T, Path> {
  let handler = {
    get<N extends keyof TypeOf<T, Path> >(
      target: NestedPrettyLens<T, Path>,
      name: N | CURRENT_PATH | LensProperties) {
      if (isCurrentPathQuery(name)) {
        return p
      }
      if (isLensProp(name)) {
        return Reflect.get(target, name)
      }
      return nestedLensPath<T, PathAppend<DeepFull<T>, Path, N>>(
        [ ...p, name ] as PathAppend<DeepFull<T>, Path, N>
      )
    }
  }
  return new Proxy(optLensPath<T, Path>(p), handler) as NestedPrettyLens<T, Path>
}

type PrettyLens<T, Path extends PathOf<T>> =
  Path extends [ never ] ? TopPrettyLens<T> : NestedPrettyLens<T, Path>

function PrettyLens<T>() {
  let lens = R.lens((t: T) => t, (t: T) => t)
  let handler = {
    get<N extends keyof T>(
      target: typeof lens, name: N | CURRENT_PATH | LensProperties
    ) {
      if (isCurrentPathQuery(name)) {
        return []
      }
      if (isLensProp(name)) {
        return Reflect.get(target, name)
      }
      return nestedLensPath<T, [ N ]>([ name ])
    }
  }
  return new Proxy(lens, handler) as TopPrettyLens<T>
}

const _CURRENT_PATH = CURRENT_PATH
namespace PrettyLens {
  export const CURRENT_PATH = _CURRENT_PATH
  export type Path<T> = PathOf<T>
  export type Focus<T, P extends Path<T>> = TypeOf<T, P>
}

export default PrettyLens