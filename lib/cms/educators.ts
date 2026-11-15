import { client, imageUrl } from './client';

export type Educator = {
  name: string;
  subject: string;
  credential?: string;
  photo: { src: string; alt: string };
  sample?: boolean;
};

type RawEducator = Omit<Educator, 'photo'> & { photo?: { asset?: unknown; alt?: string } | null };

/** Educators for the Education page, from Studio, in their set order. None means no section. */
export async function getEducators(): Promise<Educator[]> {
  if (!client) return [];
  try {
    const raw = await client.fetch<RawEducator[]>(
      `*[_type == "educator" && defined(name) && defined(subject) && defined(photo.asset)] | order(coalesce(order, 999) asc, _createdAt asc) { name, subject, credential, photo, sample }`,
      {},
      { next: { revalidate: 600, tags: ['sanity'] } },
    );
    return raw.flatMap(({ photo, ...e }) => {
      const src = photo?.asset ? imageUrl(photo as never) : null;
      return src ? [{ ...e, photo: { src, alt: photo?.alt || e.name } }] : [];
    });
  } catch (err) {
    console.error('[educators]', err);
    return [];
  }
}
