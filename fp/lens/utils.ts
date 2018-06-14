type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

type Diff<T, U> = T extends U ? never : T

type NonNull<T> = Diff<T, null | undefined>

type Full<T> = T & {
  [P in keyof T]-?: NonNull<T[P]>;
}

type DeepFull<T> = T & {
  [P in keyof T]-?: T[P] extends object ?
    DeepFull<T[P]> :
    NonNull<T[P]>
}

export { NonNull, Full, DeepFull }
