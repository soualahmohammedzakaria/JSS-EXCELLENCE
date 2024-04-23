import React from "react";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const nbMembres = [
    {"mois": "Jan", "nbActifs": 74, "nbNon": 4},
    {"mois": "Fev", "nbActifs": 70, "nbNon": 5},
    {"mois": "Mar", "nbActifs": 72, "nbNon": 5},
    {"mois": "Avr", "nbActifs": 67, "nbNon": 9},
    {"mois": "Mai", "nbActifs": 69, "nbNon": 8},
    {"mois": "Jun", "nbActifs": 74, "nbNon": 4},
];

const LineChart = () => {
    return (
        <div className="charts">
            <Line data={{
                labels: nbMembres.map((data) => data.mois),
                datasets: [
                    {
                        label: "Nombre de membres actifs",
                        data: nbMembres.map((data) => data.nbActifs),
                        borderColor: '#2c4771',
                        backgroundColor: '#2c4771',
                        borderWidth: 3,
                        fill: false
                    },
                    {   
                        label: 'Nombre de membres non actifs',
                        data: nbMembres.map((data) => data.nbNon),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderWidth: 3,
                        fill: false
                    },
                ],
            }}
            options={{
                responsive: true,
                elements: {
                    line: {
                        tension: 0.4
                    }
                }
            }}/>
        </div>
    )
}

export default LineChart 