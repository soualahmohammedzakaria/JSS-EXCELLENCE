import React from "react";
import './Dashboard.css';
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
                            <Chiffres/>
                            <LineChart/>
                            <Satistiques/>
                            <BarsChart/>
                        </section>
                        <section>
                            <DoughnutChart/>
                            <Creneaux/>
                            <DoughnutChart2/>
                        </section>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard