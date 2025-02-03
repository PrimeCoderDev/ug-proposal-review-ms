import { PrismaClient } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const getRoleId = async (document: string) => {
  const students = [
    '0903456780',
    '0903456781',
    '0903457781',
    '0901456781',
    '1701456781',
    '1701896781',
  ];
  const secretary = '0903456712';
  const manager = '0903956782';
  const teachers = [
    '0903456783',
    '0903486783',
    '0907756783',
    '0903696783',
    '0909856783',
  ];

  const roles = await prisma.role.findMany();
  if (students.includes(document))
    return roles.find((role) => role.name === 'STUDENT')?.id ?? '';
  if (document === secretary)
    return roles.find((role) => role.name === 'SECRETARY')?.id ?? '';
  if (document === manager)
    return roles.find((role) => role.name === 'MANAGER')?.id ?? '';
  if (teachers.includes(document))
    return roles.find((role) => role.name === 'TEACHER')?.id ?? '';

  return roles.find((role) => role.name === 'STUDENT')?.id ?? '';
};

const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const role = async () => {
  await prisma.role.createMany({
    data: [
      {
        id: uuidV4(),
        name: 'SECRETARY',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        name: 'MANAGER',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        name: 'COORDINATOR',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        name: 'REVIEWER',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        name: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        name: 'TEACHER',
        status: 'ACTIVE',
      },
    ],
  });
};

const person = async () => {
  await prisma.person.createMany({
    data: [
      {
        id: uuidV4(),
        document: '0903456780',
        name: 'Jhon Doe',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'jhon.doe@ug.edu.ec',
        address: 'Av. xyz Calle abc Mz. 123 Lt. 456',
        phone_number: '0981234560',
        telephone_number: '',
        type: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0903456781',
        name: 'Maria Doe',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'maria.doe@ug.edu.ec',
        address: 'Av. xyz Calle abc Mz. 123 Lt. 456',
        phone_number: '0981234570',
        telephone_number: '',
        type: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0903457781',
        name: 'Julian Barrera',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'julian.barrera@ug.edu.ec',
        address: 'El Inca Calle 123 Mz. 456 Lt. 789',
        phone_number: '0981237470',
        telephone_number: '',
        type: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0901456781',
        name: 'Armando Paredes',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'armando.paredes@ug.edu.ec',
        address: 'Cumbaya Calle 123 Mz. 456 Lt. 789',
        phone_number: '0987834570',
        telephone_number: '',
        type: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '1701456781',
        name: 'Alvaro Noboa',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'alvaro.noboa@ug.edu.ec',
        address: 'Isla Mocoli Calle 123 Mz. 456 Lt. 789',
        phone_number: '0987834571',
        telephone_number: '',
        type: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '1701896781',
        name: 'Felipe Lasso',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'felipe.lasso@ug.edu.ec',
        address: 'Tumbaco Calle 123 Mz. 456 Lt. 789',
        phone_number: '0987834572',
        telephone_number: '',
        type: 'STUDENT',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0903456712',
        name: 'Sara Cardenas',
        career: '',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'sara.cardenas@ug.edu.ec',
        address: 'Av. Siempre Viva Calle 123 Mz. 456 Lt. 789',
        phone_number: '0981237770',
        telephone_number: '',
        type: 'ADMIN', //Secretaria
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0903956782',
        name: 'Julio Perez',
        career: '',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'julio.perez@ug.edu.ec',
        address: 'Mucho Lote Calle 123 Mz. 456 Lt. 789',
        phone_number: '0991237732',
        telephone_number: '',
        type: 'ADMIN', //Gestor
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0903456783',
        name: 'Pedro Cevallos',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'pedro.cevallos@ug.edu.ec',
        address: 'Urb. Los Ceibos Calle 123 Mz. 456 Lt. 789',
        phone_number: '0981237870',
        telephone_number: '654-3219',
        type: 'TEACHER',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0903486783',
        name: 'Guillermo Plaza',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'guillermo.plaza@ug.edu.ec',
        address: 'Urb. La Joya Calle 123 Mz. 456 Lt. 789',
        phone_number: '0944437870',
        telephone_number: '206-3219',
        type: 'TEACHER',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0907756783',
        name: 'Juan Vera',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'juan.vera@ug.edu.ec',
        address: 'Conjunto Los Alamos Calle 123 Mz. 456 Lt. 789',
        phone_number: '0942237870',
        telephone_number: '246-3279',
        type: 'TEACHER',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0903696783',
        name: 'Maria Plaza',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'maria.plaza@ug.edu.ec',
        address: 'Barrio La Victoria Calle 123 Mz. 456 Lt. 789',
        phone_number: '0944737870',
        telephone_number: '206-3219',
        type: 'TEACHER',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        document: '0909856783',
        name: 'Belen Plaza',
        career: 'Ingenieria de Sistemas',
        faculty: 'Ciencias Matematicas y Fisicas',
        email: 'belen.plaza@ug.edu.ec',
        address: 'Barrio La Victoria Calle 123 Mz. 456 Lt. 789',
        phone_number: '0944438870',
        telephone_number: '206-3219',
        type: 'TEACHER',
        status: 'ACTIVE',
      },
    ],
  });
};

