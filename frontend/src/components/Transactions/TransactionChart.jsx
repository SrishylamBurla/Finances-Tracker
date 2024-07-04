
import React from "react";
import {Chart as ChartJS, registerables} from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { useQuery } from "@tanstack/react-query";
import { listTransactionsAPI } from "../../services/transactions/transactionService";

ChartJS.register(...registerables)

const TransactionChart = () => {
  const {
    data: transactions,
    isError,
    isLoading,
    error,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: listTransactionsAPI,
    queryKey: ["list-transactions"],
  });
 console.log(transactions);

  const totals = transactions?.reduce((acc, transaction)=>{
    if(transaction?.type === "income"){
      acc.income += transaction?.amount
    }else{
      acc.expense += transaction?.amount
    }
    return acc
    },{
      income: 0, expense: 0
    })
    console.log(totals);

    const data = {
      labels: ["income", "expense"],
      datasets: [
        {
          label : "transactions",
          data : [totals?.income, totals?.expense],
          backgroundColor : ["#36A2EB", "#FF6384"],
          borderColor : ["#36A2EB", "#FF6384"],
          borderWith: 1,
          hoverOffset: 4
        }
        
      ]
    }

    const options = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 25,
            boxWidth: 12,
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: "Income vs Expense",
          font: {
            size: 18,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 30,
          },
        },
      },
      cutout: '70%',
    };
    
    
  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-2xl font-bold text-center mb-6">
        Transaction Overview
      </h1>
      <div style={{ height: "350px" }}><Doughnut data={data} options={options}  /></div>
    </div>
  );
};

export default TransactionChart;
