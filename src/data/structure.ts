import type { Structure } from './schema'

// Language-neutral part of the resume: order, ids, dates, URLs and shared tags.
// All text lives in src/i18n/<lang>.json, under the same ids.
// A tag or link label starting with "@" is translated from the "tags" section of each language file.
//
// ✏️ Replace everything below with your own data (see README.md, "What to change").
export const structure: Structure = {
  identity: {
    firstName: 'Alex',
    lastName: 'Martin',
    email: 'alex.martin@example.com',
    phone: '+33 6 00 00 00 00',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-profile/' },
      { label: 'GitHub', url: 'https://github.com/your-username' },
    ],
  },
  experiences: [
    {
      id: 'acme',
      company: 'Acme Digital',
      period: { start: '2020-01' },
      positions: [
        {
          id: 'lead',
          period: { start: '2023-06' },
          stack: ['@agileDelivery', 'Scrum', 'Jira', 'iOS', 'Swift'],
        },
        {
          id: 'developer',
          period: { start: '2020-01', end: '2023-05' },
          stack: ['Kotlin', 'Swift', 'React Native', '@ci'],
        },
      ],
    },
    {
      id: 'startup',
      company: 'Nova Labs',
      positions: [
        {
          id: 'main',
          period: { start: '2017-09', end: '2019-12' },
          stack: ['React', 'Node.js', 'React Native'],
        },
      ],
    },
  ],
  projects: [
    {
      id: 'mobileApp',
      period: { start: '2023-06' },
      tags: ['iOS', 'Swift', 'Scrum'],
      links: [{ label: '@website', url: 'https://example.com/' }],
    },
    {
      id: 'webPlatform',
      period: { start: '2018', end: '2019' },
      tags: ['React', 'Node.js'],
      links: [],
    },
  ],
  projectGroups: [
    {
      id: 'mentoring',
      projects: [
        {
          id: 'internProject',
          period: { start: '2022', durationMonths: 6 },
          tags: ['React Native', 'Spring Boot'],
          links: [],
        },
      ],
    },
  ],
  education: [
    { id: 'master', period: { start: '2015', end: '2017' } },
    { id: 'bachelor', period: { start: '2012', end: '2015' } },
  ],
  skills: [
    { id: 'delivery', items: ['@agileDelivery', '@estimation', '@stakeholders'] },
    { id: 'technical', items: ['iOS (Swift)', 'Android (Kotlin)', 'React Native', 'React', 'Node.js'] },
    { id: 'tools', items: ['Jira', 'Confluence', 'Git', 'GitHub Actions'] },
  ],
  languages: ['fr', 'en'],
}
