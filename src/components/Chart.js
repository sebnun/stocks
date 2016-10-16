import React, { Component } from 'react';
import { LineChart, Line, XAxis, Tooltip } from 'recharts';
import fetchJsonp from 'fetch-jsonp'; 

class Chart extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentWillMount() {
        //download the initial data

         this.setData(this.props.stocks);
    }

    setData(stocks)  {

        //console.log(stocks)

        const elements = stocks.map(stock => {
            return { 'Symbol': stock, 'Type': 'price', 'Params': ['c'] };
        })

        const interactiveChartDataInput = {
            "Normalized":false,
            "NumberOfDays":15,
            "DataPeriod":"Day",
            "Elements": elements
            //"Elements":[{"Symbol":"AAPL","Type":"price","Params":["c"]},{"Symbol":"GOOG","Type":"price","Params":["c"]}]
        };

        let _this = this; 

        fetchJsonp(`http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp?parameters=${JSON.stringify(interactiveChartDataInput)}&jsoncallback=callback`, {
            jsonpCallback: 'callback'
        })
        .then(function(response) {
            return response.json()
        }).then(function(json) {

            let data = [];

            if (json.Dates !== undefined) { //is undefined when no stocks in app
                data = json.Dates.map((date, i) => {

                    let d = { date: (new Date(date)).toLocaleDateString() };

                    json.Elements.forEach(element => {
                        d[element.Symbol] = element.DataSeries.close.values[i]; 
                    });

                    return d;
                }); 
            }

            _this.setState({ data: data });

        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })

        
    }

    componentWillReceiveProps(nextProps) {
        //when getting new props, like an change in stocks from app.js
        //not called at load

        this.setData(nextProps.stocks);
    }



    render() {

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">
                
                    <LineChart width={800} height={600} data={this.state.data} >
                        <XAxis dataKey="date" />
                        <Tooltip />

                        { this.state.data.length > 0 ? Object.keys(this.state.data[0]).map((key) => {
                            if (key !== 'date') {
                                return <Line type="monotone" dataKey={key} stroke="#82ca9d" key={key} />;
                            } else {
                                return ''
                            }
                        }) : ''}

                    </LineChart>

                </div>
            </div>            
        );
    }
}


export default Chart;