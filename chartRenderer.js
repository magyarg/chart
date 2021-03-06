class ChartRenderer {

    /**
     * Constructor
     * Generate sample data after creating
     * the new instance of the chart.
     */
    constructor(options) {
        // Override the Date API addDays proc.
        Date.prototype.addDays = function(days) {
            let date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };

        // Set chart options
        this.options = options;

        // Generate sample data for the default state
        this.sampleDatas = this.populateSampleData();

        // Default definition of the interpolator
        this.interpolator = options.interpolatorType || 'linear';
    }

    /**
     * Sets the interpolator property and
     * detaches the old instance of the chart
     * than re-renders it.
     * @param {String} interpolator
     */
    setInterpolator(interpolator) {
        this.interpolator = interpolator;
        this.destroy();
        this.drawLine();
    }

    /**
     * Updates the sample dataset for the
     * chart and re-renders it.
     */
    update() {
        this.destroy();
        this.sampleDatas = this.populateSampleData();
        this.drawLine();
    }

    /**
     * Selects the SVG container than
     * detaches it from the DOM.
     */
    destroy() {
        d3.select('.chart-graph').remove();
    }

    resize() {
        let canvas = d3.select('.chart-container');
        let rect = canvas.node().getBoundingClientRect();
        this.destroy();
        this.drawLine(rect.width, rect.height);
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
            let pointValue = Math.floor((Math.random() * 100));
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
     */
    drawLine(rectWidth, rectHeight) {
        let margin = { top: 30, right: 20, bottom: 30, left: 100 },
        width = (rectWidth) ? rectWidth - margin.left - margin.right : 1024 - margin.left - margin.right,
        height = (rectHeight) ? rectHeight - margin.top - margin.bottom : 550 - margin.top - margin.bottom;
        let parseDate = d3.time.format('%d-%b-%y').parse;

        // Calculate the ranges
        let x = d3.time.scale().range([0, width]);
        let y = d3.scale.linear().range([height, 0]);

        // Calculate axes
        let xAxis = d3.svg.axis().scale(x)
            .orient('bottom')
            .ticks(this.options.XtickSize);
        let yAxis = d3.svg.axis().scale(y)
            .orient('left').ticks(this.options.YtickSize);

        // Define the valueline
        let valueline = d3.svg.line()
            .x((d) => {
                return x(d.x);
            })
            .y((d) => {
                return y(d.y);
            })
            .interpolate(this.interpolator);
        // Append svg canvas to the body
        let svg = d3.select('.chart-container')
            .append('svg')
                .classed('chart-graph', true)
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