const user = async () => {
  const people = await prisma.person.findMany();

  people.forEach(async (person) => {
    await prisma.user.create({
      data: {
        id: uuidV4(),
        username: person.document,
        password: await hashPassword('S4lch1p4p4@123.'),
        id_person: person.id,
        id_role: await getRoleId(person.document),
        status: 'ACTIVE',
      },
    });
  });
};

const menu = async () => {
  const secretaryRoleId = await prisma.role.findFirst({
    where: { name: 'SECRETARY' },
    select: { id: true },
  });

  const managerRoleId = await prisma.role.findFirst({
    where: { name: 'MANAGER' },
    select: { id: true },
  });

  const coordinatorRoleId = await prisma.role.findFirst({
    where: { name: 'COORDINATOR' },
    select: { id: true },
  });

  const reviewerRoleId = await prisma.role.findFirst({
    where: { name: 'REVIEWER' },
    select: { id: true },
  });

  const studentRoleId = await prisma.role.findFirst({
    where: { name: 'STUDENT' },
    select: { id: true },
  });

  await prisma.menu.createMany({
    data: [
      {
        id: uuidV4(),
        id_role: secretaryRoleId?.id ?? '',
        name: 'SECRETARIA',
        icon: 'ti ti-user',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_role: managerRoleId?.id ?? '',
        name: 'GESTOR',
        icon: 'ti ti-user-bolt',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_role: coordinatorRoleId?.id ?? '',
        name: 'COORDINADOR',
        icon: 'ti ti-user-share',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_role: reviewerRoleId?.id ?? '',
        name: 'REVISOR',
        icon: 'ti ti-zoom-check',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_role: studentRoleId?.id ?? '',
        name: 'ALUMNO',
        icon: 'ti ti-school',
        status: 'ACTIVE',
      },
    ],
  });
};

const submenu = async () => {
  const secretaryMenuId = await prisma.menu.findFirst({
    where: { name: 'SECRETARIA' },
    select: { id: true },
  });

  const managerMenuId = await prisma.menu.findFirst({
    where: { name: 'GESTOR' },
    select: { id: true },
  });

  const coordinatorMenuId = await prisma.menu.findFirst({
    where: { name: 'COORDINADOR' },
    select: { id: true },
  });

  const reviewerMenuId = await prisma.menu.findFirst({
    where: { name: 'REVISOR' },
    select: { id: true },
  });

  const studentMenuId = await prisma.menu.findFirst({
    where: { name: 'ALUMNO' },
    select: { id: true },
  });

  await prisma.submenu.createMany({
    data: [
      {
        id: uuidV4(),
        id_menu: secretaryMenuId?.id ?? '',
        name: 'Planificacion de periodo',
        icon: 'ti ti-report',
        path: '/secretary/period-planning',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_menu: secretaryMenuId?.id ?? '',
        name: 'Carga de propuestas',
        icon: 'ti ti-file-upload',
        path: '/secretary/load-proposal',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_menu: managerMenuId?.id ?? '',
        name: 'Comision de revisores',
        icon: 'ti ti-users-group',
        path: '/management/commission-reviewers',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_menu: coordinatorMenuId?.id ?? '',
        name: 'Asignacion Propuestas',
        icon: 'ti ti-clipboard-text',
        path: '/coordination/assignment-proposals',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_menu: reviewerMenuId?.id ?? '',
        name: 'Revision Propuestas',
        icon: 'ti ti-clipboard-search',
        path: '/coordination/assignment-proposals',
        status: 'ACTIVE',
      },
      {
        id: uuidV4(),
        id_menu: studentMenuId?.id ?? '',
        name: 'Corregir Propuesta',
        icon: 'ti ti-file-pencil',
        path: '/student/correction-proposal',
        status: 'ACTIVE',
      },
    ],
  });
};

const main = async () => {
  try {
    await role();
    await person();
    await user();
    await menu();
    await submenu();

    await prisma.$disconnect();
  } catch (error) {
    await prisma.$disconnect();
    console.log(error);
    process.exit(1);
  }
};

main();
