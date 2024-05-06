import React, { useEffect, useState } from "react";
import './Dashboard.css';
import axios from 'axios';
import { useAuthContext } from '../../hooks/authContext/authContext';
import Navbar from "../../components/general/Navbar/Navbar";
import Sidebar from "../../components/general/Sidebar/Sidebar";
import LineChart from "../../components/Dashboard/LineChart";
import DoughnutChart from "../../components/Dashboard/DoughnutChart";
import DoughnutChart2 from "../../components/Dashboard/DoughnutChart2";
import BarsChart from "../../components/Dashboard/BarsChart";
import Satistiques from "../../components/Dashboard/Statistiques/Statistiques";
import Creneaux from "../../components/Dashboard/Creneaux/Creneaux";
import Chiffres from "../../components/Dashboard/Statistiques/Chiffres";

const Dashboard = () => {
    const { authData } = useAuthContext();
    const [doughnut, setDoughnut] = useState([]);
    const [doughnut2, setDoughnut2] = useState([]);
    const [barschart, setBarschart] = useState([]);
    const [creneaux, setCreneaux] = useState([]);
    const [depensesMois, setDepensesMois] = useState({
        actuel: 0,
        precedent: 0
    });
    const [revenuesMois, setRevenuesMois] = useState({
        actuel: 0,
        precedent: 0
    });
    const [nouvMembresMois, setNouvMembresMois] = useState({
        actuel: 0,
        precedent: 0
    });
    const [abonnementsMois, setAbonnementsMois] = useState({
        actuel: 0,
        precedent: 0
    });   
    const [chiffres, setChiffres] = useState({
        totalMembres: 0,
        totalCoachs: 0,
        totalEquipements: 0,
        totalAbonnements: 0
    });

    const fetchStatistiques = async () => {
        try {
            const statisticsResponse = await axios.get('http://localhost:4000/statistic/getDistribution');
            const distributionResponse = await axios.get('http://localhost:4000/statistic/getDistributionBySport');
            const creneauxResponse = await axios.get('http://localhost:4000/statistic/getNextCreneaux');
            const expensesResponse = await axios.get('http://localhost:4000/statistic/getMonthExpenses');
            const incomeResponse = await axios.get('http://localhost:4000/statistic/getMonthIncome');
            const newMembersResponse = await axios.get('http://localhost:4000/statistic/getMonthNewMembers');
            const subscriptionsResponse = await axios.get('http://localhost:4000/statistic/getMonthSubscriptions');

            setDoughnut([
                { sexe: "Homme", nb: statisticsResponse.data.Statistics.totalHommes },
                { sexe: "Femme", nb: statisticsResponse.data.Statistics.totalFemmes }
            ]);
            setDoughnut2([
                { age: "Enfants", nb: statisticsResponse.data.Statistics.totalEnfants },
                { age: "Adolescents", nb: statisticsResponse.data.Statistics.totalAdolescents },
                { age: "Adultes", nb: statisticsResponse.data.Statistics.totalAdultes }
            ]);
    
            setBarschart(distributionResponse.data.sportStatistics);
            setCreneaux(creneauxResponse.data.NextCreneaux);
            setDepensesMois({
                actuel: expensesResponse.data.monthExpenses.currentMonthExpenses,
                precedent: expensesResponse.data.monthExpenses.previousMonthExpenses
            });
            setRevenuesMois({
                actuel: incomeResponse.data.monthIncome.currentMonthIncome,
                precedent: incomeResponse.data.monthIncome.previousMonthIncome
            });
            setNouvMembresMois({
                actuel: newMembersResponse.data.MonthNewMembers.currentMonthNewMembers,
                precedent: newMembersResponse.data.MonthNewMembers.previousMonthNewMembers
            });
            setAbonnementsMois({
                actuel: subscriptionsResponse.data.MonthSubscriptions.currentMonthSubscriptions,
                precedent: subscriptionsResponse.data.MonthSubscriptions.previousMonthSubscriptions
            });
            setChiffres({
                totalMembres: statisticsResponse.data.Statistics.totalMembers,
                totalCoachs: statisticsResponse.data.Statistics.coachCount,
                totalEquipements: statisticsResponse.data.Statistics.totalEquipments,
                totalAbonnements: subscriptionsResponse.data.MonthSubscriptions.currentMonthSubscriptions
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques :', error);
        }
    };    

    useEffect(() => {
        fetchStatistiques();
    }, []);

    return (
        <>
            <Navbar></Navbar>
            <main>
                <Sidebar currPage="/dashboard"></Sidebar>
                <div>
                    <div className="header">
                        <h1>Aperçu</h1>
                    </div>
                    <div className="content top-container">
                        <section>
                            <Chiffres chiffres={chiffres} />
                            <LineChart/>                     
                            {authData.role === 'Administrateur' && (  
                                <Satistiques depensesMois={depensesMois} revenuesMois={revenuesMois} nouvMembresMois={nouvMembresMois} abonnementsMois={abonnementsMois}/>
                            )}
                            <BarsChart sportStatisctics={barschart}/>
                        </section>
                        <section>
                            <DoughnutChart doughnut={doughnut}/>
                            <Creneaux creneauxData={creneaux}/>
                            <DoughnutChart2 doughnut2={doughnut2}/>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard