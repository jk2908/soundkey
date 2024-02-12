import { nanoid as _nanoid } from 'nanoid'
import { generateId as _generateId } from 'lucia'

export const generateId = (length = 15) => _generateId(length)