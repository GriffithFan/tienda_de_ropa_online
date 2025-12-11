/**
 * Script para actualizar firstName y lastName de un usuario existente
 * Uso: npx ts-node --esm scripts/update-user.ts
 */
import prisma from '../src/lib/prisma';

async function updateUser() {
  // Buscar el usuario por email
  const email = process.argv[2] || 'tu-email@ejemplo.com';
  const firstName = process.argv[3] || 'Nombre';
  const lastName = process.argv[4] || 'Apellido';

  console.log(`Actualizando usuario: ${email}`);

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { firstName, lastName },
    });

    console.log('Usuario actualizado:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUser();
