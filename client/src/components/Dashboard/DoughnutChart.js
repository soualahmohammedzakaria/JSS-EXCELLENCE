import React from "react";
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const DoughnutChart = ({ doughnut }) => {
    return (
        <div className="charts">
            <Doughnut data={{
                labels: doughnut.map((data) => data.sexe),
                datasets: [{
                    data: doughnut.map((data) => data.nb),
                    backgroundColor: [
                        '#2c4771',
                        'rgb(255, 99, 132)'
                    ],
                    hoverOffset: 4
                }]
            }}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: "Distribution des membres selon le sexe",
                        fontSize: 16,
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

export default DoughnutChart;