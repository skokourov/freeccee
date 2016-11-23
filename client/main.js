import React from "react";
import ReactDOM from "react-dom";
import Top from "./top";
import FileUpload from "./file";
import Result from "./result";


class App extends React.Component {

    constructor(props) {
        super(props);
        this.handleStartImport = this.handleStartImport.bind(this);
        this.handleFinishImport = this.handleFinishImport.bind(this);
        this.handleStartImportFailed = this.handleStartImportFailed.bind(this);
    }

    handleStartImport(id) {
        console.log("Import started with id = " + id);
        this.refs.result.checkResult(id, 0);
    }

    handleStartImportFailed(text) {
        console.log("Import started failed with error :  " + text);
        this.refs.result.showResult(text);
    }

    handleFinishImport() {
        this.refs.top.loadData();
        this.refs.file.importFinished();
    }

    render() {
        return (
            <div>
                <Top ref="top"/>
                <FileUpload onStartImport={this.handleStartImport} onStartImportFailed={this.handleStartImportFailed} ref="file"/>
                <Result onFinishImport={this.handleFinishImport} ref="result"/>
            </div>
        );

    }
}

ReactDOM.render(
    <App/>,
    document.getElementById("app")
);

