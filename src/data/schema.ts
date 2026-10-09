// Shape of the language-neutral structure (src/data/structure.ts).

// Dates as 'YYYY' or 'YYYY-MM'. No end means "until now", unless durationMonths is given.
export interface Period {
  start: string
  end?: string
  durationMonths?: number
}

// "@key" → translated from the "tags" section of the language file; anything else is shown as-is.
export type Tag = string

export interface StructureLink {
  label: Tag
  url: string
}

export interface StructureProject {
  id: string
  period: Period
  tags: Tag[]
  links: StructureLink[]
}

export interface Structure {
  identity: {
    firstName: string
    lastName: string
    email: string
    phone: string
    links: StructureLink[]
  }
  experiences: {
    id: string
    company: string
    period?: Period
    positions: { id: string; period: Period; stack: Tag[] }[]
  }[]
  projects: StructureProject[]
  projectGroups: { id: string; projects: StructureProject[] }[]
  education: { id: string; period: Period }[]
  skills: { id: string; items: Tag[] }[]
  languages: string[]
}
