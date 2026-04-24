import type { SchemaTypeDefinition } from 'sanity';
import { authorSchema } from './author';
import { articleSchema } from './article';
import { collectionSchema } from './collection';
import { productSchema } from './product';
import { eventSchema } from './event';
import { pressEntrySchema } from './pressEntry';
import { faqItemSchema } from './faqItem';

export const schemaTypes: SchemaTypeDefinition[] = [
  authorSchema,
  articleSchema,
  collectionSchema,
  productSchema,
  eventSchema,
  pressEntrySchema,
  faqItemSchema,
];
