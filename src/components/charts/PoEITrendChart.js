'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function PoEITrendChart({ trendData }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        // Process trend data or use sample data
        const processedData = trendData && trendData.length > 0
            ? processTrendData(trendData)
            : generateSampleData();

        const option = {
            backgroundColor: 'transparent',
            title: {
                text: 'PoEI Score Trend (14 Days)',
                textStyle: {
                    color: '#F2F2F2',
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                borderColor: '#FFC21A',
                borderWidth: 1,
                textStyle: {
                    color: '#F2F2F2',
                },
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    },
                },
            },
            legend: {
                data: ['Average PoEI', 'Titan', 'Pulse', 'Flow'],
                textStyle: {
                    color: '#F2F2F2',
                },
                top: 40,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '10%',
                top: '20%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: processedData.dates,
                axisLine: {
                    lineStyle: {
                        color: '#3A3A3A',
                    },
                },
                axisLabel: {
                    color: '#8C8C8C',
                    rotate: 0,
                    fontSize: 11,
                },
            },
            yAxis: {
                type: 'value',
                name: 'PoEI Score',
                min: 0,
                max: 100,
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
                        type: 'dashed',
                    },
                },
            },
            series: [
                {
                    name: 'Average PoEI',
                    type: 'line',
                    smooth: true,
                    data: processedData.avgScores,
                    lineStyle: {
                        color: '#FFC21A',
                        width: 3,
                    },
                    itemStyle: {
                        color: '#FFC21A',
                        borderWidth: 2,
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(255, 194, 26, 0.5)' },
                            { offset: 1, color: 'rgba(255, 194, 26, 0)' },
                        ]),
                    },
                    emphasis: {
                        focus: 'series',
                    },
                },
                {
                    name: 'Titan',
                    type: 'line',
                    smooth: true,
                    data: processedData.titanScores,
                    lineStyle: {
                        color: '#6EDC5F',
                        width: 2,
                    },
                    itemStyle: {
                        color: '#6EDC5F',
                    },
                    emphasis: {
                        focus: 'series',
                    },
                },
                {
                    name: 'Pulse',
                    type: 'line',
                    smooth: true,
                    data: processedData.pulseScores,
                    lineStyle: {
                        color: '#4AA3FF',
                        width: 2,
                    },
                    itemStyle: {
                        color: '#4AA3FF',
                    },
                    emphasis: {
                        focus: 'series',
                    },
                },
                {
                    name: 'Flow',
                    type: 'line',
                    smooth: true,
                    data: processedData.flowScores,
                    lineStyle: {
                        color: '#9B59B6',
                        width: 2,
                    },
                    itemStyle: {
                        color: '#9B59B6',
                    },
                    emphasis: {
                        focus: 'series',
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
    }, [trendData]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    return <div ref={chartRef} className="w-full h-96" />;
}

function processTrendData(trendData) {
    const dates = trendData.map(d => d.date || new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const avgScores = trendData.map(d => d.avgPoEIScore || 0);

    // Generate agent-specific scores (in a real app, this would come from actual data)
    const titanScores = avgScores.map(s => s * (0.9 + Math.random() * 0.2));
    const pulseScores = avgScores.map(s => s * (0.85 + Math.random() * 0.2));
    const flowScores = avgScores.map(s => s * (0.88 + Math.random() * 0.18));

    return { dates, avgScores, titanScores, pulseScores, flowScores };
}

function generateSampleData() {
    const days = 14;
    const dates = [];
    const avgScores = [];
    const titanScores = [];
    const pulseScores = [];
    const flowScores = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

        const base = 70 + Math.sin(i / 2) * 10;
        avgScores.push(base + Math.random() * 10);
        titanScores.push(base + 5 + Math.random() * 10);
        pulseScores.push(base - 5 + Math.random() * 10);
        flowScores.push(base + Math.random() * 10);
    }

    return { dates, avgScores, titanScores, pulseScores, flowScores };
}
