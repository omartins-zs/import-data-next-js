import { prisma } from '@/lib/prisma';

export class UsuariosRepository {
  async findAll() {
    return prisma.user.findMany({
      orderBy: { criado_em: 'desc' }
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: { email }
    });
  }

  async create(data: { nome: string; email: string; senha: string }) {
    return prisma.user.create({
      data
    });
  }

  async update(id: string, data: { nome?: string; email?: string; senha?: string }) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    });
  }
}

export const usuariosRepository = new UsuariosRepository();
