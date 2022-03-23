this.content.series.map(serie => ({
    ...serie,
    negativeColor: {
        ...serie.negativeColor,
        prop: 'pouet',
    },
}));
