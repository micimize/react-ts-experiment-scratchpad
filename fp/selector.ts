import * as R from 'ramda';

type Keyable<T, Ks extends keyof T = keyof T> = Ks
  | Ks extends 'true' ? true : Ks
  | Ks extends 'false' ? false : Ks
  | Ks extends 'undefined' ? undefined : Ks
  | Ks extends 'null' ? null : Ks

type ToKeyable = string | true | false | null | undefined | number
type ToString<K extends string | true | false | null | undefined | number> =
  K extends true ? 'true' :
  K extends false ? 'false' :
  K extends undefined ? 'undefined' :
  K extends number ? 'number' :
  K extends null ? 'null' :
  K

type Cases<Keys extends ToKeyable, DK extends Keys = Keys> = (
  Record<ToString<DK>, any> & Partial<Record<ToString<Keys>, any>>
)

type C = Cases<'invite' | boolean | undefined, false>

let propOf = <DK extends ToKeyable>(options: {
  default: DK,
  or?: <T extends any = any>(props: T) => any
}) =>
 <T extends Cases<DK>>(obj: T): <K extends Keyable<T>>(key: K) => T[keyof T] => 
  R.pipe(
    R.flip(R.prop)(obj),
    R.when(
      R.isNil,
      // closure so this is called lazily
      () => options.or ? options.or<T>(obj) : undefined
    ),
    R.when(
      R.isNil,
      R.always(obj[options.default as ToString<DK>])
    )
  )

// we're making assumptions because I'm tired of type system hacking
const isNestedSelector = <P extends any>() =>
  (k: any): k is ((p: P) => any) =>
    typeof k === 'function'

function Selector<
  T,
  Focus extends ToKeyable,
  DK extends Focus,
>(
  lens: R.ManualLens<Focus, T>,
  options: { default: DK, or?: <T>(props: T) => any }
) {
  return (cases: Cases<Focus, DK>) => props => R.pipe(
    R.view(lens) as (t: T) => Keyable<Cases<Focus, DK>>,
    propOf<DK>({ default: options.default, or: options.or })(cases),
    R.when(isNestedSelector<typeof props>(), f => f(props))
  ) 
}

type Pick = <T, F extends ToKeyable | { default: ToKeyable }>( l: R.ManualLens<F, T>) => ((t: T) => F)
export const pick: Pick = lens => R.pipe(
  R.view(lens),
  R.when(
    R.and(R.is(Object), R.has('default')),
    R.prop('default')
  )
)

export default Selector