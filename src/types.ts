// Language code = file name in src/i18n (e.g. "fr" for fr.json).
export type Lang = string

export interface Link {
  label: string
  url: string
}

export interface Position {
  role: string
  period: string
  context?: string
  highlights: string[]
  stack: string[]
}

// One company, with one or more successive positions (most recent first).
export interface Experience {
  company: string
  location: string
  period?: string
  // Company-wide activities spanning all positions (shown before them).
  highlights?: string[]
  positions: Position[]
}

export interface Education {
  degree: string
  school: string
  period: string
}

export interface SkillGroup {
  name: string
  items: string[]
}

export interface Language {
  name: string
  level: string
}

export interface Project {
  name: string
  period: string
  context: string
  role?: string
  description: string
  tags: string[]
  links: Link[]
}

// A themed sub-section of projects (e.g. mentoring, open source, side projects).
export interface ProjectGroup {
  // Anchor id, also used by the top menu.
  id: string
  title: string
  intro: string
  projects: Project[]
}

// Web-only introduction, mirroring the LinkedIn "About" section.
export interface About {
  title: string
  intro: string
  dailyTitle: string
  daily: string[]
  projectsTitle: string
  projects: string[]
  outro: string
}

export interface CV {
  meta: {
    documentTitle: string
    description: string
    pdfFileName: string
  }
  labels: {
    profile: string
    experience: string
    earlier: string
    transverse: string
    education: string
    skills: string
    certifications: string
    languages: string
    interests: string
    nav: string
    projects: string
    projectsIntro: string
    download: string
    consent: {
      text: string
      accept: string
      decline: string
      manage: string
    }
    footer: {
      copyright: string // "{year}" is replaced by the build year
      updated: string // "{date}" is replaced by the build date, formatted for the language
    }
    notice: {
      text: string
      feedback: string
      feedbackSubject: string
      sourceText: string
      source: string
      sourceSubject: string
      close: string
    }
    privacy: {
      link: string
      title: string
      updated: string
      close: string
      sections: { heading: string; paragraphs: string[] }[]
    }
  }
  identity: {
    firstName: string
    lastName: string
    title: string
    subtitle: string
    location: string
    email: string
    phone: string
    links: Link[]
  }
  summary: string
  about: About
  experiences: Experience[]
  earlier: string
  projects: Project[]
  projectGroups: ProjectGroup[]
  education: Education[]
  skills: SkillGroup[]
  certifications: string[]
  languages: Language[]
  interests: string[]
}
