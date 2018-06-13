import React from 'react';
import * as R from 'ramda'

import Editable from './editable'

namespace Fields {

  export type Cursors<T> = {
    [K in keyof Full<T>]: Editable.EditorProps<T[K]>
  }

  export type Render<EProps, T> = React.ComponentType<EProps & {
    fields: Cursors<T>,
  }>

}

// Fields provides a utility for building "Editable" record components
function Fields<
  T extends object,
  D extends Editable.DisplayProps<T> = Editable.DisplayProps<T>,
  E extends Editable.EditorProps<Partial<T>> & D = Editable.EditorProps<Partial<T>> & D,
>(Render: Fields.Render<E, T>) {

  let valueOf = <K extends keyof T>(value: T | undefined, key: K) =>
    value ? (value as T)[key] : undefined

  let getter = (getter: (key: keyof T) => any) =>
    new Proxy({}, {
      get(obj: {}, key: keyof T) {
        return getter(key)
      }
    }) as Fields.Cursors<Full<T>>

  class FieldsEditor extends React.Component<E, {}> {

    fields = getter(<K extends keyof T>(key: K) => ({
      value: valueOf(this.props.value, key),
      onEdit: this.props.onEdit ?
        (value: T[K]) => {
          if (this.props.onEdit) {
            this.props.onEdit({ [key]: value } as any as Partial<T>)
          }
        } :
        undefined
    }))

    render() {
      return (
        <Render fields={this.fields} {...R.omit(['onEdit'], this.props)} />
      )
    }
  }

  let Fields = (props: D) => {
    let fields = getter(<K extends keyof T>(key: K) => ({
      value: valueOf(props.value, key),
    }))
    return <Render fields={fields} {...R.omit(['onEdit'], props)} />
  }

  return Editable<T, D>({
    display: Fields,
    editor: FieldsEditor,
  })
}

export default Fields