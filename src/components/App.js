import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { firebaseApp } from '../firebase';

import Chart from './Chart';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      stocks: [],
      value: ''
    }
  }

  componentWillMount() {

    firebaseApp.database().ref('stocks').on('value', (snapshot) => {

      let stocks = [];

      if (snapshot.val() !== null) {
        stocks = Object.keys(snapshot.val()).map(key => {
          return key;
        })
      }
      this.setState({ stocks })

      //console.log(this.state.stocks)
    });

  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value.toUpperCase(),
    });
  };

  handleRequestDelete = (stock) => {

    const updates = {};
    updates[`stocks/${stock}`] = null;

    firebaseApp.database().ref().update(updates);
  };


  handleSubmit = () => {
    if (this.state.stocks.indexOf(this.state.value) === -1) {
      const updates = {};
      updates[`stocks/${this.state.value}`] = true;

      firebaseApp.database().ref().update(updates);
    }

    this.setState({ value: '' });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="container">

          <Chart stocks={this.state.stocks} />

          <div className="row">
            <div className="col-sm-12 text-xs-center">

              <TextField
                hintText="Stock Symbol"
                value={this.state.value}
                onChange={this.handleChange}
                /> &nbsp;&nbsp;&nbsp;
            <RaisedButton label="Add" primary={true} onTouchTap={this.handleSubmit} />


            </div>
          </div>

          <div className="row">
            <div className="col-sm-12 text-xs-center" style={{ display: 'flex', flexWrap: 'wrap' }}>


              {
                this.state.stocks.map(stock => {
                  return (
                    <div key={stock}>
                      <Chip
                        style={{ margin: 10 }}
                        onRequestDelete={() => this.handleRequestDelete(stock)}
                        >
                        {stock}
                      </Chip>
                    </div>
                  )
                })
              }

            </div>
          </div>


        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
