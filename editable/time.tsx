import React from 'react'
import { DateTimeFormatter } from 'js-joda'
import { Display as Text, Editor as Input } from '../plain-text'
import Editable from 'src/lib/editable'

import { Time, cast } from './types'

import moment from 'moment'

type OnEdit = (time?: Time) => any
type Value = Time

namespace EditableTime {
  export type DisplayProps = Omit<Input.Props, 'onEdit' | 'value'> & {
    format?: string,
    value?: Time | null,
  }
  export type EditorProps = DisplayProps & {
    onEdit: OnEdit
  }
  export type Props = DisplayProps & {
    onEdit?: OnEdit
  }
}

function parse(str: string) {
  if (!str) {
    return undefined;
  }
  let m = moment(str, 'hh:mm')
  if (m.isValid()) {
    return cast.Time.fromMoment(m)
  }
  return undefined;
}

function asText(value: Time | undefined | null, format: string = 'H:mm') {
  return value ?
    value.format(DateTimeFormatter.ofPattern(format)) :
    value
}

const EditableTime = Editable({
  display({ value, format, variant = 'button', ...props }: EditableTime.DisplayProps) {
    return <Text variant={variant} {...props} value={asText(value, format)}/>
  },
  editor({ value, format, onEdit, variant = 'button', ...props }: EditableTime.EditorProps) {
    return (
      <Input
        variant={variant} 
        value={asText(value, format)}
        onEdit={(str: string) => onEdit(parse(str))}
        {...props} />
    )
  },
})

export default EditableTime