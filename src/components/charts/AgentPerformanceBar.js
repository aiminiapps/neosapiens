'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function AgentPerformanceBar() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const option = {
            backgroundColor: 'transparent',
            title: {
                text: 'Agent Performance Comparison',
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
                    type: 'shadow',
                },
            },
            legend: {
                data: ['Accuracy Rate', 'Avg PoEI Score', 'Signal Count'],
                textStyle: {
                    color: '#F2F2F2',
                },
                top: 40,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '20%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: ['Titan', 'Pulse', 'Flow'],
                axisLine: {
                    lineStyle: {
                        color: '#3A3A3A',
                    },
                },
                axisLabel: {
                    color: '#8C8C8C',
                    fontSize: 12,
                },
            },
            yAxis: {
                type: 'value',
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
                    name: 'Accuracy Rate',
                    type: 'bar',
                    data: [87, 82, 85],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#6EDC5F' },
                            { offset: 1, color: '#4CAF50' },
                        ]),
                        borderRadius: [6, 6, 0, 0],
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: '#6EDC5F',
                        },
                    },
                },
                {
                    name: 'Avg PoEI Score',
                    type: 'bar',
                    data: [78, 73, 75],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#FFC21A' },
                            { offset: 1, color: '#E6B800' },
                        ]),
                        borderRadius: [6, 6, 0, 0],
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: '#FFC21A',
                        },
                    },
                },
                {
                    name: 'Signal Count',
                    type: 'bar',
                    data: [45, 38, 42],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#4AA3FF' },
                            { offset: 1, color: '#2196F3' },
                        ]),
                        borderRadius: [6, 6, 0, 0],
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: '#4AA3FF',
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

    return <div ref={chartRef} className="w-full h-80" />;
}
