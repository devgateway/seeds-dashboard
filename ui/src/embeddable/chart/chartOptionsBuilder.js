export const buildSeedInspectorOptions = (data) => {
    const sortedData = data.sort((a, b) => a.country > b.country && -1 || 1)
    return {
        maxValue: 200,
        indexBy: 'country',
        keys: ['public', 'private'],
        legends : ['Public Seed Inspectors', 'Private Seed Inspectors'],
        data: sortedData,
        layout: 'horizontal',
        itemWidth: 150,
        apiKey: 'seedInspector',
        enableGridX: false,
        enableGridY: true
    }

}

export const buildHHIndexOptions = (data) => {
    data.forEach(d => {
        d.id = d.iso
        d.value = d.hhindex
    })
    return {
        data: data
    }
}

export const buildPerformanceOptions = (data) => {
    const keys = Object.keys(data[0]).filter(x => x!="order" && x!="subindicator")
    const sortedData = data.sort((a, b) => a.order < b.order && -1 || 1)
    
    return {
        data: sortedData,
        keys: keys
    }
}

export const buildVarietySoldOptions = (data) => {
    const sortedData = data.sort((a, b) => a.year > b.counyeartry && -1 || 1)
    const legends = [data[0].crop1, data[0].crop2, data[0].crop3, data[0].crop4]
    return {
        maxValue: 60,
        indexBy: 'year',
        keys: ['crop1Value', 'crop2Value', 'crop3Value', 'crop4Value'],
        legends : legends,
        data: sortedData,
        itemWidth: 90,
        layout: 'vertical',
        apiKey: 'varietySold',
        enableGridX: false,
        enableGridY: true
    }

}

export const buildBarOptions = (data, includeTotal) => {
    const usePercents = true
    if (data && data.children) {
        const series = []
        const vals = []
        const totalCount = data.count;
        const totalSum = data.sum;
        const indexBy = data.children[0].type
        const keys = new Set();
        var total = 0;
        data.children.forEach(d => {
            const row = {}
            row[d.type] = d.value //Male /African ect (dimension value)
            //row[d.value + '_count'] = d.count // count
            //row[d.value + '_sum'] = d.sum
            if (d.children) {
                d.children.forEach(d1 => {
                    if (d1.children) {
                        if (d1.value != 'No Data') {

                            keys.add(d1.value)
                            row[d.type] = d.value //Male /African ect (dimension value)
                            //row[d.value + '_count'] = d.count // count
                            //row[d.value + '_sum'] = d.sum

                            d1.children.forEach(d2 => {
                                if (d2.value != 'No Data') {

                                    /*if (d2.value == true) {
                                        row[d1.value] = (d2.sum / d1.sum) * 100;
                                        vals.push((d2.sum / d1.sum) * 100)
                                    }*/
                                    row[d1.value + '_' + d2.value] = (d2.sum / d1.sum) * 100

                                    //row[d1.value + '_' + d2.value + '_count'] = d2.count
                                    //row[d1.value + '_' + d2.value + '_sum'] = d2.count
                                }

                            })
                        }
                    } else {
                        if (d1.value == true) {
                            keys.add("Yes")
                            total += d1.sum
                            vals.push((d1.sum / d.sum) * 100)
                        }
                        row[d1.value == true ? 'Yes' : 'No'] = (d1.sum / d.sum) * 100

                        //row[d1.value+'_sum']=d1.sum
                        //row[d1.value+'_count']=d1.count
                    }
                })
            }
            series.push(row)

        })

        if (includeTotal) {
            if (total > 0) {
                const tot = {}
                tot[indexBy] = 'Total'
                tot['Yes'] = (total / data.sum) * 100
                vals.push((total / data.sum) * 100)
                series.push(tot)
            }
        }

        return {
            maxValue: Math.max(...vals) + 5,
            indexBy,
            keys: Array.from(keys),
            data: series.filter(v => v[data.children[0].type] != 'No Data')
        }

    } else {
        return null
    }
}
const noDataFilter = (c) => c.value != 'No Data'
export const buildPieOptions = (data, includeTotal) => {
    if (data && data.children) {
        const values = []
        let row;
        data.children.filter(noDataFilter)
            .forEach(d => {
                //first level example gender

                d.children.filter(noDataFilter).forEach(d1 => {
                    //second level
                    row = {}
                    if (d1.children) {


                        row.id = d.value + ' - ' + d1.value //Male /African ect (dimension value)
                        row.parent = d.value
                        row.child = d1.value

                        row.label = d.value + ' - ' + d1.value  //Male /African ect (dimension value)
                        d1.children.filter(c => c.value === true).forEach(d2 => {
                            row.value = (d2.sum / d1.sum) * 100
                        })
                    } else {
                        row = {}
                        //no next level thi is smoke
                        row.id = d.value //Male - fmale
                        row.label = d.value //Male - fmale
                        row.parent = d.value
                        row.child = d.value
                        if (d1.value == true) {
                            row.value = (d1.sum / d.sum) * 100
                        }
                    }
                    values.push(row)

                })


            })


        return {
            data: values.sort((d1, d2) => d2.value - d1.value)
        }
    }

}
export const buildDivergingOptions = (data, includeTotal) => {
    const options = buildBarOptions(data, false)
    if (options) {
        const keys = options.keys;
        const divergingData = options.data.map(d => {
            d[keys[0]] = d[keys[0]] * -1
            d[keys[1]] = d[keys[1]]
            return d
        })
        return {...options, data: divergingData}
    } else {
        return null;
    }
}