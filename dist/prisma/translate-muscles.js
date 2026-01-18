"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
require("dotenv/config");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new client_1.PrismaClient({ adapter });
const muscleMap = {
    abs: 'Abdômen',
    abductors: 'Abdutores',
    adductors: 'Adutores',
    biceps: 'Bíceps',
    calves: 'Panturrilhas',
    cardiovascular_system: 'Sistema Cardiovascular',
    delts: 'Deltoides',
    forearms: 'Antebraços',
    glutes: 'Glúteos',
    hamstrings: 'Posterior de Coxa',
    lats: 'Dorsais',
    levator_scapulae: 'Elevador da Escápula',
    pectorals: 'Peitorais',
    quads: 'Quadríceps',
    serratus_anterior: 'Serrátil Anterior',
    spine: 'Coluna',
    traps: 'Trapézio',
    triceps: 'Tríceps',
    upper_back: 'Costas Superiores',
    'hip flexors': 'Flexores do Quadril',
    'lower back': 'Lombar',
    'middle back': 'Meio das Costas',
    shoulders: 'Ombros',
    chest: 'Peito',
    core: 'Core',
    obliques: 'Oblíquos',
    'rotator cuff': 'Manguito Rotador',
    rhomboids: 'Romboides',
    'erector spinae': 'Eretores da Espinha',
    abdominals: 'Abdominais',
    quadriceps: 'Quadríceps',
    'hip adductors': 'Adutores do Quadril',
    'hip abductors': 'Abdutores do Quadril',
    'inner thighs': 'Parte Interna das Coxas',
    'outer thighs': 'Parte Externa das Coxas',
    groin: 'Virilha',
    neck: 'Pescoço',
    wrists: 'Punhos',
    ankles: 'Tornozelos',
    tibialis: 'Tibial',
    soleus: 'Sóleo',
    gastrocnemius: 'Gastrocnêmio',
    brachialis: 'Braquial',
    brachioradialis: 'Braquiorradial',
    deltoids: 'Deltoides',
    'rear deltoids': 'Deltoides Posterior',
    'front deltoids': 'Deltoides Anterior',
    'side deltoids': 'Deltoides Lateral',
    'lateral deltoid': 'Deltoide Lateral',
    'anterior deltoid': 'Deltoide Anterior',
    'posterior deltoid': 'Deltoide Posterior',
    'upper chest': 'Peitoral Superior',
    'lower chest': 'Peitoral Inferior',
    'upper arms': 'Parte Superior do Braço',
    'lower arms': 'Parte Inferior do Braço',
    'upper legs': 'Parte Superior da Perna',
    'lower legs': 'Parte Inferior da Perna',
    'inner chest': 'Peitoral Interno',
    'outer chest': 'Peitoral Externo',
    'infraspinatus': 'Infraespinhal',
    'supraspinatus': 'Supraespinhal',
    'teres major': 'Redondo Maior',
    'teres minor': 'Redondo Menor',
    'subscapularis': 'Subescapular',
};
function translateMuscle(muscle) {
    const lower = muscle.toLowerCase().trim();
    return muscleMap[lower] || muscle;
}
function translateMuscles(musclesStr) {
    if (!musclesStr)
        return null;
    return musclesStr
        .split(',')
        .map(m => translateMuscle(m.trim()))
        .join(', ');
}
async function updateSecondaryMuscles() {
    console.log('');
    console.log('🔄 Atualizando músculos secundários para português...');
    console.log('');
    const exercises = await prisma.exercise.findMany({
        where: {
            secondaryMuscles: { not: null },
        },
        select: {
            id: true,
            name: true,
            secondaryMuscles: true,
        },
    });
    console.log(`📊 Exercícios com músculos secundários: ${exercises.length}`);
    console.log('');
    let updated = 0;
    for (const exercise of exercises) {
        const translated = translateMuscles(exercise.secondaryMuscles);
        if (translated !== exercise.secondaryMuscles) {
            await prisma.exercise.update({
                where: { id: exercise.id },
                data: { secondaryMuscles: translated },
            });
            updated++;
            if (updated <= 5) {
                console.log(`   ✅ ${exercise.name}:`);
                console.log(`      De: ${exercise.secondaryMuscles}`);
                console.log(`      Para: ${translated}`);
            }
        }
    }
    if (updated > 5) {
        console.log(`   ... e mais ${updated - 5} atualizações`);
    }
    console.log('');
    console.log(`🎉 Concluído! ${updated} exercícios atualizados.`);
}
updateSecondaryMuscles()
    .catch((error) => {
    console.error('❌ Erro:', error.message);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=translate-muscles.js.map