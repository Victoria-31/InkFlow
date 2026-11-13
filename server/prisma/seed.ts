import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';

const prisma = new PrismaClient();

const STYLES = ['Japonais', 'Blackwork', 'Fine line', 'Réalisme', 'Old school', 'Néo-traditionnel'];

async function main() {
  for (const name of STYLES) {
    await prisma.tag.upsert({ where: { name }, update: {}, create: { name } });
  }

  // Development-only credentials
  const hashedPassword = await hashPassword('inkflow-dev'); // same Argon2 parameters as the app
  const account = await prisma.account.upsert({
    where: { email: 'ren@inkflow.dev' },
    update: {},
    create: {
      email: 'ren@inkflow.dev',
      firstName: 'Ren',
      lastName: 'Matsuda',
      passwordHash: hashedPassword,
      role: 'ARTIST',
    },
  });

  const bio = 'Des pièces uniques, dessinées pour vous. Un dialogue direct avec Ren, de la première idée à la cicatrisation.';
  // Development image served by the client (client/public/images)
  const portrait = '/images/ren-atelier.jpg';
  const artist = await prisma.artist.upsert({
    where: { username: 'ren' },
    update: { bio, portrait },
    create: {
      username: 'ren',
      accountId: account.id,
      city: 'Lyon',
      bio,
      portrait,
      workingSlots: ['TUE_PM', 'WED_PM', 'THU_PM', 'FRI_PM', 'SAT_AM', 'SAT_PM'],
    },
  });

  const artistStyles = await prisma.tag.findMany({ where: { name: { in: ['Japonais', 'Blackwork'] } } });
  for (const tag of artistStyles) {
    await prisma.artistTag.upsert({
      where: { artistId_tagId: { artistId: artist.id, tagId: tag.id } },
      update: {},
      create: { artistId: artist.id, tagId: tag.id },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
