import React from 'react'
import { pickBy } from 'ramda'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import Editable from 'src/lib/editable'

function destructure<O extends object, K extends keyof O,
  Picked = Pick<O, K>,
  Rest = Omit<O, K>
  >(obj: O, keys: Array<K>) {
  let rest: Partial<O> = Object.assign({}, obj)
  let picked = pickBy<any, O>(
    (v, k: K) => {
      if (keys.includes(k)) {
        delete rest[k]
        return true
      }
      return false
    },
    obj
  )
  return [picked, rest] as [Picked, Rest]
}

const typographyKeys = [
  'align' as 'align',
  'classes' as 'classes',
  'color' as 'color',
  'component' as 'component',
  'gutterBottom' as 'gutterBottom',
  'headlineMapping' as 'headlineMapping',
  'noWrap' as 'noWrap',
  'paragraph' as 'paragraph',
  'variant' as 'variant',
]


namespace Display {
  export type Props = Omit<TypographyProps, 'children'> & {
    value?: string | null,
  } 
}
function Display({ value, ...props }: Display.Props) {
  return <Typography {...props}>{value}</Typography>
}

namespace Editor {
  export type Props = Display.Props & {
    onEdit: (text?: string) => any
   } & Omit<TextFieldProps, 'onChange' | 'children' | 'value'>
}
function Editor(props: Editor.Props) {
  let [ typeProps, editorProps ] = destructure(props, typographyKeys)
  return (
    <Typography {...typeProps}>
      <TextField {...editorProps}/>
    </Typography>
  )
}

namespace EditableText {
  export type DisplayProps = Display.Props
  export type EditorProps = Editor.Props
  export type Props = Editor.Props
}

const EditableText = Editable({
  display: Display,
  editor: Editor,
})

export { Editor, Display }

export default EditableText