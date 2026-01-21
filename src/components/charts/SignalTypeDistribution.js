'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function SignalTypeDistribution({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const chartData = data || [
            { value: 35, name: 'Risk Signals' },
            { value: 28, name: 'Opportunity' },
            { value: 22, name: 'Action Required' },
            { value: 15, name: 'Observation' },
        ];

        const option = {
            backgroundColor: 'transparent',
            title: {
                text: 'Signal Type Distribution',
                textStyle: {
                    color: '#F2F2F2',
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                borderColor: '#FFC21A',
                borderWidth: 1,
                textStyle: {
                    color: '#F2F2F2',
                },
                formatter: '{b}: {c} ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: '5%',
                top: 'center',
                textStyle: {
                    color: '#F2F2F2',
                },
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['40%', '55%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 8,
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
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(255, 194, 26, 0.5)',
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: chartData,
                    color: ['#FF3A3A', '#FFC21A', '#6EDC5F', '#4AA3FF'],
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
    }, [data]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    return <div ref={chartRef} className="w-full h-80" />;
}
