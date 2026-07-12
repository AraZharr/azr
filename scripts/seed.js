const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@gdsi.my.id'
  const password = process.argv[3] || 'Porto@Azhar'

  const user = await prisma.user.upsert({
    where: { email },
    update: { password },
    create: { email, password, name: 'Admin' },
  })

  console.log('✅ Admin user:', user.email)
  console.log('   Password:', password)
  console.log('   Note: password stored as plain text (matches auth.js comparison)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
