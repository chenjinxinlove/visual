function RanderChinaMap() {
    var _chart = {};
    var _width = 1000, _height = 800,
    _margins = {top: 30, left: 30, right:30, bottom: 30},
    _data = [],
    _colors = d3.scale.category10(),
    _svg,
    _bodyG;

    _chart.render = function () {
        if(!_svg) {
            _svg = d3.select('#china_map').append('svg')
                .attr('height', _height)
                .attr('width', _width);
        }
        renderBody(_svg);
    }
    function renderBody (svg) {
        if (!_bodyG)
            _bodyG = svg.append('g')
                .attr('class', 'body')
                .attr('transform', 'translate('
                    + xStart()
                    + ','
                    + yEnd() + ')')
                .attr('clip-path', 'url(#body-clip)');

        renderChinaMap();
    }
    function renderChinaMap () {
        var projection = d3.geo.mercator()
            .center([107, 31])
            .scale(850)
            .translate([_width / 2, (_height / 2) + 100]);

        var path = d3.geo.path()
            .projection(projection);
        d3.json('./json/china.geojson', function(error, root) {

            if (error)
                return console.error(error);
            console.log(root.features);

            _svg.selectAll('path')
                .data( root.features )
                .enter()
                .append('path')
                .attr('stroke' ,'#000')
                .attr('stroke-width',1)
                .attr('fill', function(d,i){
                    return _colors(i);
                })
                .attr('d', path )
                .on('mouseover',function(d,i){
                    d3.select(this)
                        .attr('fill','yellow');
                })
                .on('mouseout',function(d,i){
                    d3.select(this)
                        .attr('fill',_colors(i));
                });

        });
    }

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };
    return _chart;
}

module.exports =  RanderChinaMap;
