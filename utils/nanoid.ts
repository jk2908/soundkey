import { nanoid as _nanoid } from 'nanoid'

export const nanoid = (length = 15) => _nanoid(length)