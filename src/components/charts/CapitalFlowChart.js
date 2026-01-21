'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { chartTheme } from '@/styles/charts';

export default function CapitalFlowChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current, chartTheme);
        }

        const option = {
            title: {
                text: 'Capital Flow Analysis',
                textStyle: {
                    color: '#F2F2F2',
                    fontSize: 16,
                    fontWeight: 'bold',
                },
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                borderColor: '#FFC21A',
                borderWidth: 1,
                textStyle: {
                    color: '#F2F2F2',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data?.dates || generateDates(30),
                axisLine: {
                    lineStyle: {
                        color: '#3A3A3A',
                    },
                },
                axisLabel: {
                    color: '#8C8C8C',
                },
            },
            yAxis: {
                type: 'value',
                name: 'ETH',
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
                    name: 'Inflow',
                    type: 'line',
                    smooth: true,
                    data: data?.inflow || generateData(30, 100, 500),
                    lineStyle: {
                        color: '#6EDC5F',
                        width: 2,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(110, 220, 95, 0.3)' },
                            { offset: 1, color: 'rgba(110, 220, 95, 0)' },
                        ]),
                    },
                    itemStyle: {
                        color: '#6EDC5F',
                    },
                },
                {
                    name: 'Outflow',
                    type: 'line',
                    smooth: true,
                    data: data?.outflow || generateData(30, 100, 500),
                    lineStyle: {
                        color: '#FF3A3A',
                        width: 2,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 58, 58, 0.3)' },
                            { offset: 1, color: 'rgba(255, 58, 58, 0)' },
                        ]),
                    },
                    itemStyle: {
                        color: '#FF3A3A',
                    },
                },
            ],
            legend: {
                data: ['Inflow', 'Outflow'],
                textStyle: {
                    color: '#F2F2F2',
                },
                top: 35,
            },
        };

        chartInstance.current.setOption(option);

        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    return <div ref={chartRef} className="w-full h-80" />;
}

function generateDates(days) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
}

function generateData(count, min, max) {
    return Array.from({ length: count }, () =>
        Math.floor(Math.random() * (max - min + 1) + min)
    );
}
