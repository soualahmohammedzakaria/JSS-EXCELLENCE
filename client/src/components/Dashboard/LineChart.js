import React from "react";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { formatAnMois } from '../../utils/datesUtils';

const LineChart = ( {nbMembres} ) => {
    return (
        <div className="charts">
            <Line data={{
                labels: nbMembres.map((data) => data.mois),
                datasets: [
                    {
                        label: "Nombre de membres actifs",
                        data: nbMembres.map((data) => data.membres_actifs),
                        borderColor: '#2c4771',
                        backgroundColor: '#2c4771',
                        borderWidth: 3,
                        fill: false
                    },
                    {   
                        label: 'Nombre de membres non actifs',
                        data: nbMembres.map((data) => data.membres_non_actifs),
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