class ChartRenderer {

    /**
     * Constructor
     * Generate sample data after creating
     * the new instance of the chart.
     */
    constructor() {
        // Override the Date API addDays proc.
        Date.prototype.addDays = function(days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        // Generate sample data for the default state
        this.sampleDatas = this.populateSampleData();
    }

    /**
     * Populate random value points for the
     * newly created dates.
     * @return Array of objects
     */
    populateSampleData() {
        let sampleDatas = [];
        let dates = this.generateDateRange(new Date(), (new Date().addDays(55)));
        dates.forEach(function(date) {
            let pointValue = Math.floor((Math.random() * 100) + 1);
            let point = {
                x: date,
                y: [pointValue]
            };
            sampleDatas.push(point);
        });
        return sampleDatas;
    }

    /**
     * Generates Date objects bewtween
     * two dates objects and pushes into an
     * array
     * @param {Date} startDate
     * @param {Date} endDate
     * @return Array of objects
     */
    generateDateRange(startDate, endDate) {
        let dateArray = new Array();
        let currentDate = startDate;
        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }

    /**
     * Draws the actual SVG line and places the
     * value paths.
     * @param {Object} chartOptions
     */
    drawLine(chartOptions) {
        let margin = { top: 30, right: 20, bottom: 30, left: 100 },
            width = 1024 - margin.left - margin.right,
            height = 550 - margin.top - margin.bottom;
        let parseDate = d3.time.format('%d-%b-%y').parse;

        // Calculate the ranges
        let x = d3.time.scale().range([0, width]);
        let y = d3.scale.linear().range([height, 0]);

        // Calculate axes
        let xAxis = d3.svg.axis().scale(x)
            .orient('bottom')
            .ticks(chartOptions.XtickSize);
        let yAxis = d3.svg.axis().scale(y)
            .orient('left').ticks(chartOptions.YtickSize);

        // Define the valueline
        let valueline = d3.svg.line()
            .x((d) => {
                return x(d.x);
            })
            .y((d) => {
                return y(d.y);
            })
            .interpolate(chartOptions.interpolatorType);
        // Append svg canvas to the body
        let svg = d3.select('.chart-container')
            .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        let data = this.sampleDatas;

        // Scale the range of data
        x.domain(d3.extent(data, function(d) { return d.x; }));
        y.domain([0, d3.max(data, function(d) { return d.y; })]);

        // Append valueline path
        svg.append('path')
            .attr('class', 'line')
            .attr('d', valueline(data));

        // Append X axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0, ' + height + ')')
            .call(xAxis);

        // Append Y axis
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    }
};