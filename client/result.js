import React from "react";
import axios from "axios";

class Result extends React.Component {

    constructor(props) {
        super(props);

        this.checkResult = this.checkResult.bind(this);
        this.state = {
            info: "В текущей сессиии импорт не запускался."
        };
    }

    checkResult(id, cnt) {
        console.log("Start checking result for id = " + id + ", cnt = " + cnt);
        var processGetResultError = function (err) {
            if (err.response.status == 404){
                if (cnt < 25) {
                    cnt++
                    setTimeout(this.checkResult, 2000, id, cnt);
                } else {
                    console.log("Result not loaded in 1 minute.");
                }
            } else {
                console.log(err);
            }
        }
        processGetResultError = processGetResultError.bind(this);
        axios.post(`/getResult`, {id : id})
            .then(res => {
                console.log(res);
                this.setState({info: res.data.result});
                this.props.onFinishImport();
            }).catch(processGetResultError);
    }

    render() {
        return (
            <div className="row info_block">
                <div className="result_caption">Результат последнего импорта:</div>
                <div className="result_info" dangerouslySetInnerHTML={{__html: this.state.info}}/>
            </div>
        );
    }
}

export default Result;