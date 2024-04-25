import React from "react";
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const nbMembresAge = [
    {"age": "Enfants", "nb": 44},
    {"age": "Adolescent", "nb": 30},
    {"age": "Adultes", "nb": 24}
];

const DoughnutChart2 = () => {
    return (
        <div className="charts">
            <Doughnut data={{
                labels: nbMembresAge.map((data) => data.age),
                datasets: [{
                    data: nbMembresAge.map((data) => data.nb),
                    backgroundColor: [
                        '#2c4771',
                        'rgb(255, 99, 132)',
                        '#36a2eb'
                    ],
                    hoverOffset: 4
                }]
            }}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: "Distribution des membres selon l'âge",
                        fontSize: 18,
                        font: {
                            weight: 'normal'
                        }
                    }
                },
                legend: {
                    labels: {
                        fontSize: 14,
                    }
                }
            }}/>
        </div>
    )
}

export default DoughnutChart2;
