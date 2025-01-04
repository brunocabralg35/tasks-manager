import { prisma } from "@/database/prisma";

async function seed() {
  const user = await prisma.user.createMany({
    data: [
      {
        name: "John Carter",
        email: "johncarter@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "Mary Evans",
        email: "maryevans@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "Hebert Parker",
        email: "hebertparker@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "Anna Smith",
        email: "annasmith@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "Michael Brown",
        email: "michaelbrown@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "Emma Taylor",
        email: "emmataylor@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "James Wilson",
        email: "jameswilson@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "Olivia Davis",
        email: "oliviadavis@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "William Moore",
        email: "williammoore@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
      {
        name: "Sophia Johnson",
        email: "sophiajohnson@example.com",
        password:
          "$2b$08$ipfK1Mb0JEu0VfwS/p5RpOygWazWss3M9ctQDLPyvP55lUSdq/z6u",
      },
    ],
  });
}

seed().then(() => {
  console.log("Seed completed");
  prisma.$disconnect();
});
