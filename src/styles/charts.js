// ECharts theme configuration for NEO-SAPIENS yellow theme

export const chartTheme = {
    color: [
        '#FFC21A', // Neo Yellow
        '#FFD84D', // Electric Yellow
        '#6EDC5F', // Intent Green
        '#FF9F1C', // Caution Amber
        '#FF3A3A', // Critical Red
        '#E6B800', // Muted Yellow
    ],
    backgroundColor: 'transparent',
    textStyle: {
        color: '#F2F2F2',
        fontFamily: 'Inter, system-ui, sans-serif',
    },
    title: {
        textStyle: {
            color: '#F2F2F2',
            fontWeight: 'bold',
        },
        subtextStyle: {
            color: '#A1A1A1',
        },
    },
    line: {
        itemStyle: {
            borderWidth: 2,
        },
        lineStyle: {
            width: 3,
        },
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
    },
    radar: {
        itemStyle: {
            borderWidth: 2,
        },
        lineStyle: {
            width: 3,
        },
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
    },
    bar: {
        itemStyle: {
            barBorderWidth: 0,
            barBorderColor: '#2A2A2A',
        },
    },
    pie: {
        itemStyle: {
            borderWidth: 0,
            borderColor: '#2A2A2A',
        },
    },
    scatter: {
        itemStyle: {
            borderWidth: 0,
            borderColor: '#2A2A2A',
        },
    },
    categoryAxis: {
        axisLine: {
            show: true,
            lineStyle: {
                color: '#2A2A2A',
            },
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: '#2A2A2A',
            },
        },
        axisLabel: {
            show: true,
            color: '#A1A1A1',
        },
        splitLine: {
            show: false,
            lineStyle: {
                color: ['#1F1F1F'],
            },
        },
        splitArea: {
            show: false,
            areaStyle: {
                color: ['rgba(20,20,20,0.1)'],
            },
        },
    },
    valueAxis: {
        axisLine: {
            show: false,
            lineStyle: {
                color: '#2A2A2A',
            },
        },
        axisTick: {
            show: false,
            lineStyle: {
                color: '#2A2A2A',
            },
        },
        axisLabel: {
            show: true,
            color: '#A1A1A1',
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#1F1F1F'],
            },
        },
        splitArea: {
            show: false,
            areaStyle: {
                color: ['rgba(20,20,20,0.1)'],
            },
        },
    },
    tooltip: {
        backgroundColor: '#141414',
        borderColor: '#2A2A2A',
        borderWidth: 1,
        textStyle: {
            color: '#F2F2F2',
        },
    },
    legend: {
        textStyle: {
            color: '#A1A1A1',
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
    },
};

// Common chart options
export const getDefaultOptions = () => ({
    backgroundColor: 'transparent',
    textStyle: {
        fontFamily: 'Inter, system-ui, sans-serif',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#141414',
        borderColor: '#2A2A2A',
        borderWidth: 1,
        textStyle: {
            color: '#F2F2F2',
        },
    },
});
