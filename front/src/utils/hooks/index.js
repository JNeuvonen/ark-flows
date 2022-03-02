import { useMediaQuery } from '@mui/material'

export const GetMediaQuery = (px) => {
  return useMediaQuery(`(max-width:${px}px)`)
}
