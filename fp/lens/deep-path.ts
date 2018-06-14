type KeyOf<T> = keyof T

interface DeepPathOf<T> extends Array<string | number | symbol> {
  ['0']?: KeyOf<T>;
  ['1']?: this extends {
    ['0']?: infer K0
  } ? K0 extends KeyOf<T> ? KeyOf<T[K0]> : never : never;
  ['2']?: this extends {
    ['0']?: infer K0;
    ['1']?: infer K1;
  } ? K0 extends KeyOf<T> ? K1 extends KeyOf<T[K0]> ? KeyOf<T[K0][K1]> : never : never : never;
  ['3']?: this extends {
    ['0']?: infer K0;
    ['1']?: infer K1;
    ['2']?: infer K2;
  } ? K0 extends KeyOf<T> ? K1 extends KeyOf<T[K0]> ? K2 extends KeyOf<T[K0][K1]> ?
      KeyOf<T[K0][K1][K2]> : never : never : never : never;
  ['4']?: this extends {
    ['0']?: infer K0;
    ['1']?: infer K1;
    ['2']?: infer K2;
    ['3']?: infer K3;
  } ? K0 extends KeyOf<T> ? K1 extends KeyOf<T[K0]> ? K2 extends KeyOf<T[K0][K1]> ?
      K3 extends KeyOf<T[K0][K1][K2]> ? KeyOf<T[K0][K1][K2][K3]> : never : never : never : never : never;
  ['5']?: this extends {
    ['0']?: infer K0;
    ['1']?: infer K1;
    ['2']?: infer K2;
    ['3']?: infer K3;
    ['4']?: infer K4;
  } ? K0 extends KeyOf<T> ? K1 extends KeyOf<T[K0]> ? K2 extends KeyOf<T[K0][K1]> ?
      K3 extends KeyOf<T[K0][K1][K2]> ? K4 extends KeyOf<T[K0][K1][K2][K3]> ?
      KeyOf<T[K0][K1][K2][K3][K4]> : never : never : never : never : never : never;
  ['6']?: this extends {
    ['0']?: infer K0;
    ['1']?: infer K1;
    ['2']?: infer K2;
    ['3']?: infer K3;
    ['4']?: infer K4;
    ['5']?: infer K5;
  } ? K0 extends KeyOf<T> ? K1 extends KeyOf<T[K0]> ? K2 extends KeyOf<T[K0][K1]> ?
      K3 extends KeyOf<T[K0][K1][K2]> ? K4 extends KeyOf<T[K0][K1][K2][K3]> ?
      K5 extends KeyOf<T[K0][K1][K2][K3][K4]> ? KeyOf<T[K0][K1][K2][K3][K4][K5]> :
      never : never : never : never : never : never : never;
}

type ArrayHasIndex<MinLength extends string> = { [K in MinLength]: string | number | symbol; };

type DeepTypeOfArray<T, L extends DeepPathOf<T>> =
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'> ?
  any :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'|'5'|'6'> ?
  T[L['0']][L['1']][L['2']][L['3']][L['4']][L['5']][L['6']] :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'|'5'> ?
  T[L['0']][L['1']][L['2']][L['3']][L['4']][L['5']] :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'> ?
  T[L['0']][L['1']][L['2']][L['3']][L['4']] :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'> ?
  T[L['0']][L['1']][L['2']][L['3']] :
  L extends ArrayHasIndex<'0'|'1'|'2'> ?
  T[L['0']][L['1']][L['2']] :
  L extends ArrayHasIndex<'0'|'1'> ?
  T[L['0']][L['1']] :
  L extends ArrayHasIndex<'0'> ?
  T[L['0']] :
  never;

type PathAppend<T, L extends DeepPathOf<T>, K extends KeyOf<DeepTypeOf<T, L>>> =
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'> ?
  any :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'|'5'|'6'> ?
  [ L['0'], L['1'], L['2'], L['3'], L['4'], L['5'], L['6'], K ] :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'|'5'> ?
  [ L['0'], L['1'], L['2'], L['3'], L['4'], L['5'], K ] :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'|'4'> ?
  [ L['0'], L['1'], L['2'], L['3'], L['4'], K ] :
  L extends ArrayHasIndex<'0'|'1'|'2'|'3'> ?
  [ L['0'], L['1'], L['2'], L['3'], K ] :
  L extends ArrayHasIndex<'0'|'1'|'2'> ?
  [ L['0'], L['1'], L['2'], K ] :
  L extends ArrayHasIndex<'0'|'1'> ?
  [ L['0'], L['1'], K ] :
  L extends ArrayHasIndex<'0'> ?
  [ L['0'], K ] :
  [ K ]

type DeepTypeOf<T, L extends DeepPathOf<T>> =
  L extends DeepPathOf<T> ?
  DeepTypeOfArray<T, L> :
  L extends KeyOf<T> ?
  T[L] :
  never;

export {
  PathAppend,
  DeepTypeOf,
  DeepPathOf
}
