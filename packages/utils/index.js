import uniqueId from 'lodash/uniqueId'
import upperFirst from 'lodash/upperFirst'

const getBox = (x, y, width, height) => {
  const x1 = x + width < x ? x + width : x
  const x2 = x + width > x ? x + width : x
  const y1 = y + height < y ? y + height : y
  const y2 = y + height > y ? y + height : y
  return {
    x1,
    x2,
    y1,
    y2
  }
}
const generateTermStr = term => {
  return term.id + ' ' + term.termType
}
const isObjHasNull = obj => {
  for (let key in obj) {
    if ((obj[key] === null || obj[key] === '') && key != 'termType') return true
  }
  return false
}
export { uniqueId, upperFirst, getBox, isObjHasNull, generateTermStr }
