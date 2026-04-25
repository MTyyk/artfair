export type Artwork = {
  id: string
  title: string
  artist_id: string
  year: number
  size: string
  technique: string
  price: number
  description: string
  description_beginner?: string
  description_advanced?: string
  image_url: string
  style_tags?: string[]
  artist?: Artist
}

export type Artist = {
  id: string
  name: string
  bio?: string
  artworks?: Artwork[]
}

export type Favorite = {
  session_id: string
  artwork_id: string
}

export type InterestSubmission = {
  artwork_id: string
  contact_info?: string
  session_id: string
}
