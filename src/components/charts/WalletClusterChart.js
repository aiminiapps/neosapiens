'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { chartTheme } from '@/styles/charts';

export default function WalletClusterChart() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current, chartTheme);
        }

        const option = {
            title: {
                text: 'Wallet Activity Clusters',
                textStyle: {
                    color: '#F2F2F2',
                    fontSize: 16,
                    fontWeight: 'bold',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                borderColor: '#FFC21A',
                borderWidth: 1,
                textStyle: {
                    color: '#F2F2F2',
                },
                formatter: function (param) {
                    return `${param.data[3]}<br/>Volume: ${param.data[0]} ETH<br/>Txns: ${param.data[1]}<br/>Activity: ${param.data[2]}%`;
                },
            },
            grid: {
                left: '10%',
                right: '10%',
                top: '15%',
                bottom: '10%',
            },
            xAxis: {
                name: 'Transaction Volume (ETH)',
                nameTextStyle: {
                    color: '#8C8C8C',
                },
                axisLine: {
                    lineStyle: {
                        color: '#3A3A3A',
                    },
                },
                axisLabel: {
                    color: '#8C8C8C',
                },
                splitLine: {
                    lineStyle: {
                        color: '#2A2A2A',
                    },
                },
            },
            yAxis: {
                name: 'Transaction Count',
                nameTextStyle: {
                    color: '#8C8C8C',
                },
                axisLine: {
                    lineStyle: {
                        color: '#3A3A3A',
                    },
                },
                axisLabel: {
                    color: '#8C8C8C',
                },
                splitLine: {
                    lineStyle: {
                        color: '#2A2A2A',
                    },
                },
            },
            series: [
                {
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) * 5; // Size based on activity level
                    },
                    data: generateClusterData(),
                    itemStyle: {
                        color: function (param) {
                            const activity = param.data[2];
                            if (activity > 80) return '#FF3A3A';
                            if (activity > 60) return '#FFC21A';
                            if (activity > 40) return '#4AA3FF';
                            return '#6EDC5F';
                        },
                        opacity: 0.8,
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: '#FFC21A',
                        },
                    },
                },
            ],
        };

        chartInstance.current.setOption(option);

        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    return <div ref={chartRef} className="w-full h-96" />;
}

function generateClusterData() {
    const clusters = [];
    const types = ['Whale', 'Exchange', 'DEX', 'Contract', 'Retail'];

    for (let i = 0; i < 50; i++) {
        const volume = Math.random() * 1000 + 10;
        const txCount = Math.floor(Math.random() * 500) + 10;
        const activity = Math.random() * 100;
        const type = types[Math.floor(Math.random() * types.length)];

        clusters.push([volume, txCount, activity, `${type} Wallet ${i + 1}`]);
    }

    return clusters;
}
