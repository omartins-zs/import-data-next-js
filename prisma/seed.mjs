import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do Import Data...')

  // Limpar usuários de teste anteriores
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['admin@importdata.com', 'gerente@importdata.com', 'operador@importdata.com']
      }
    }
  })

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      nome: 'Administrador Geral',
      email: 'admin@importdata.com',
      senha: 'Password@123',
    }
  })

  // 2. Gerente
  const gerente = await prisma.user.create({
    data: {
      nome: 'Gerente de Operações',
      email: 'gerente@importdata.com',
      senha: 'Password@123',
    }
  })

  // 3. Operador
  const operador = await prisma.user.create({
    data: {
      nome: 'Operador de Importação',
      email: 'operador@importdata.com',
      senha: 'Password@123',
    }
  })

  console.log('Usuários de demonstração cadastrados:')
  console.log(`- Admin: ${admin.email}`)
  console.log(`- Gerente: ${gerente.email}`)
  console.log(`- Operador: ${operador.email}`)

  // Criar dados iniciais de exemplo na tabela de pessoas se estiver vazia
  const countPessoas = await prisma.pessoa.count()
  if (countPessoas === 0) {
    await prisma.pessoa.createMany({
      data: [
        {
          nome: 'Carlos Eduardo Mendes',
          cpf: '12345678901',
          email: 'carlos.mendes@email.com',
          telefone: '11988887777',
          status: 'ATIVO',
        },
        {
          nome: 'Beatriz Vasconcelos Lima',
          cpf: '98765432100',
          email: 'beatriz.lima@email.com',
          telefone: '11977776666',
          status: 'ATIVO',
        },
        {
          nome: 'Fernando Augusto Silva',
          cpf: '45678912345',
          email: 'fernando.silva@email.com',
          telefone: '21966665555',
          status: 'INATIVO',
        }
      ]
    })
    console.log('Registros de exemplo criados na tabela pessoas.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
