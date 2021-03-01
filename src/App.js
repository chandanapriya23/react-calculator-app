import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import ResultComponent from './components/Result';
import KeyPadComponent from "./components/keypad";

const socket = io("ws://localhost:3001", {
    transports: ["websocket"]
});

class App extends Component {
    constructor(){
        super();

        this.state = {
            result: "",
            calculatedInfo: []
        }
    }

    componentDidMount() {
        socket.on('chat message', (data) => {
            this.onSocketMessage(data);
        })
    }

    onSocketMessage = (data) => {
        this.setState(prevState => ({
            calculatedInfo: [
                data, 
                ...prevState.calculatedInfo.slice(0, 9)
            ]
          }))
    }

    onClick = event => {
        const button  = event.target.name;

        if(button === "="){
            this.calculate()
        } else if(button === "C"){
            this.reset()
        } else if(button === "CE"){
            this.backspace()
        } else {
            this.setState({
                result: this.state.result + button
            })
        }
    };

    calculate = () => {
        let checkResult = ''
        const input = this.state.result
        let output;
        
        if(this.state.result.includes('--')){
            checkResult = this.state.result.replace('--','+')
        }
        else {
            checkResult = this.state.result
        }
        try {
            output = (eval(checkResult) || "" ) + ""
            this.setState({
                result: Math.round(output * 1000000) / 1000000
            })

        } catch (e) {
            this.setState({
                result: "error"
            })
        }
        const calcItem = {input: input,output: Math.round(output * 1000000) / 1000000}

        socket.emit('chat message', calcItem);

    };

    reset = () => {
        this.setState({
            result: ""
        })
    };

    backspace = () => {
        this.setState({
            result: this.state.result.slice(0, -1)
        })
    };
    

    render() {
        return (
            <div>
                <div className="calculator-body">
                    <h1> Calculator</h1>
                    <ResultComponent result={this.state.result}/>
                    <KeyPadComponent onClick={this.onClick}/>
                    {/* <p>&nbsp;</p> 
                    {this.state.calculatedInfo.map((item, index) => 
                    <div className = "a" key={index}>{item.input} = {item.output}</div>)} */}
                    
                </div>
                <p>&nbsp;</p> 
                <div>
                    {this.state.calculatedInfo.map((item, index) => 
                    <div className = "a" key={index}>{item.input} = {item.output}</div>)}
                </div>
            </div>
        );
    }
}

export default App;

