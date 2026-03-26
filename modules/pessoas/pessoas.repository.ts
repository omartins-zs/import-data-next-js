import { prisma } from '@/lib/prisma';
import { Prisma, Status } from '@prisma/client';

export class PessoasRepository {
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PessoaWhereUniqueInput;
    where?: Prisma.PessoaWhereInput;
    orderBy?: Prisma.PessoaOrderByWithRelationInput;
  }) {
    return prisma.pessoa.findMany(params);
  }

  async findById(id: string) {
    return prisma.pessoa.findUnique({
      where: { id },
    });
  }

  async findByCpf(cpf: string) {
    return prisma.pessoa.findUnique({
      where: { cpf },
    });
  }

  async create(data: Prisma.PessoaCreateInput) {
    return prisma.pessoa.create({
      data,
    });
  }

  async update(id: string, data: Prisma.PessoaUpdateInput) {
    return prisma.pessoa.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.pessoa.delete({
      where: { id },
    });
  }

  async upsert(cpf: string, data: Omit<Prisma.PessoaCreateInput, 'cpf'>) {
    return prisma.pessoa.upsert({
      where: { cpf },
      update: {
        ...data,
        atualizado_em: new Date(),
      },
      create: {
        ...data,
        cpf,
      },
    });
  }

  async count(where?: Prisma.PessoaWhereInput) {
    return prisma.pessoa.count({ where });
  }
}

export const personasRepository = new PessoasRepository();
