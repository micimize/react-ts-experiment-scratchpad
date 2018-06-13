import React from 'react'

namespace Editable {
  export type DisplayProps<T> = {
    value?: T,
  }
  export type EditorProps<T> = DisplayProps<T> & {
    onEdit?: (value?: T) => any
  }
  export type Arguments<
    T,
    Props extends DisplayProps<T>,
  > = {
    display: React.ComponentType<Props>
    editor: React.ComponentType<Props & EditorProps<T>>
  }

  export type Component<
    T,
    Props extends { value?: T } = { value?: T }
  > = React.ComponentType<Props & EditorProps<T>>
}
type EProps<T> = Editable.EditorProps<T>

function Editable<T, Props extends object>({
  display: Display, editor: Editor
}: Editable.Arguments<T, Props>) {
  return (props: Props & EProps<T>) => (
    ('onEdit' in props) ? <Editor {...props} /> : <Display {...props} />
  )
}

export default Editable
