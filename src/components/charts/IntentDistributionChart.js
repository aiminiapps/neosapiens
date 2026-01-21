'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function IntentDistributionChart({ distribution }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !distribution) return;

        // Initialize chart
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        const data = [
            { value: distribution.critical, name: 'Critical (8-10)', itemStyle: { color: '#FF3A3A' } },
            { value: distribution.high, name: 'High (6-8)', itemStyle: { color: '#FF9F1C' } },
            { value: distribution.moderate, name: 'Moderate (4-6)', itemStyle: { color: '#FFC21A' } },
            { value: distribution.low, name: 'Low (0-4)', itemStyle: { color: '#6EDC5F' } },
        ];

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: '#141414',
                borderColor: '#2A2A2A',
                textStyle: { color: '#F2F2F2' },
                formatter: '{b}: {c} signals ({d}%)',
            },
            legend: {
                orient: 'vertical',
                right: '10%',
                top: 'center',
                textStyle: { color: '#A1A1A1', fontSize: 12 },
            },
            series: [
                {
                    name: 'Intent Distribution',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['35%', '50%'],
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
                            color: '#F2F2F2',
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(255, 194, 26, 0.5)',
                        },
                    },
                    data,
                },
            ],
        };

        chartInstance.current.setOption(option);

        // Resize handler
        const handleResize = () => {
            chartInstance.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [distribution]);

    useEffect(() => {
        return () => {
            chartInstance.current?.dispose();
        };
    }, []);

    if (!distribution) {
        return (
            <div className="flex items-center justify-center h-48 text-text-muted">
                No distribution data available
            </div>
        );
    }

    return <div ref={chartRef} className="w-full h-48" />;
}
