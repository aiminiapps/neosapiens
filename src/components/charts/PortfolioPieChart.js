'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function PortfolioPieChart({ portfolio }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !portfolio) return;

        // Initialize chart only once
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const data = [
            { value: portfolio.bnb.value, name: `BNB (${portfolio.bnb.percentage.toFixed(1)}%)` },
            ...portfolio.tokens.map(t => ({
                value: t.value,
                name: `${t.symbol} (${t.percentage.toFixed(1)}%)`
            }))
        ].filter(item => item.value > 0); // Filter out zero values

        console.log('[PieChart] Chart data:', data);

        // If no data, show message
        if (data.length === 0) {
            console.log('[PieChart] No data to display');
            return;
        }

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                borderColor: '#FFC21A',
                borderWidth: 1,
                textStyle: {
                    color: '#F2F2F2',
                },
                formatter: (params) => {
                    return `${params.name}<br/>$${params.value.toFixed(2)} (${params.percent}%)`;
                },
            },
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'center',
                textStyle: {
                    color: '#F2F2F2',
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#141414',
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#FFC21A',
                        },
                    },
                    data,
                    color: ['#FFD84D', '#FFC21A', '#6EDC5F', '#4AA3FF', '#9B59B6', '#FF3A3A'],
                },
            ],
        };

        chartInstance.current.setOption(option, true); // Use notMerge to replace old data

        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            // Don't dispose here - only dispose on component unmount
        };
    }, [portfolio]);

    useEffect(() => {
        // Cleanup only on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
                chartInstance.current = null;
            }
        };
    }, []);

    if (!portfolio) {
        return (
            <div className="w-full h-80 flex items-center justify-center text-text-muted">
                Connect wallet to view portfolio
            </div>
        );
    }

    return <div ref={chartRef} className="w-full h-80" />;
}
