export interface Design {
  id: number
  title: string
  description: string
  price: number
  created_at?: string
  updated_at?: string
  images: DesignImage[]
}

export interface DesignImage {
  id?: number
  design_id?: number
  image_url: string
  display_order?: number
  created_at?: string
}

export interface NewDesign {
  title: string
  description: string
  price: number
  images: string[]
}

