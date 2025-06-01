const API_URL_FILMES = "http://localhost:3000/filmes";

Chart.register(ChartDataLabels);

async function buscarDadosParaGrafico() {
    try {
        const response = await fetch(API_URL_FILMES);
        const filmes = await response.json();

        const contagemGeneros = filmes.reduce((acc, filme) => {
            const genero = filme.genero || "Não Definido";
            acc[genero] = (acc[genero] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(contagemGeneros);
        const data = Object.values(contagemGeneros);

        criarGrafico(labels, data);

    } catch (error) {
        console.error("Erro ao buscar dados para o gráfico:", error);
    }
}

function criarGrafico(labels, data) {
    const ctx = document.getElementById('generoChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Filmes por Gênero',
                data: data,
                backgroundColor: [
                    'rgba(229, 9, 20, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: 'rgba(20, 20, 20, 0.5)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    formatter: (value, context) => {
                        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = (value / total * 100).toFixed(1) + '%';
                        return percentage;
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 18,
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: '#fff',
                        font: {
                            size: 16
                        }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', buscarDadosParaGrafico);