import { Rule } from '~/sanity';
import { supportedLanguages } from '../../language/supported-languages';

export const localeBlock = {
  name: 'localeBlock',
  type: 'object',
  title: 'Locale Block Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'array',
    of: [
      {
        type: 'block',
      },
      {
        type: 'image',
        fields: [
          {
            name: 'alt',
            title: 'Alternatieve tekst (toegankelijkheid)',
            type: 'string',
            validation: (rule: Rule) => rule.required(),
            options: {
              isHighlighted: true,
            },
          },
          {
            name: 'caption',
            title: 'Onderschrift',
            type: 'text',
          },
        ],
      },
      {
        type: 'collapsible',
        title: 'Inklapbaar blok',
      },
    ],
  })),
};
