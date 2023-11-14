import minimist from 'minimist'

const option = minimist(process.argv)

export const isProduction = Boolean(option.production)
