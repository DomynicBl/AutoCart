// backend/src/scripts/syncProducts.js

const { connections, models } = require('../database');

// Mapeamento de quais conexões de mercado sincronizar
const mercadosParaSincronizar = {
    1: connections.mercadoA, // Mercado com ID 1
    2: connections.mercadoB, // Mercado com ID 2
};

async function syncProducts() {
    console.log('🚀 Iniciando a sincronização de produtos...');

    const { Produto: ProdutoAutocart } = models.autocart;
    const { Produto: ProdutoMercado } = models.mercados;

    try {
        // Itera sobre cada mercado que queremos sincronizar
        for (const [mercadoId, mercadoConnection] of Object.entries(mercadosParaSincronizar)) {
            console.log(`\n🔄 Sincronizando Mercado ID: ${mercadoId}...`);

            // 1. Busca todos os produtos do banco de dados do mercado de origem
            const produtosDoMercado = await ProdutoMercado.findAll({
                sequelize: mercadoConnection, // Especifica para buscar no banco do mercado
                raw: true,
            });

            console.log(`  🔎 Encontrados ${produtosDoMercado.length} produtos na origem.`);

            // 2. Itera sobre cada produto e faz o "upsert" no banco central
            for (const produto of produtosDoMercado) {
                const [produtoAtualizado, criado] = await ProdutoAutocart.upsert({
                    mercadoId: parseInt(mercadoId), // Adiciona o ID do mercado
                    codigo_barras: produto.codigo_barras,
                    nome: produto.nome,
                    foto_url: produto.foto_url,
                    preco: produto.preco,
                    peso_gramas: produto.peso_gramas,
                    categoria: produto.categoria,
                });

                if (criado) {
                    console.log(`    ✅ [CRIADO] ${produto.nome}`);
                } else {
                    console.log(`    🔄 [ATUALIZADO] ${produto.nome}`);
                }
            }
        }

        console.log('\n✨ Sincronização concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante a sincronização:', error);
    } finally {
        // Fecha todas as conexões
        await connections.autocart.close();
        await connections.mercadoA.close();
        await connections.mercadoB.close();
        console.log('\n🔌 Conexões com o banco de dados fechadas.');
    }
}

syncProducts();