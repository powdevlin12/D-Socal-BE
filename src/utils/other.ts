type TEnum = {
  [key: string]: number | string
}

const convertEnumToNumber = (enumCustom: TEnum) => {
  return Object.values(enumCustom).filter((item) => typeof item === 'number')
}

export { convertEnumToNumber }
