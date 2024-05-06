import React from "react";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarsChart = ( {sportStatisctics} ) => {
    return (
        <div className="charts">
            <Bar data={{
                labels: sportStatisctics.map((data) => data.sport),
                datasets: [
                    {
                        label: "Nombre de membres",
                        data: sportStatisctics.map((data) => data.nombre_membres),
                        backgroundColor: ['#2c4771', '#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
                        borderWidth: 1
                    }
                ],
            }}
            options={{
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribution des membres selon le sport',
                        fontSize: 20,
                        font: {
                            weight: 'normal'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true
                        }
                    }
                }
            }}/>
        </div>
    )
}

export default BarsChart;