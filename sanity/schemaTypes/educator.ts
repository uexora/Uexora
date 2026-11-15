import { defineField, defineType } from 'sanity';

/** An educator shown in the "Educators" section of the Education page, in the order set here. */
export const educator = defineType({
  name: 'educator',
  title: 'Educator',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required().max(60) }),
    defineField({
      name: 'subject',
      title: 'Subject or programme',
      type: 'string',
      description: 'Shown in gold capitals above the name, e.g. "Mathematics" or "IELTS and English".',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'credential',
      title: 'Qualification or experience',
      type: 'string',
      description: 'Optional, one short line, e.g. "M.Sc. Physics · 10 years teaching".',
      validation: (r) => r.max(90),
    }),
    defineField({ name: 'photo', title: 'Photo', type: 'picture', description: 'A portrait, ideally 4:5 (taller than wide).', validation: (r) => r.required() }),
    defineField({
      name: 'sample',
      title: 'Sample profile (placeholder)',
      type: 'boolean',
      initialValue: false,
      description: 'On for placeholder cards. Add the educator’s real name, subject and photo, then turn this off.',
    }),
    defineField({ name: 'order', title: 'Position', type: 'number', description: 'Lower numbers show first.' }),
  ],
  orderings: [{ title: 'Position', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subject: 'subject', media: 'photo', sample: 'sample' },
    prepare: ({ title, subject, media, sample }) => ({ title: sample ? `SAMPLE · ${title}` : title, subtitle: subject, media }),
  },
});
